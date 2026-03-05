// src/api/chat.api.js
import { apiClient } from "./client.js";
import { API_CONFIG } from "../config/constants.js";
import { validateMessage, validateChatResponse } from "../utils/validation.js";
import { ValidationError } from "./errors.js";

/**
 * Envoyer un message texte
 * @param {string} message
 * @returns {Promise}
 */
export const sendMessage = async (message) => {
  const validation = validateMessage(message);
  if (!validation.valid) {
    throw new ValidationError(validation.error, "message");
  }

  const response = await apiClient.post(API_CONFIG.ENDPOINTS.CHAT, {
    message: message.trim(),
  });

  const responseValidation = validateChatResponse(response);
  if (!responseValidation.valid) {
    throw new ValidationError(responseValidation.error, "response");
  }

  return response;
};

/**
 * Envoyer un message audio
 * @param {string} audioBase64 - Audio en base64
 * @returns {Promise}
 */
export const sendAudioMessage = async (audioBase64) => {
  if (!audioBase64) {
    throw new ValidationError("Audio data is required", "audio");
  }

  const response = await apiClient.post(API_CONFIG.ENDPOINTS.CHAT, {
    audio: audioBase64,
  });

  const responseValidation = validateChatResponse(response);
  if (!responseValidation.valid) {
    throw new ValidationError(responseValidation.error, "response");
  }

  return response;
};

/**
 * Envoyer un message texte via SSE (deux phases : text puis audio)
 * @param {string} message
 * @param {Object} callbacks - { onEvent, onError, onDone }
 */
export const streamMessage = async (message, callbacks) => {
  if (!message?.trim()) {
    callbacks?.onError?.("Message cannot be empty");
    return;
  }
  await apiClient.streamPost(
    API_CONFIG.ENDPOINTS.CHAT,
    { message: message.trim() },
    callbacks,
  );
};

/**
 * Envoyer un message audio via SSE (deux phases : text puis audio)
 * @param {string} audioBase64 - Audio en base64
 * @param {Object} callbacks - { onEvent, onError, onDone }
 */
export const streamAudioMessage = async (audioBase64, callbacks) => {
  if (!audioBase64) {
    callbacks?.onError?.("Audio data is required");
    return;
  }
  await apiClient.streamPost(
    API_CONFIG.ENDPOINTS.CHAT,
    { audio: audioBase64 },
    callbacks,
  );
};

/**
 * Vérifier la santé du serveur
 * @returns {Promise}
 */
export const checkHealth = async () => {
  return await apiClient.get(API_CONFIG.ENDPOINTS.HEALTH);
};

export const chatApi = {
  sendMessage,
  sendAudioMessage,
  streamMessage,
  streamAudioMessage,
  checkHealth,
};

export default chatApi;
