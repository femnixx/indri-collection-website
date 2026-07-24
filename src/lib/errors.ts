// src/lib/errors.ts

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details: any;

  constructor(message: string, statusCode: number, details: any = null, isOperational = true) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype); // Memperbaiki prototype chain di TS
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }

  // Helper instansiasi cepat untuk kegagalan validasi Zod
  static badRequest(message: string, details: any = null) {
    return new AppError(message, 400, details);
  }

  // Helper instansiasi cepat untuk kegagalan database internal
  static internal(message: string = "Terjadi kesalahan internal pada server.") {
    return new AppError(message, 500, null, false);
  }
}