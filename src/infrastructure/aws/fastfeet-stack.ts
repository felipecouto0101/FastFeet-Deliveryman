import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { DeliveryManTable } from './dynamodb-table';

export class FastfeetStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    
    const deliveryManTable = new DeliveryManTable(this, 'DeliveryManTable');
  }
}