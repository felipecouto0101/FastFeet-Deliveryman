
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { FastFeetStack } from './fastfeet-stack';

const app = new cdk.App();
new FastFeetStack(app, 'FastFeetStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
  },
});