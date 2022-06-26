class ExpressError extends Error {
  constructor(message, statusCode) {
    super(); // this will call the constructor of parent class
    this.message = message;
    this.statusCode = statusCode;
  }
}

module.exports = ExpressError;
