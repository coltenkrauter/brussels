const SUPPORTED_REFS = ['main', 'development'];
const SUPPORTED_REF_TYPES = ['branch', 'tag'];
const capitalize = (text: string): string => text.charAt(0).toUpperCase() + text.slice(1);

// Environment variables
const githubRef = process.env.GITHUB_REF_NAME || 'n/a';
const githubRefType = process.env.GITHUB_REF_TYPE || 'n/a';
const githubRepository = process.env.GITHUB_REPOSITORY || '';
const githubServerUrl = process.env.GITHUB_SERVER_URL || '';
const githubSha = process.env.GITHUB_SHA || '';
const secretNextAuth = process.env.SECRET_NEXT_AUTH || 'n/a';
// 
// Project specific config
// Codename theme: Travel destinations
const codename = 'brussels';
const developerEmail = 'coltenkrauter+cdk-brussels@gmail.com';
const domainBase = 'rememberval.com';
const isBranch = githubRefType === 'branch';
const isTag = githubRefType === 'tag';
const projectName = 'Remember Val';

const isMerge = isBranch && githubRef.includes('/merge');

export enum STAGE {
  DEV = 'dev',
  ALPHA = 'alpha',
  BETA = 'beta',
  PROD = 'prod',
}
const getStage = (): STAGE => {
  if (isBranch) {
    if (isMerge || githubRef === 'development') {
      return STAGE.ALPHA;
    }
    if (githubRef === 'main') {
      return STAGE.BETA;
    }
    throw `Unsupported branch name "${githubRef}", must be a merge/pr or one of [${SUPPORTED_REFS.join(', ')}]`;
  }
  if (isTag) {
    return STAGE.PROD;
  }
  if (githubRef === 'n/a') {
    return STAGE.DEV;
  }
  throw `Unsupported githubRef type "${githubRefType}", must be one of [${SUPPORTED_REF_TYPES.join(', ')}]`;
  return STAGE.DEV;
};
const stage = getStage();

// Stage specific config
const stageCapitalized = capitalize(stage);
const codenameCapitalized = capitalize(codename);
const domainPrefix: { [key: string]: string } = {
  dev: 'dev.',
  alpha: 'alpha.',
  beta: 'beta.',
  prod: '',
};
const topicBounceComplaintEmail: { [key: string]: string } = {
  dev: developerEmail,
  alpha: developerEmail,
  beta: developerEmail,
  prod: developerEmail,
};


const dbMailingList = `${stage}-mailing-list`;
const domainStage = `${domainPrefix[stage]}${domainBase}`;
const prefixCamelCase = `${stageCapitalized}${codenameCapitalized}`;
const prefixKebabCase = `${stage}-${codename}-`;

export interface Config {
  bucketConfigName: string;
  codename: string;
  codenameCapitalized: string;
  dbMailingList: string;
  developerEmail: string;
  domainBase: string;
  domainPrefix: string | undefined;
  domainStage: string;
  emailDefaultSender: string;
  githubRef: string;
  githubRefType: string;
  githubRepository: string;
  githubServerUrl: string;
  githubSha: string;
  hCaptchaSecret: string;
  isBranch: boolean;
  isMerge: boolean;
  isProd: boolean;
  isTag: boolean;
  prefixCamelCase: string;
  prefixKebabCase: string;
  projectName: string;
  secretNextAuth: string;
  stage: string;
  topicBounceComplaintEmail: string;
  topicBounceComplaintName: string;
  zoneId: string;
}

export const getConfig = () => {
  return {
    bucketConfigName: `${prefixKebabCase}config-bucket`,
    codename,
    codenameCapitalized,
    dbMailingList,
    developerEmail,
    domainBase,
    domainPrefix: domainPrefix[stage],
    domainStage,
    emailDefaultSender: `no-reply@${domainStage}`,
    githubRef,
    githubRefType,
    githubRepository,
    githubServerUrl,
    githubSha,
    hCaptchaSecret: `${process.env.HCAPTCHA_SECRET}`, // Sourced from GitHub secrets
    isBranch,
    isMerge,
    isProd: stage === STAGE.PROD,
    isTag,
    prefixCamelCase,
    prefixKebabCase,
    projectName,
    secretNextAuth,
    stage,
    topicBounceComplaintEmail: `${topicBounceComplaintEmail[stage]}`,
    topicBounceComplaintName: `${prefixCamelCase}BounceComplaint`,
    zoneId: `${codenameCapitalized}HostedZone`,
  };
};
