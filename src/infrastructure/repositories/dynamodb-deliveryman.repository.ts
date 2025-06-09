import { DynamoDB } from 'aws-sdk';
import { DeliveryMan } from '../../core/domain/entities/deliveryman.entity';
import { DeliveryManRepository } from '../../core/domain/repositories/deliveryman-repository.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DynamoDBDeliveryManRepository implements DeliveryManRepository {
  private readonly tableName = 'DeliveryMen';
  private readonly dynamoDB: DynamoDB.DocumentClient;

  constructor() {
    this.dynamoDB = new DynamoDB.DocumentClient();
  }

  async create(deliveryMan: DeliveryMan): Promise<void> {
    await this.dynamoDB
      .put({
        TableName: this.tableName,
        Item: {
          ...deliveryMan.toJSON(),
          createdAt: deliveryMan.createdAt.toISOString(),
          updatedAt: deliveryMan.updatedAt.toISOString(),
        },
      })
      .promise();
  }

  async findById(id: string): Promise<DeliveryMan | null> {
    const result = await this.dynamoDB
      .get({
        TableName: this.tableName,
        Key: { id },
      })
      .promise();

    if (!result.Item) {
      return null;
    }

    return this.mapToEntity(result.Item);
  }

  async findAll(): Promise<DeliveryMan[]> {
    const result = await this.dynamoDB
      .scan({
        TableName: this.tableName,
      })
      .promise();

    return (result.Items || []).map(this.mapToEntity);
  }

  async update(deliveryMan: DeliveryMan): Promise<void> {
    
    const updateExpressionParts: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {
      ':updatedAt': deliveryMan.updatedAt.toISOString(),
    };

    if (deliveryMan.name) {
      updateExpressionParts.push('#name = :name');
      expressionAttributeNames['#name'] = 'name';
      expressionAttributeValues[':name'] = deliveryMan.name;
    }

    if (deliveryMan.email) {
      updateExpressionParts.push('email = :email');
      expressionAttributeValues[':email'] = deliveryMan.email;
    }

    if (deliveryMan.phone) {
      updateExpressionParts.push('phone = :phone');
      expressionAttributeValues[':phone'] = deliveryMan.phone;
    }

    if (deliveryMan.password) {
      updateExpressionParts.push('#password = :password');
      expressionAttributeNames['#password'] = 'password';
      expressionAttributeValues[':password'] = deliveryMan.password;
    }

    updateExpressionParts.push('isActive = :isActive');
    updateExpressionParts.push('updatedAt = :updatedAt');
    expressionAttributeValues[':isActive'] = deliveryMan.isActive;

    const updateExpression = `set ${updateExpressionParts.join(', ')}`;

    await this.dynamoDB
      .update({
        TableName: this.tableName,
        Key: { id: deliveryMan.id },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
      })
      .promise();
  }

  async delete(id: string): Promise<void> {
    await this.dynamoDB
      .delete({
        TableName: this.tableName,
        Key: { id },
      })
      .promise();
  }

  private mapToEntity(item: any): DeliveryMan {
    return new DeliveryMan(
      item.id,
      item.name,
      item.email,
      item.cpf,
      item.phone,
      item.password,
      item.isActive,
      new Date(item.createdAt),
      new Date(item.updatedAt),
    );
  }
}