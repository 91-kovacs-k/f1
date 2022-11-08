/* eslint-disable no-unused-vars */
export const enum ErrorType {
  NotFound,
  NoRecords,
  ServerError,
  AlreadyExists,
  ArgumentError,
  MultipleMatch,
  IdMismatch,
  IncorrectPassword,
}

export class BackendError extends Error {
  type: ErrorType
  reason: string

  constructor(type: ErrorType, name: string, message: string) {
    super(message)
    this.reason = message
    this.name = name
    this.type = type
  }
}
