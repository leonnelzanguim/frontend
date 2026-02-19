// src/api/client.js
// Client API centralisé avec gestion d'erreurs, timeout, et retry

import { API_CONFIG } from "../config/constants.js";
import { ApiError, handleFetchError } from "./errors.js";

/**
 * Attend un délai
 * @param {number} ms - Millisecondes à attendre
 * @returns {Promise<void>}
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Client API principal
 */
class ApiClient {
  constructor(baseURL = API_CONFIG.BASE_URL, timeout = API_CONFIG.TIMEOUT) {
    this.baseURL = baseURL;
    this.timeout = timeout;
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  /**
   * Effectue une requête HTTP avec timeout
   * @private
   */
  async _fetchWithTimeout(url, options, timeout) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Effectue une requête avec retry
   * @private
   */
  async _fetchWithRetry(url, options, retries = API_CONFIG.RETRY_ATTEMPTS) {
    let lastError;

    for (let i = 0; i <= retries; i++) {
      try {
        const response = await this._fetchWithTimeout(
          url,
          options,
          this.timeout,
        );

        // Si succès, retourner
        if (response.ok) {
          return response;
        }

        // Si erreur client (4xx), ne pas retry
        if (response.status >= 400 && response.status < 500) {
          throw await handleFetchError(null, response);
        }

        // Si erreur serveur (5xx) et il reste des retries, continuer
        if (i < retries) {
          await delay(API_CONFIG.RETRY_DELAY * (i + 1)); // Backoff exponentiel
          continue;
        }

        // Dernière tentative échouée
        throw await handleFetchError(null, response);
      } catch (error) {
        lastError = error;

        // Si c'est une erreur réseau ou timeout, retry
        if (i < retries && (error.name === "AbortError" || !error.status)) {
          await delay(API_CONFIG.RETRY_DELAY * (i + 1));
          continue;
        }

        // Sinon, propager l'erreur
        throw await handleFetchError(error);
      }
    }

    throw lastError;
  }

  /**
   * Requête POST
   * @param {string} endpoint - Endpoint de l'API (ex: '/chat')
   * @param {Object} data - Données à envoyer
   * @param {Object} options - Options supplémentaires
   * @returns {Promise<Object>}
   */
  async post(endpoint, data = {}, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const fetchOptions = {
      method: "POST",
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
      body: JSON.stringify(data),
      ...options,
    };

    try {
      const response = await this._fetchWithRetry(url, fetchOptions);
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error("API POST error:", {
        endpoint,
        error: error.toJSON ? error.toJSON() : error,
      });
      throw error;
    }
  }

  /**
   * Requête GET
   * @param {string} endpoint
   * @param {Object} options
   * @returns {Promise<Object>}
   */
  async get(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const fetchOptions = {
      method: "GET",
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await this._fetchWithRetry(url, fetchOptions);
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error("API GET error:", {
        endpoint,
        error: error.toJSON ? error.toJSON() : error,
      });
      throw error;
    }
  }

  /**
   * Modifie l'URL de base
   * @param {string} baseURL
   */
  setBaseURL(baseURL) {
    this.baseURL = baseURL;
  }

  /**
   * Modifie le timeout
   * @param {number} timeout
   */
  setTimeout(timeout) {
    this.timeout = timeout;
  }

  /**
   * Ajoute un header par défaut
   * @param {string} key
   * @param {string} value
   */
  setDefaultHeader(key, value) {
    this.defaultHeaders[key] = value;
  }
}

// Instance singleton
export const apiClient = new ApiClient();

export default apiClient;
