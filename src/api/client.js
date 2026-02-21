// // // src/api/client.js
// // // Client API centralisé avec gestion d'erreurs, timeout, et retry

// // import { API_CONFIG } from "../config/constants.js";
// // import { ApiError, handleFetchError } from "./errors.js";

// // /**
// //  * Attend un délai
// //  * @param {number} ms - Millisecondes à attendre
// //  * @returns {Promise<void>}
// //  */
// // const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// // /**
// //  * Client API principal
// //  */
// // class ApiClient {
// //   constructor(baseURL = API_CONFIG.BASE_URL, timeout = API_CONFIG.TIMEOUT) {
// //     this.baseURL = baseURL;
// //     this.timeout = timeout;
// //     this.defaultHeaders = {
// //       "Content-Type": "application/json",
// //     };
// //   }

// //   /**
// //    * Effectue une requête HTTP avec timeout
// //    * @private
// //    */
// //   async _fetchWithTimeout(url, options, timeout) {
// //     const controller = new AbortController();
// //     const timeoutId = setTimeout(() => controller.abort(), timeout);

// //     try {
// //       const response = await fetch(url, {
// //         ...options,
// //         signal: controller.signal,
// //       });

// //       clearTimeout(timeoutId);
// //       return response;
// //     } catch (error) {
// //       clearTimeout(timeoutId);
// //       throw error;
// //     }
// //   }

// //   /**
// //    * Effectue une requête avec retry
// //    * @private
// //    */
// //   async _fetchWithRetry(url, options, retries = API_CONFIG.RETRY_ATTEMPTS) {
// //     let lastError;

// //     for (let i = 0; i <= retries; i++) {
// //       try {
// //         const response = await this._fetchWithTimeout(
// //           url,
// //           options,
// //           this.timeout,
// //         );

// //         // Si succès, retourner
// //         if (response.ok) {
// //           return response;
// //         }

// //         // Si erreur client (4xx), ne pas retry
// //         if (response.status >= 400 && response.status < 500) {
// //           throw await handleFetchError(null, response);
// //         }

// //         // Si erreur serveur (5xx) et il reste des retries, continuer
// //         if (i < retries) {
// //           await delay(API_CONFIG.RETRY_DELAY * (i + 1)); // Backoff exponentiel
// //           continue;
// //         }

// //         // Dernière tentative échouée
// //         throw await handleFetchError(null, response);
// //       } catch (error) {
// //         lastError = error;

// //         // Si c'est une erreur réseau ou timeout, retry
// //         if (i < retries && (error.name === "AbortError" || !error.status)) {
// //           await delay(API_CONFIG.RETRY_DELAY * (i + 1));
// //           continue;
// //         }

// //         // Sinon, propager l'erreur
// //         throw await handleFetchError(error);
// //       }
// //     }

// //     throw lastError;
// //   }

// //   /**
// //    * Requête POST
// //    * @param {string} endpoint - Endpoint de l'API (ex: '/chat')
// //    * @param {Object} data - Données à envoyer
// //    * @param {Object} options - Options supplémentaires
// //    * @returns {Promise<Object>}
// //    */
// //   async post(endpoint, data = {}, options = {}) {
// //     const url = `${this.baseURL}${endpoint}`;

// //     const fetchOptions = {
// //       method: "POST",
// //       headers: {
// //         ...this.defaultHeaders,
// //         ...options.headers,
// //       },
// //       body: JSON.stringify(data),
// //       ...options,
// //     };

// //     try {
// //       const response = await this._fetchWithRetry(url, fetchOptions);
// //       const responseData = await response.json();
// //       return responseData;
// //     } catch (error) {
// //       console.error("API POST error:", {
// //         endpoint,
// //         error: error.toJSON ? error.toJSON() : error,
// //       });
// //       throw error;
// //     }
// //   }

// //   /**
// //    * Requête GET
// //    * @param {string} endpoint
// //    * @param {Object} options
// //    * @returns {Promise<Object>}
// //    */
// //   async get(endpoint, options = {}) {
// //     const url = `${this.baseURL}${endpoint}`;

// //     const fetchOptions = {
// //       method: "GET",
// //       headers: {
// //         ...this.defaultHeaders,
// //         ...options.headers,
// //       },
// //       ...options,
// //     };

// //     try {
// //       const response = await this._fetchWithRetry(url, fetchOptions);
// //       const responseData = await response.json();
// //       return responseData;
// //     } catch (error) {
// //       console.error("API GET error:", {
// //         endpoint,
// //         error: error.toJSON ? error.toJSON() : error,
// //       });
// //       throw error;
// //     }
// //   }

// //   /**
// //    * Modifie l'URL de base
// //    * @param {string} baseURL
// //    */
// //   setBaseURL(baseURL) {
// //     this.baseURL = baseURL;
// //   }

// //   /**
// //    * Modifie le timeout
// //    * @param {number} timeout
// //    */
// //   setTimeout(timeout) {
// //     this.timeout = timeout;
// //   }

// //   /**
// //    * Ajoute un header par défaut
// //    * @param {string} key
// //    * @param {string} value
// //    */
// //   setDefaultHeader(key, value) {
// //     this.defaultHeaders[key] = value;
// //   }
// // }

// // // Instance singleton
// // export const apiClient = new ApiClient();

// // export default apiClient;

// // src/api/client.js
// // Client API centralisé avec gestion d'erreurs, timeout, et retry

// import { API_CONFIG } from "../config/constants.js";
// import { ApiError, handleFetchError } from "./errors.js";

// /**
//  * Attend un délai
//  * @param {number} ms - Millisecondes à attendre
//  * @returns {Promise<void>}
//  */
// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// /**
//  * Client API principal
//  */
// class ApiClient {
//   constructor(baseURL = API_CONFIG.BASE_URL, timeout = API_CONFIG.TIMEOUT) {
//     // ✅ VALIDATION DU BASE_URL
//     if (!baseURL || baseURL === "undefined" || baseURL.includes("undefined")) {
//       console.error("❌ API BASE_URL is invalid:", baseURL);
//       console.error("❌ API_CONFIG:", API_CONFIG);
//       throw new Error(
//         "API_CONFIG.BASE_URL is not configured correctly! Check your constants.js file.",
//       );
//     }

//     this.baseURL = baseURL;
//     this.timeout = timeout;
//     this.defaultHeaders = {
//       "Content-Type": "application/json",
//     };

//     // ✅ LOG POUR DEBUG
//     console.log("✅ ApiClient initialized with baseURL:", this.baseURL);
//   }

//   /**
//    * Effectue une requête HTTP avec timeout
//    * @private
//    */
//   async _fetchWithTimeout(url, options, timeout) {
//     const controller = new AbortController();
//     const timeoutId = setTimeout(() => controller.abort(), timeout);

//     try {
//       const response = await fetch(url, {
//         ...options,
//         signal: controller.signal,
//       });

//       clearTimeout(timeoutId);
//       return response;
//     } catch (error) {
//       clearTimeout(timeoutId);
//       throw error;
//     }
//   }

//   /**
//    * Effectue une requête avec retry
//    * @private
//    */
//   async _fetchWithRetry(url, options, retries = API_CONFIG.RETRY_ATTEMPTS) {
//     let lastError;

//     for (let i = 0; i <= retries; i++) {
//       try {
//         const response = await this._fetchWithTimeout(
//           url,
//           options,
//           this.timeout,
//         );

//         // Si succès, retourner
//         if (response.ok) {
//           return response;
//         }

//         // Si erreur client (4xx), ne pas retry
//         if (response.status >= 400 && response.status < 500) {
//           throw await handleFetchError(null, response);
//         }

//         // Si erreur serveur (5xx) et il reste des retries, continuer
//         if (i < retries) {
//           await delay(API_CONFIG.RETRY_DELAY * (i + 1)); // Backoff exponentiel
//           continue;
//         }

//         // Dernière tentative échouée
//         throw await handleFetchError(null, response);
//       } catch (error) {
//         lastError = error;

//         // Si c'est une erreur réseau ou timeout, retry
//         if (i < retries && (error.name === "AbortError" || !error.status)) {
//           await delay(API_CONFIG.RETRY_DELAY * (i + 1));
//           continue;
//         }

//         // Sinon, propager l'erreur
//         throw await handleFetchError(error);
//       }
//     }

//     throw lastError;
//   }

//   /**
//    * Requête POST
//    * @param {string} endpoint - Endpoint de l'API (ex: '/chat')
//    * @param {Object} data - Données à envoyer
//    * @param {Object} options - Options supplémentaires
//    * @returns {Promise<Object>}
//    */
//   async post(endpoint, data = {}, options = {}) {
//     const url = `${this.baseURL}${endpoint}`;

//     const fetchOptions = {
//       method: "POST",
//       headers: {
//         ...this.defaultHeaders,
//         ...options.headers,
//       },
//       body: JSON.stringify(data),
//       ...options,
//     };

//     try {
//       const response = await this._fetchWithRetry(url, fetchOptions);
//       const responseData = await response.json();
//       return responseData;
//     } catch (error) {
//       // ✅ GESTION D'ERREUR AMÉLIORÉE
//       console.error("API POST error:", {
//         endpoint,
//         url,
//         baseURL: this.baseURL,
//         error:
//           error && typeof error.toJSON === "function" ? error.toJSON() : error,
//         errorMessage: error?.message,
//         errorStack: error?.stack,
//       });
//       throw error;
//     }
//   }

//   /**
//    * Requête GET
//    * @param {string} endpoint
//    * @param {Object} options
//    * @returns {Promise<Object>}
//    */
//   async get(endpoint, options = {}) {
//     const url = `${this.baseURL}${endpoint}`;

//     const fetchOptions = {
//       method: "GET",
//       headers: {
//         ...this.defaultHeaders,
//         ...options.headers,
//       },
//       ...options,
//     };

//     try {
//       const response = await this._fetchWithRetry(url, fetchOptions);
//       const responseData = await response.json();
//       return responseData;
//     } catch (error) {
//       // ✅ GESTION D'ERREUR AMÉLIORÉE
//       console.error("API GET error:", {
//         endpoint,
//         url,
//         baseURL: this.baseURL,
//         error:
//           error && typeof error.toJSON === "function" ? error.toJSON() : error,
//         errorMessage: error?.message,
//       });
//       throw error;
//     }
//   }

//   /**
//    * Modifie l'URL de base
//    * @param {string} baseURL
//    */
//   setBaseURL(baseURL) {
//     this.baseURL = baseURL;
//   }

//   /**
//    * Modifie le timeout
//    * @param {number} timeout
//    */
//   setTimeout(timeout) {
//     this.timeout = timeout;
//   }

//   /**
//    * Ajoute un header par défaut
//    * @param {string} key
//    * @param {string} value
//    */
//   setDefaultHeader(key, value) {
//     this.defaultHeaders[key] = value;
//   }
// }

// // Instance singleton
// export const apiClient = new ApiClient();

// export default apiClient;

// src/api/client.js
// Client API centralisé avec gestion d'erreurs, timeout, et retry

import { API_CONFIG } from "../config/constants.js";
import { ApiError, NetworkError, TimeoutError } from "./errors.js";

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
    // ✅ Validation du BASE_URL
    if (!baseURL || baseURL === "undefined" || baseURL.includes("undefined")) {
      console.error("❌ API BASE_URL is invalid:", baseURL);
      console.error("❌ API_CONFIG:", API_CONFIG);
      throw new Error(
        "API_CONFIG.BASE_URL is not configured correctly! Check your constants.js file.",
      );
    }

    this.baseURL = baseURL;
    this.timeout = timeout;
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };

    // ✅ Log pour debug
    console.log("✅ ApiClient initialized with baseURL:", this.baseURL);
  }

  /**
   * Effectue une requête HTTP avec timeout
   * @private
   * @param {string} url - URL complète
   * @param {Object} options - Options fetch
   * @param {number} timeout - Timeout en ms
   * @returns {Promise<Response>}
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
   * Effectue une requête avec retry automatique
   * @private
   * @param {string} url - URL complète
   * @param {Object} options - Options fetch
   * @param {number} retries - Nombre de tentatives
   * @returns {Promise<Response>}
   */
  async _fetchWithRetry(url, options, retries = 3) {
    let lastError = null;

    for (let i = 0; i <= retries; i++) {
      try {
        console.log(`[ApiClient] Attempt ${i + 1}/${retries + 1} to ${url}`);

        const response = await this._fetchWithTimeout(
          url,
          options,
          this.timeout,
        );

        console.log(
          `[ApiClient] Response: ${response.status} ${response.statusText}`,
        );

        // ✅ Si succès, retourner immédiatement
        if (response.ok) {
          return response;
        }

        // ❌ Erreur HTTP - Parser la réponse
        let errorData = {};
        try {
          const text = await response.text();
          errorData = JSON.parse(text);
        } catch (e) {
          // Impossible de parser en JSON
          errorData = { message: `HTTP ${response.status} : ${e.message}` };
        }

        const httpError = new ApiError(
          errorData.message ||
            `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData,
        );

        // Si erreur client (4xx), ne PAS retry
        if (response.status >= 400 && response.status < 500) {
          console.error(
            `[ApiClient] Client error (no retry):`,
            httpError.toJSON(),
          );
          throw httpError;
        }

        // Si erreur serveur (5xx) et il reste des retries
        if (i < retries) {
          const delayMs = 1000 * (i + 1); // Backoff: 1s, 2s, 3s
          console.log(`[ApiClient] Server error, retrying in ${delayMs}ms...`);
          lastError = httpError;
          await delay(delayMs);
          continue;
        }

        // Dernière tentative échouée
        console.error(`[ApiClient] All retries exhausted:`, httpError.toJSON());
        throw httpError;
      } catch (error) {
        // Si c'est déjà une ApiError, la propager directement
        if (error instanceof ApiError) {
          throw error;
        }

        // Sinon, c'est une erreur réseau ou timeout
        console.error(
          `[ApiClient] Network/Timeout error:`,
          error.name,
          error.message,
        );

        const networkError =
          error.name === "AbortError"
            ? new TimeoutError(this.timeout)
            : new NetworkError(error);

        // Si il reste des retries, continuer
        if (i < retries) {
          const delayMs = 1000 * (i + 1);
          console.log(`[ApiClient] Network error, retrying in ${delayMs}ms...`);
          lastError = networkError;
          await delay(delayMs);
          continue;
        }

        // Dernière tentative échouée
        throw networkError;
      }
    }

    // Sécurité (ne devrait jamais arriver ici)
    throw lastError || new Error("Request failed for unknown reason");
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
      console.error("❌ API POST error:", {
        endpoint,
        url,
        baseURL: this.baseURL,
        errorType: error?.constructor?.name,
        error:
          error instanceof ApiError
            ? error.toJSON()
            : {
                name: error?.name,
                message: error?.message,
                stack: error?.stack,
              },
      });
      throw error;
    }
  }

  /**
   * Requête GET
   * @param {string} endpoint - Endpoint de l'API
   * @param {Object} options - Options supplémentaires
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
      console.error("❌ API GET error:", {
        endpoint,
        url,
        baseURL: this.baseURL,
        errorType: error?.constructor?.name,
        error:
          error instanceof ApiError
            ? error.toJSON()
            : {
                name: error?.name,
                message: error?.message,
              },
      });
      throw error;
    }
  }

  /**
   * Modifie l'URL de base
   * @param {string} baseURL - Nouvelle URL de base
   */
  setBaseURL(baseURL) {
    this.baseURL = baseURL;
    console.log("✅ BaseURL updated to:", baseURL);
  }

  /**
   * Modifie le timeout
   * @param {number} timeout - Nouveau timeout en ms
   */
  setTimeout(timeout) {
    this.timeout = timeout;
    console.log("✅ Timeout updated to:", timeout);
  }

  /**
   * Ajoute un header par défaut
   * @param {string} key - Nom du header
   * @param {string} value - Valeur du header
   */
  setDefaultHeader(key, value) {
    this.defaultHeaders[key] = value;
    console.log("✅ Default header added:", key);
  }
}

// Instance singleton
export const apiClient = new ApiClient();

export default apiClient;
