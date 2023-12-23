class NotFoundError extends Error {
  constructor(message) {
    super();
    this.statusCode = 404;
    this.message = message;
    this.name = 'NotFoundError';
  }
}

module.exports = NotFoundError;
