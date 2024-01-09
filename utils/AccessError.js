class AccessError extends Error {
  constructor(message) {
    super();
    this.statusCode = 403;
    this.message = message;
    this.name = 'AccessError';
  }
}

module.exports = AccessError;
