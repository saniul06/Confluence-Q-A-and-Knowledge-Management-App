import { ErrorCode } from "../shared/types";

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: ErrorCode,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, "NOT_FOUND");
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, "CONFLICT");
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR");
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string) {
    super(message, "FORBIDDEN");
  }
}

export class UnprocessableError extends AppError {
  constructor(message: string) {
    super(message, "UNPROCESSABLE_ENTITY");
  }
}
