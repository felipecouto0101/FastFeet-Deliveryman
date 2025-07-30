export interface ServiceRequest {
  requestId: string;
  type: string;
  data: any;
  replyTo: string;
  timestamp: string;
}

export interface ServiceResponse {
  requestId: string;
  type: string;
  status: 'SUCCESS' | 'ERROR';
  data?: any;
  error?: {
    code: string;
    message: string;
  };
  timestamp: string;
}

export interface RequestHandler {
  handle(request: ServiceRequest): Promise<ServiceResponse>;
}