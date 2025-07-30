import { Injectable } from '@nestjs/common';
import { ServiceRequest, ServiceResponse, RequestHandler } from './request-response.interface';
import { FindDeliveryManUseCase } from '../../core/application/use-cases/find-deliveryman.use-case';
import { FindDeliveryManByCpfUseCase } from '../../core/application/use-cases/find-deliveryman-by-cpf.use-case';
import { DeliveryManNotFoundError } from '../../core/domain/errors/deliveryman-errors';

@Injectable()
export class DeliveryManRequestHandler implements RequestHandler {
  constructor(
    private readonly findDeliveryManUseCase: FindDeliveryManUseCase,
    private readonly findDeliveryManByCpfUseCase: FindDeliveryManByCpfUseCase,
  ) {}

  async handle(request: ServiceRequest): Promise<ServiceResponse> {
    try {
      switch (request.type) {
        case 'VALIDATE_DELIVERYMAN_BY_CPF':
          return await this.handleValidateByCpf(request);
        
        case 'GET_DELIVERYMAN_BY_ID':
          return await this.handleGetById(request);
        
        default:
          return this.createErrorResponse(
            request.requestId,
            'UNSUPPORTED_REQUEST_TYPE',
            `Request type ${request.type} is not supported`
          );
      }
    } catch (error) {
      return this.createErrorResponse(
        request.requestId,
        'INTERNAL_ERROR',
        error.message
      );
    }
  }

  private async handleValidateByCpf(request: ServiceRequest): Promise<ServiceResponse> {
    try {
      const { cpf } = request.data;
      
      if (!cpf) {
        return this.createErrorResponse(
          request.requestId,
          'MISSING_CPF',
          'CPF is required'
        );
      }

      const deliveryMan = await this.findDeliveryManByCpfUseCase.execute(cpf);
      
      return {
        requestId: request.requestId,
        type: 'DELIVERYMAN_VALIDATION_RESPONSE',
        status: 'SUCCESS',
        data: {
          id: deliveryMan.id,
          email: deliveryMan.email,
          name: deliveryMan.name,
          cpf: deliveryMan.cpf,
          passwordHash: deliveryMan.password,
          isActive: deliveryMan.isActive,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      if (error instanceof DeliveryManNotFoundError) {
        return this.createErrorResponse(
          request.requestId,
          'DELIVERYMAN_NOT_FOUND',
          'Delivery man not found'
        );
      }
      throw error;
    }
  }

  private async handleGetById(request: ServiceRequest): Promise<ServiceResponse> {
    try {
      const { id } = request.data;
      
      if (!id) {
        return this.createErrorResponse(
          request.requestId,
          'MISSING_ID',
          'ID is required'
        );
      }

      const deliveryMan = await this.findDeliveryManUseCase.execute(id);
      
      return {
        requestId: request.requestId,
        type: 'DELIVERYMAN_DATA_RESPONSE',
        status: 'SUCCESS',
        data: {
          id: deliveryMan.id,
          email: deliveryMan.email,
          name: deliveryMan.name,
          cpf: deliveryMan.cpf,
          phone: deliveryMan.phone,
          isActive: deliveryMan.isActive,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      if (error instanceof DeliveryManNotFoundError) {
        return this.createErrorResponse(
          request.requestId,
          'DELIVERYMAN_NOT_FOUND',
          'Delivery man not found'
        );
      }
      throw error;
    }
  }



  private createErrorResponse(requestId: string, code: string, message: string): ServiceResponse {
    return {
      requestId,
      type: 'ERROR_RESPONSE',
      status: 'ERROR',
      error: { code, message },
      timestamp: new Date().toISOString(),
    };
  }
}