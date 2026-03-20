export class OrderSubmitError extends Error {
  readonly originalError?: unknown;
  constructor(message: string, originalError?: unknown) {
    super(message);
    this.name = 'OrderSubmitError';
    this.originalError = originalError;
  }
}

export class AnimationInitError extends Error {
  readonly originalError?: unknown;
  constructor(message: string, originalError?: unknown) {
    super(message);
    this.name = 'AnimationInitError';
    this.originalError = originalError;
  }
}

export class ProductFetchError extends Error {
  readonly originalError?: unknown;
  constructor(message: string, originalError?: unknown) {
    super(message);
    this.name = 'ProductFetchError';
    this.originalError = originalError;
  }
}
