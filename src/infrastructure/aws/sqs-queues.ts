import * as cdk from 'aws-cdk-lib';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';

export class SQSQueues extends Construct {
  public readonly deliverymanEventsQueue: sqs.Queue;
  public readonly packageEventsQueue: sqs.Queue;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.deliverymanEventsQueue = new sqs.Queue(this, 'DeliverymanEventsQueue', {
      queueName: 'deliveryman-events',
      visibilityTimeout: cdk.Duration.seconds(300),
      retentionPeriod: cdk.Duration.days(14),
      deadLetterQueue: {
        queue: new sqs.Queue(this, 'DeliverymanEventsDLQ', {
          queueName: 'deliveryman-events-dlq',
        }),
        maxReceiveCount: 3,
      },
    });

    this.packageEventsQueue = new sqs.Queue(this, 'PackageEventsQueue', {
      queueName: 'package-events',
      visibilityTimeout: cdk.Duration.seconds(300),
      retentionPeriod: cdk.Duration.days(14),
      deadLetterQueue: {
        queue: new sqs.Queue(this, 'PackageEventsDLQ', {
          queueName: 'package-events-dlq',
        }),
        maxReceiveCount: 3,
      },
    });
  }
}