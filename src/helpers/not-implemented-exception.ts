/**
 * @file NotImplementedException.ts
 * @description Custom error class representing a "Not Implemented" exception.
 * Used to indicate that a particular method or functionality is not yet implemented.
 */
export class NotImplementedException extends Error {
  constructor(message: string = "This method is not implemented") {
    super(message);
    this.name = "NotImplementedException";
  }
}
