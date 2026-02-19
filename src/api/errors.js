// src/api/errors.js
// Classes d'erreur personnalisées pour l'API

export class ApiError extends Error {
  constructor(message, status, data = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }

  isNetworkError() {
    return this.status === 0;
  }

  isTimeout() {
    return this.status === 408;
  }

  isServerError() {
    return this.status >= 500;
  }

  isClientError() {
    return this.status >= 400 && this.status < 500;
  }

  isUnauthorized() {
    return this.status === 401;
  }

  isForbidden() {
    return this.status === 403;
  }

  isNotFound() {
    return this.status === 404;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      data: this.data,
      timestamp: this.timestamp,
    };
  }
}

export class NetworkError extends ApiError {
  constructor(originalError) {
    super("Network error occurred", 0, {
      originalError: originalError?.message,
    });
    this.name = "NetworkError";
    this.originalError = originalError;
  }
}

export class TimeoutError extends ApiError {
  constructor(timeout) {
    super(`Request timeout after ${timeout}ms`, 408, { timeout });
    this.name = "TimeoutError";
  }
}

export class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

/**
 * Convertit une erreur fetch en ApiError
 * @param {Error} error
 * @param {Response} response
 * @returns {ApiError}
 */
export const handleFetchError = async (error, response = null) => {
  // Timeout
  if (error.name === "AbortError") {
    return new TimeoutError(30000);
  }

  // Erreur réseau
  if (!response) {
    return new NetworkError(error);
  }

  // Erreur HTTP
  let errorData = {};
  try {
    errorData = await response.json();
  } catch {
    // Impossible de parser la réponse
  }

  const message =
    errorData.message || `Request failed with status ${response.status}`;

  return new ApiError(message, response.status, errorData);
};

/**
 * Formate une erreur pour l'affichage utilisateur
 * @param {Error} error
 * @returns {string}
 */
export const formatErrorMessage = (error) => {
  if (error instanceof TimeoutError) {
    return "Request timed out. Please check your internet connection and try again.";
  }

  if (error instanceof NetworkError) {
    return "Unable to connect to the server. Please check your internet connection.";
  }

  if (error instanceof ApiError) {
    if (error.isUnauthorized()) {
      return "You are not authorized to perform this action.";
    }

    if (error.isServerError()) {
      return "Server error occurred. Please try again later.";
    }

    return error.message || "An error occurred. Please try again.";
  }

  if (error instanceof ValidationError) {
    return error.message;
  }

  return "An unexpected error occurred. Please try again.";
};
