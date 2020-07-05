/**
 * Error Types
 *
 * @packageDocumentation
 * @category Utility
 */

export type IError =
  | ServerError
  | TimeoutError
  | NotFoundError
  | ConflictError
  | BadRequestError
  | UnauthorizedError;

export class BaseError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class BadRequestError extends BaseError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message: string) {
    super(message, 401);
  }
}

export class NotFoundError extends BaseError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class TimeoutError extends BaseError {
  constructor(message: string) {
    super(message, 408);
  }
}

export class ConflictError extends BaseError {
  constructor(message: string) {
    super(message, 409);
  }
}

export class ServerError extends BaseError {
  constructor(message: string) {
    super(message, 500);
  }
}
