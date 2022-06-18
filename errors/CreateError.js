class CreateError extends Error {
  constructor(message = 'Ошибка  создания') {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = CreateError;
