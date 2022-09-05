// https://serverless-nextjs.com/docs/cdkconstruct/

import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';
import { Construct } from 'constructs';
import { HostedZone, ARecord, RecordTarget, CnameRecord } from 'aws-cdk-lib/aws-route53';
import { Metric } from 'aws-cdk-lib/aws-cloudwatch';
import { NextJSLambdaEdge } from '@sls-next/cdk-construct';
import { Route53RecordTarget } from 'aws-cdk-lib/aws-route53-targets';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { Stack, StackProps, Duration, CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import { Topic } from 'aws-cdk-lib/aws-sns';

import { Config } from '../config';

interface NextProps extends StackProps {
  config: Config;
}

export class Next extends Stack {
  constructor(scope: Construct, id: string, props: NextProps) {
    super(scope, id, props);

    // DNS & certs
    const zone = new HostedZone(this, `${id}HostedZone`, {
      zoneName: props.config.domainBase,
    });
    zone.applyRemovalPolicy(RemovalPolicy.DESTROY);
    const metric = new Metric({
      namespace: 'AWS/Route53',
      metricName: 'DNSQueries',
      dimensionsMap: {
        HostedZoneId: zone.hostedZoneId
      }
    });

    // const record =vnew ARecord(this, 'AliasRecord', {
    //   zone,
    //   target: RecordTarget.fromAlias(new Route53RecordTarget(props.config.domainBase),,
    //   deleteExisting: true,
    //   ttl: Duration.minutes(5),
    // });
    // record.applyRemovalPolicy(RemovalPolicy.DESTROY);

    // const cname = new CnameRecord(this, `${props.config.stage}CnameRecord`, {
    //   recordName: props.config.stage,
    //   zone,
    //   domainName: props.config.domainStage,
    //   deleteExisting: true,
    //   ttl: Duration.minutes(5),
    // });
    // cname.applyRemovalPolicy(RemovalPolicy.DESTROY);

    const certificate = new Certificate(this, `${id}Certificate`, {
      domainName: props.config.domainStage,
      subjectAlternativeNames: [`www.${props.config.domainStage}`],
      // Must use email validation since the dns isn't configured at this point
      validation: CertificateValidation.fromEmail({props.config.developerEmail}),
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
        hostedZone: zone,
      },
      cloudfrontProps: {
        comment: id,
      },
      s3Props: {
        bucketName: `${props.config.prefixKebabCase}next-bucket`,
      },
    });

    new CfnOutput(this, `${id}CloudFormationDistributionDomain`, {
      value: nextApp.distribution.domainName,
    });

    new CfnOutput(this, `${id}Domain`, {
      value: nextApp?.aRecord?.domainName || props.config.domainStage,
    });
  }
}
