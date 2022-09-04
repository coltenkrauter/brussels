import { App } from 'aws-cdk-lib';
import { Builder } from '@sls-next/lambda-at-edge';
import { writeJSON } from '@bevry/jsonfile';

import { getConfig, STAGE } from './config';
import { Next } from './stacks/next';

const builder = new Builder('.', './build', { args: ['build'] });
const config = getConfig();

const main = async () => {
  const app = new App();

  if (config.stage !== STAGE.DEV) {
    // This is a hacky way of distributing secrets/config to a Lambda@Edge Function as they cannot use environment variables
    writeJSON('config.json', config);
  }

  // Build the NextJS app
  await builder.build();

  // Deploy the NextJS app
  new Next(app, `${config.prefixCamelCase}Next`, {
    terminationProtection: config.isProd,
    env: {
      account: process.env.AWS_DEFAULT_ACCOUNT_ID,
      region: process.env.AWS_DEFAULT_REGION || 'us-east-1',
    },
    analyticsReporting: true,
    description: 'The Next stack',
    config,
  });
};

main();
