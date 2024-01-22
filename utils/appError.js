//Clase Error para instanciar errores dentro de la app
export default class AppError extends Error {
  constructor(message, statusCode, status) {
    super(message);
    this.statusCode = statusCode || 500;
    this.status = status || "error";
  }
}
