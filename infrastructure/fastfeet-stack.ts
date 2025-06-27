import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { DeliveryManTable } from '../src/infrastructure/aws/dynamodb-table';
import { SQSQueues } from '../src/infrastructure/aws/sqs-queues';

export class FastFeetStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    const deliveryMenTable = new DeliveryManTable(this, 'DeliveryMenTable');

    
    const sqsQueues = new SQSQueues(this, 'SQSQueues');

   
    new cdk.CfnOutput(this, 'DeliveryMenTableName', {
      value: deliveryMenTable.table.tableName,
      description: 'DynamoDB table name for delivery men',
    });

    new cdk.CfnOutput(this, 'DeliverymanEventsQueueUrl', {
      value: sqsQueues.deliverymanEventsQueue.queueUrl,
      description: 'SQS queue URL for deliveryman events',
    });

    new cdk.CfnOutput(this, 'PackageEventsQueueUrl', {
      value: sqsQueues.packageEventsQueue.queueUrl,
      description: 'SQS queue URL for package events',
    });
  }
}