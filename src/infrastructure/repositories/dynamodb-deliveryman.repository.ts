import { Injectable } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { 
  DynamoDBDocumentClient, 
  PutCommand, 
  GetCommand, 
  ScanCommand, 
  UpdateCommand, 
  DeleteCommand 
} from '@aws-sdk/lib-dynamodb';
import { DeliveryMan } from '../../core/domain/entities/deliveryman.entity';
import { DeliveryManRepository } from '../../core/domain/repositories/deliveryman-repository.interface';
import { DatabaseConnectionError, DatabaseQueryError } from '../errors/database-errors';
import { DeliveryManNotFoundError } from '../../core/domain/errors/deliveryman-errors';

@Injectable()
export class DynamoDBDeliveryManRepository implements DeliveryManRepository {
  private readonly tableName = 'DeliveryMen';
  private readonly ddbDocClient: DynamoDBDocumentClient;

  constructor() {
    try {
      const client = new DynamoDBClient({});
      this.ddbDocClient = DynamoDBDocumentClient.from(client);
    } catch (error) {
      throw new DatabaseConnectionError(error.message);
    }
  }

  async create(deliveryMan: DeliveryMan): Promise<void> {
    try {
      const command = new PutCommand({
        TableName: this.tableName,
        Item: {
          ...deliveryMan.toJSON(),
          createdAt: deliveryMan.createdAt.toISOString(),
          updatedAt: deliveryMan.updatedAt.toISOString(),
        },
      });

      await this.ddbDocClient.send(command);
    } catch (error) {
      throw new DatabaseQueryError('create', error.message);
    }
  }

  async findById(id: string): Promise<DeliveryMan | null> {
    try {
      const command = new GetCommand({
        TableName: this.tableName,
        Key: { id },
      });

      const response = await this.ddbDocClient.send(command);

      if (!response.Item) {
        return null;
      }

      return this.mapToEntity(response.Item);
    } catch (error) {
      throw new DatabaseQueryError('findById', error.message);
    }
  }

  async findAll(): Promise<DeliveryMan[]> {
    try {
      const command = new ScanCommand({
        TableName: this.tableName,
      });

      const response = await this.ddbDocClient.send(command);

      return (response.Items || []).map(this.mapToEntity);
    } catch (error) {
      throw new DatabaseQueryError('findAll', error.message);
    }
  }

  async update(deliveryMan: DeliveryMan): Promise<void> {
    try {
      // Check if delivery man exists
      const existingDeliveryMan = await this.findById(deliveryMan.id);
      if (!existingDeliveryMan) {
        throw new DeliveryManNotFoundError(deliveryMan.id);
      }

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

      const command = new UpdateCommand({
        TableName: this.tableName,
        Key: { id: deliveryMan.id },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
      });

      await this.ddbDocClient.send(command);
    } catch (error) {
      if (error instanceof DeliveryManNotFoundError) {
        throw error;
      }
      throw new DatabaseQueryError('update', error.message);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      // Check if delivery man exists
      const existingDeliveryMan = await this.findById(id);
      if (!existingDeliveryMan) {
        throw new DeliveryManNotFoundError(id);
      }

      const command = new DeleteCommand({
        TableName: this.tableName,
        Key: { id },
      });

      await this.ddbDocClient.send(command);
    } catch (error) {
      if (error instanceof DeliveryManNotFoundError) {
        throw error;
      }
      throw new DatabaseQueryError('delete', error.message);
    }
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