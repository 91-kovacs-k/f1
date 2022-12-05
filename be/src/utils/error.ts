export const enum ErrorType {
  NotFound = 'Not Found',
  NoRecords = 'No Records',
  ServerError = 'Server Error',
  AlreadyExists = 'Already Exists',
  ArgumentError = 'Argument Error',
  MultipleMatch = 'Multiple Match',
  IdMismatch = 'Id Mismatch',
  IncorrectPassword = 'Incorrect Password',
}

export class BackendError extends Error {
  type: ErrorType;
  reason: string;

  constructor(
    type: ErrorType,
    message: string = `There was an error! Type: '${type.valueOf()}'`,
  ) {
    super(message);
    this.type = type;
    this.name = type.valueOf();
    this.reason = message;
  }
}
