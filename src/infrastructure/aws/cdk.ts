
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { FastfeetStack } from './fastfeet-stack';

const app = new cdk.App();
new FastfeetStack(app, 'FastfeetStack', {
  env: { 
    account: process.env.CDK_DEFAULT_ACCOUNT, 
    region: process.env.CDK_DEFAULT_REGION 
  },
});