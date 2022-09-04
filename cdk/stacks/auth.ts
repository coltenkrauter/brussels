import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from 'aws-cdk-lib/custom-resources';
import { BlockPublicAccess, Bucket, BucketAccessControl, BucketEncryption, BucketProps } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { Key } from 'aws-cdk-lib/aws-kms';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Stack, StackProps, aws_cognito, CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import { StaticSiteAuthorization, StaticSiteDistribution, RetrieveUserPoolClientSecret } from '@cloudcomponents/cdk-cloudfront-authorization';
import { writeJSON } from '@bevry/jsonfile';

import { UserPoolUser } from '../cdk-userpool-user';
import { Config } from '../config';

interface AuthProps extends StackProps {
  config: Config;
}

export class CloudFrontAuthorizationStack extends Stack {
  constructor(scope: Construct, id: string, props: AuthProps) {
    super(scope, id, props);

    const userPool: aws_cognito.UserPool = new aws_cognito.UserPool(this, 'UserPool', {
      selfSignUpEnabled: false,
      userPoolName: `${props.config.prefixKebabCase}cloudfront-authorization-userpool`,
    });

    new UserPoolUser(this, 'John', {
      userPool,
      username: 'john123',
      password: 'Passw0$rd',
    });

    // UserPool must have a domain!
    const domain = userPool.addDomain('Domain', {
      cognitoDomain: {
        domainPrefix: 'cloudcomponents',
      },
    });

    const authorization = new StaticSiteAuthorization(this, 'Authorization', {
      userPool,
    });

    const clientSecret = new RetrieveUserPoolClientSecret(this, id + 'UserPoolClientSecret', { userPoolClient: authorization.userPoolClient, userPool }).clientSecret;
    const config = {
      // domainCloudFrontDomainName: domain.cloudFrontDomainName,
      // domainName: domain.domainName,
      // userPoolId: userPool.userPoolId,
      // userPoolProviderName: userPool.userPoolProviderName,
      // userPoolProviderUrl: userPool.userPoolProviderUrl,
      clientSecret,
      domain: domain.baseUrl(),
      redirectPaths: authorization.redirectPaths,
      signOutUrlPath: authorization.signOutUrlPath,
      userPoolArn: userPool.userPoolArn,
      userPoolClientId: authorization.userPoolClient.userPoolClientId,
    };

    new StaticSiteDistribution(this, 'Distribution', {
      authorization,
    });

    const bucketName = props.config.bucketConfigName;
    const bucket = new Bucket(this, bucketName, {
      bucketName,
      accessControl: BucketAccessControl.LOG_DELIVERY_WRITE,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      encryption: BucketEncryption.KMS,
      enforceSSL: true,
      encryptionKey: new Key(this, `${bucketName}-key`, { enableKeyRotation: true }),
      removalPolicy: props.config.isProd ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
      serverAccessLogsPrefix: 'access-logs/',
      versioned: true,
    });

    new AwsCustomResource(this, `${props.config.prefixCamelCase}AuthConfig`, {
      logRetention: RetentionDays.ONE_DAY,
      onUpdate: {
        action: 'putObject',
        parameters: {
          Body: JSON.stringify(config),
          Bucket: bucket.bucketName,
          CacheControl: 'max-age=0, no-cache, no-store, must-revalidate',
          ContentType: 'application/json',
          Key: 'config.json',
        },
        physicalResourceId: PhysicalResourceId.of('config'),
        service: 'S3',
      },
      policy: AwsCustomResourcePolicy.fromStatements([
        new PolicyStatement({
          actions: ['s3:PutObject'],
          resources: [bucket.arnForObjects('config.json')],
        }),
        new PolicyStatement({
          actions: ['kms:GenerateDataKey'],
          resources: AwsCustomResourcePolicy.ANY_RESOURCE,
        }),
      ]),
    });

  }
}
