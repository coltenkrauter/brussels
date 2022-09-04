import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from 'aws-cdk-lib/custom-resources';
import { CfnUserPoolUserToGroupAttachment, IUserPool } from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

export class UserPoolUser extends Construct {
    constructor(scope: Construct, id: string, props: {
        userPool: IUserPool,
        username: string,
        password: string,
        groupName?: string,
    }) {
        super(scope, id);

        const username = props.username;
        const password = props.password;

        // Create the user inside the Cognito user pool using Lambda backed AWS Custom resource
        const adminCreateUser = new AwsCustomResource(this, 'AwsCustomResource-CreateUser', {
            onCreate: {
                service: 'CognitoIdentityServiceProvider',
                action: 'adminCreateUser',
                parameters: {
                    UserPoolId: props.userPool.userPoolId,
                    Username: username,
                    MessageAction: 'SUPPRESS',
                    TemporaryPassword: password,
                },
                physicalResourceId: PhysicalResourceId.of(`AwsCustomResource-CreateUser-${username}`),
            },
            onDelete: {
                service: 'CognitoIdentityServiceProvider',
                action: 'adminDeleteUser',
                parameters: {
                    UserPoolId: props.userPool.userPoolId,
                    Username: username,
                },
            },
            policy: AwsCustomResourcePolicy.fromSdkCalls({resources: AwsCustomResourcePolicy.ANY_RESOURCE}),
        });

        const adminSetUserPassword = new AwsCustomResource(adminCreateUser, 'AwsCustomResource-ForcePassword', {
            onCreate: {
                service: 'CognitoIdentityServiceProvider',
                action: 'adminSetUserPassword',
                parameters: {
                    UserPoolId: props.userPool.userPoolId,
                    Username: username,
                    Password: password,
                    Permanent: true,
                },
                physicalResourceId: PhysicalResourceId.of(`AwsCustomResource-ForcePassword-${username}`),
            },
            policy: AwsCustomResourcePolicy.fromSdkCalls({resources: AwsCustomResourcePolicy.ANY_RESOURCE}),
        });

        // If a Group Name is provided, also add the user to this Cognito UserPool Group
        if (props.groupName) {
            const userToGroupAttachment = new CfnUserPoolUserToGroupAttachment(this, 'AttachUserToGroup', {
                userPoolId: props.userPool.userPoolId,
                groupName: props.groupName,
                username: username,
            });
            userToGroupAttachment.node.addDependency(adminCreateUser);
            userToGroupAttachment.node.addDependency(adminSetUserPassword);
            userToGroupAttachment.node.addDependency(props.userPool);
        }
    }
}
