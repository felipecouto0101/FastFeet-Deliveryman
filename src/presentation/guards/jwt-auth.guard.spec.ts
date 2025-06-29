import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let mockJwtService: jest.Mocked<JwtService>;
  let mockExecutionContext: jest.Mocked<ExecutionContext>;
  let mockRequest: any;

  beforeEach(() => {
    mockJwtService = {
      verify: jest.fn(),
    } as any;

    mockRequest = {
      headers: {},
    };

    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
    } as any;

    guard = new JwtAuthGuard(mockJwtService);
  });

  describe('canActivate', () => {
    it('should return true when valid token is provided', () => {
      const mockPayload = { sub: '123', email: 'test@example.com' };
      mockRequest.headers.authorization = 'Bearer valid-token';
      mockJwtService.verify.mockReturnValue(mockPayload);

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
      expect(mockRequest.user).toBe(mockPayload);
      expect(mockJwtService.verify).toHaveBeenCalledWith('valid-token', {
        secret: process.env.JWT_SECRET || 'your-secret-key',
      });
    });

    it('should throw UnauthorizedException when no authorization header', () => {
      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        new UnauthorizedException('Token not provided')
      );
    });

    it('should throw UnauthorizedException when authorization header is empty', () => {
      mockRequest.headers.authorization = '';

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        new UnauthorizedException('Token not provided')
      );
    });

    it('should throw UnauthorizedException when authorization header has no token', () => {
      mockRequest.headers.authorization = 'Bearer';

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        new UnauthorizedException('Token not provided')
      );
    });

    it('should throw UnauthorizedException when authorization header has wrong type', () => {
      mockRequest.headers.authorization = 'Basic token123';

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        new UnauthorizedException('Token not provided')
      );
    });

    it('should throw UnauthorizedException when token is invalid', () => {
      mockRequest.headers.authorization = 'Bearer invalid-token';
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        new UnauthorizedException('Invalid token')
      );
    });

    it('should throw UnauthorizedException when token is expired', () => {
      mockRequest.headers.authorization = 'Bearer expired-token';
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Token expired');
      });

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        new UnauthorizedException('Invalid token')
      );
    });

    it('should handle malformed authorization header gracefully', () => {
      mockRequest.headers.authorization = 'InvalidFormat';

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        new UnauthorizedException('Token not provided')
      );
    });

    it('should use environment JWT_SECRET when available', () => {
      const originalEnv = process.env.JWT_SECRET;
      process.env.JWT_SECRET = 'custom-secret';
      
      const mockPayload = { sub: '123' };
      mockRequest.headers.authorization = 'Bearer valid-token';
      mockJwtService.verify.mockReturnValue(mockPayload);

      guard.canActivate(mockExecutionContext);

      expect(mockJwtService.verify).toHaveBeenCalledWith('valid-token', {
        secret: 'custom-secret',
      });

      process.env.JWT_SECRET = originalEnv;
    });

    it('should use default secret when JWT_SECRET not in environment', () => {
      const originalEnv = process.env.JWT_SECRET;
      delete process.env.JWT_SECRET;
      
      const mockPayload = { sub: '123' };
      mockRequest.headers.authorization = 'Bearer valid-token';
      mockJwtService.verify.mockReturnValue(mockPayload);

      guard.canActivate(mockExecutionContext);

      expect(mockJwtService.verify).toHaveBeenCalledWith('valid-token', {
        secret: 'your-secret-key',
      });

      process.env.JWT_SECRET = originalEnv;
    });

    it('should extract token correctly from Bearer format', () => {
      mockRequest.headers.authorization = 'Bearer token123';
      mockJwtService.verify.mockReturnValue({ sub: '123' });

      guard.canActivate(mockExecutionContext);

      expect(mockJwtService.verify).toHaveBeenCalledWith('token123', expect.any(Object));
    });

    it('should handle Bearer with multiple spaces correctly', () => {
      mockRequest.headers.authorization = 'Bearer token123';
      mockJwtService.verify.mockReturnValue({ sub: '123' });

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
      expect(mockJwtService.verify).toHaveBeenCalledWith('token123', expect.any(Object));
    });
  });
});