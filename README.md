# 🚀 FastFeet-Deliveryman Microservice

## 📋 WHAT IS THE PROJECT

FastFeet is a microservice for managing delivery personnel of a transportation company. The system allows managing registration, updating, listing, and deletion of delivery personnel with JWT authentication and AWS integration.

**Architecture:** Clean Architecture + Domain-Driven Design (DDD)  
**Technology:** Node.js + NestJS + TypeScript + AWS

---

## 📚 LIBRARIES USED

### **Backend Framework**
- `@nestjs/core` - NestJS Framework
- `@nestjs/common` - NestJS Common Modules
- `@nestjs/platform-express` - Express Platform
- `typescript` - TypeScript Language

### **Database**
- `@aws-sdk/client-dynamodb` - DynamoDB Client
- `@aws-sdk/lib-dynamodb` - DynamoDB Library

### **Authentication & Security**
- `@nestjs/jwt` - JSON Web Tokens
- `@nestjs/passport` - Authentication Strategies
- `passport-jwt` - JWT Strategy
- `bcrypt` - Password Hashing

### **Validation & Transformation**
- `class-validator` - DTO Validation
- `class-transformer` - Data Transformation

### **Documentation**
- `@nestjs/swagger` - Automatic API Documentation
- `swagger-ui-express` - Swagger Interface

### **Messaging**
- `@aws-sdk/client-sqs` - SQS Client for Queues

### **Infrastructure**
- `aws-cdk-lib` - AWS Cloud Development Kit
- `constructs` - CDK Constructs

### **Testing**
- `jest` - Testing Framework
- `supertest` - API E2E Testing
- `@nestjs/testing` - NestJS Testing Utilities

---

## 🛠️ INSTALLATION GUIDE

### **Prerequisites**
- Node.js 18+ or 20+
- npm or yarn
- AWS Account (for deployment)

### **1. Clone the repository**
```bash
git clone <repository-url>
cd fastfeet
```

### **2. Install dependencies**
```bash
npm install
```

### **3. Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your configurations
```

### **4. Run in development**
```bash
npm run start:dev
```

### **5. Run tests**
```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Code coverage
npm run test:cov
```

### **6. Build for production**
```bash
npm run build
npm run start:prod
```

---

## 🌐 ROUTES AND ROUTE RULES

**Base URL:** `http://localhost:3000`  
**Documentation:** `http://localhost:3000/api`

### **🔒 Authentication**
All routes require **Bearer Token JWT** in header:
```
Authorization: Bearer <your-jwt-token>
```

### **📋 Endpoints**

#### **POST /deliverymen**
Create new delivery person
```json
{
  "name": "John Silva",
  "email": "john@example.com",
  "cpf": "123.456.789-00",
  "phone": "(11) 99999-9999",
  "password": "123456"
}
```
**Rules:**
- Name required (min 2 characters)
- Valid and unique email
- Valid Brazilian CPF format
- Phone required
- Password minimum 6 characters

#### **GET /deliverymen**
List delivery personnel with pagination
```
GET /deliverymen?limit=10&lastEvaluatedKey=abc123
```
**Parameters:**
- `limit` (optional): 1-100 items per page
- `lastEvaluatedKey` (optional): Key for pagination

#### **GET /deliverymen/:id**
Find delivery person by ID
```
GET /deliverymen/123e4567-e89b-12d3-a456-426614174000
```

#### **PATCH /deliverymen/:id**
Update delivery person
```json
{
  "name": "John Santos",
  "email": "john.santos@example.com",
  "phone": "(11) 88888-8888"
}
```
**Rules:**
- Only provided fields are updated
- Validations applied to sent fields

#### **DELETE /deliverymen/:id**
Delete delivery person
```
DELETE /deliverymen/123e4567-e89b-12d3-a456-426614174000
```

### **📊 Responses**
- **200/201:** Success
- **400:** Invalid data
- **401:** Invalid/missing token
- **404:** Delivery person not found
- **500:** Internal error

---

## 🔧 ENVIRONMENT VARIABLES EXAMPLE

Create a `.env` file in the project root:

```env
# Application
NODE_ENV=development
PORT=3000

# JWT
JWT_SECRET=your-super-secure-jwt-secret-here
JWT_EXPIRES_IN=7d

# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
DYNAMODB_TABLE_NAME=DeliveryMen
SQS_QUEUE_URL=https://sqs.us-east-1.amazonaws.com/123456789/deliveryman-events

# Development (optional)
LOG_LEVEL=debug
```

### **Required Variables:**
- `JWT_SECRET` - Secret key for JWT
- `AWS_REGION` - AWS Region
- `AWS_ACCESS_KEY_ID` - AWS Access Key
- `AWS_SECRET_ACCESS_KEY` - AWS Secret Key
- `DYNAMODB_TABLE_NAME` - DynamoDB Table Name

### **Optional Variables:**
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `JWT_EXPIRES_IN` - JWT expiration (default: 7d)
- `LOG_LEVEL` - Log level (debug/info/warn/error)

---

## 🚀 DEPLOYMENT

### **AWS CDK**
```bash
# Install CDK globally
npm install -g aws-cdk

# Deploy infrastructure
cdk deploy
```

### **CI/CD**
The project has configured GitHub Actions:
- **CI:** Automatic tests on PRs
- **CD:** Automatic deployment on main branch

---

## 📊 QUALITY

- **Test Coverage:** 94%+
- **Architecture:** Clean Architecture
- **Tests:** 176 tests (unit + E2E)
- **Linting:** ESLint configured
- **Documentation:** Automatic Swagger

---

## 📄 LICENSE

This project is under the MIT license. See the [LICENSE](LICENSE) file for more details.