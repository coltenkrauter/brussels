// https://serverless-nextjs.com/docs/cdkconstruct/

import { AttributeType, Table, BillingMode, TableClass, TableEncryption, ProjectionType } from 'aws-cdk-lib/aws-dynamodb';
import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';
import { Construct } from 'constructs';
import { HostedZone } from 'aws-cdk-lib/aws-route53';
import { NextJSLambdaEdge } from '@sls-next/cdk-construct';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { Stack, StackProps, Duration, CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { EmailSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { VerifySesDomain, VerifySesEmailAddress } from '@seeebiii/ses-verify-identities';

import { Config } from '../config';

interface NextProps extends StackProps {
  config: Config;
}

export class Next extends Stack {
  constructor(scope: Construct, id: string, props: NextProps) {
    super(scope, id, props);

    // Dynamo
    const table = new Table(this, 'table', {
      billingMode: BillingMode.PAY_PER_REQUEST,
      encryption: TableEncryption.AWS_MANAGED,
      partitionKey: { name: 'id', type: AttributeType.STRING },
      sortKey: { name: 'created', type: AttributeType.STRING },
      pointInTimeRecovery: true,
      removalPolicy: props.config.isProd ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
      tableClass: TableClass.STANDARD_INFREQUENT_ACCESS,
      tableName: props.config.dbMailingList,
    });

    // 👇 add global secondary index
    table.addGlobalSecondaryIndex({
      indexName: 'email',
      partitionKey: { name: 'email', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
      sortKey: { name: 'created', type: AttributeType.STRING },
    });

    // DNS & certs
    const hostedZone = HostedZone.fromLookup(this, `${id}HostedZone`, {
      domainName: props.config.domainBase,
    });
    const certificate = new Certificate(this, `${id}Certificate`, {
      domainName: props.config.domainStage,
      subjectAlternativeNames: [`www.${props.config.domainStage}`],
      validation: CertificateValidation.fromDns(hostedZone),
    });

    // Email
    const notificationTopic = new Topic(this, props.config.topicBounceComplaintName, { displayName: props.config.topicBounceComplaintName });
    notificationTopic.addSubscription(new EmailSubscription(props.config.topicBounceComplaintEmail));
    new VerifySesDomain(this, 'SesDomainVerification', {
      domainName: props.config.domainStage,
      hostedZoneName: props.config.domainBase,
      notificationTopic,
    });
    new VerifySesEmailAddress(this, 'NoReply', {
      emailAddress: props.config.emailDefaultSender,
    });
    new VerifySesEmailAddress(this, `${props.config.topicBounceComplaintName}Email`, {
      emailAddress: props.config.topicBounceComplaintEmail,
    });

    // Next
    const nextApp = new NextJSLambdaEdge(this, `${id}Edge`, {
      serverlessBuildOutDir: './build',
      description: `${id} functions created by NextJSLambdaEdge construct`,
      runtime: Runtime.NODEJS_14_X,
      memory: 1024,
      timeout: Duration.seconds(30),
      withLogging: true,
      cachePolicyName: {
        staticsCache: `${id}StaticsCache`,
        imageCache: `${id}ImageCache`,
        lambdaCache: `${id}LambdaCache`,
      },
      name: {
        apiLambda: `${id}Api`,
        defaultLambda: `${id}Default`,
        imageLambda: `${id}Image`,
      },
      domain: {
        certificate,
        domainNames: [props.config.domainStage, `www.${props.config.domainStage}`],
        hostedZone,
      },
      cloudfrontProps: {
        comment: id,
      },
      s3Props: {
        bucketName: `${props.config.prefixKebabCase}next-bucket`,
      },
    });

    if (!!nextApp.nextApiLambda) {
      table.grantReadWriteData(nextApp.nextApiLambda);
    }

    new CfnOutput(this, `${id}CloudFormationDistributionDomain`, {
      value: nextApp.distribution.domainName,
    });

    new CfnOutput(this, `${id}Domain`, {
      value: nextApp?.aRecord?.domainName || props.config.domainStage,
    });
  }
}
