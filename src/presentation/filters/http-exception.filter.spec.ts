import { HttpExceptionFilter } from './http-exception.filter';
import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let mockArgumentsHost: jest.Mocked<ArgumentsHost>;
  let mockRequest: jest.Mocked<Request>;
  let mockResponse: jest.Mocked<Response>;

  beforeEach(() => {
    filter = new HttpExceptionFilter();
    
    mockRequest = {
      url: '/test',
    } as any;

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as any;

    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
        getResponse: jest.fn().mockReturnValue(mockResponse),
      }),
    } as any;
  });

  describe('catch', () => {
    it('should handle HttpException with object response', () => {
      const exception = new HttpException(
        { message: 'Test error', error: 'Bad Request' },
        HttpStatus.BAD_REQUEST
      );

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.BAD_REQUEST,
        timestamp: expect.any(String),
        path: '/test',
        message: 'Test error',
      });
    });

    it('should handle HttpException with string response', () => {
      const exception = new HttpException('Test error', HttpStatus.NOT_FOUND);

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.NOT_FOUND,
        timestamp: expect.any(String),
        path: '/test',
        message: 'Test error',
      });
    });

    it('should handle HttpException with array message', () => {
      const exception = new HttpException(
        { message: ['Error 1', 'Error 2'] },
        HttpStatus.BAD_REQUEST
      );

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.BAD_REQUEST,
        timestamp: expect.any(String),
        path: '/test',
        message: 'Http Exception',
      });
    });

    it('should format timestamp correctly', () => {
      const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST);
      const beforeCall = new Date();

      filter.catch(exception, mockArgumentsHost);

      const afterCall = new Date();
      const callArgs = mockResponse.json.mock.calls[0][0];
      const timestamp = new Date(callArgs.timestamp);

      expect(timestamp.getTime()).toBeGreaterThanOrEqual(beforeCall.getTime());
      expect(timestamp.getTime()).toBeLessThanOrEqual(afterCall.getTime());
    });
  });
});