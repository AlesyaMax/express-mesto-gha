class AccessError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
    this.name = 'AccessError';
  }
}

module.exports = AccessError;
