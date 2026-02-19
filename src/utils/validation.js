// src/utils/validation.js
export const validateMessage = (message) => {
  if (!message) {
    return { valid: false, error: "Message is required" };
  }

  if (typeof message !== "string") {
    return { valid: false, error: "Message must be a string" };
  }

  const trimmed = message.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: "Message cannot be empty" };
  }

  if (trimmed.length > 1000) {
    return { valid: false, error: "Message is too long (max 1000 characters)" };
  }

  return { valid: true, error: null };
};

export const validateChatResponse = (response) => {
  if (!response) {
    return { valid: false, error: "Response is null or undefined" };
  }

  if (!response.success) {
    return { valid: false, error: response.error || "Request failed" };
  }

  if (!Array.isArray(response.messages)) {
    return {
      valid: false,
      error: "Invalid response format: messages must be an array",
    };
  }

  if (response.messages.length === 0) {
    return { valid: false, error: "No messages in response" };
  }

  for (let i = 0; i < response.messages.length; i++) {
    const msg = response.messages[i];
    const validation = validateMessageObject(msg); // ✅ CORRIGÉ : supprimé l'espace

    if (!validation.valid) {
      return {
        valid: false,
        error: `Invalid message at index ${i}: ${validation.error}`,
      };
    }
  }

  return { valid: true, error: null };
};

export const validateMessageObject = (message) => {
  if (!message || typeof message !== "object") {
    return { valid: false, error: "Message must be an object" };
  }

  const requiredFields = ["text"];
  for (const field of requiredFields) {
    if (!(field in message)) {
      return { valid: false, error: `Missing required field: ${field}` };
    }
  }

  if (typeof message.text !== "string" || message.text.length === 0) {
    return { valid: false, error: "text must be a non-empty string" };
  }

  const optionalFields = {
    audio: "string",
    lipsync: "object",
    animation: "string",
    facialExpression: "string",
  };

  for (const [field, expectedType] of Object.entries(optionalFields)) {
    if (field in message && typeof message[field] !== expectedType) {
      return {
        valid: false,
        error: `${field} must be of type ${expectedType}`,
      };
    }
  }

  if (message.lipsync) {
    if (
      !message.lipsync.mouthCues ||
      !Array.isArray(message.lipsync.mouthCues)
    ) {
      return {
        valid: false,
        error: "lipsync.mouthCues must be an array",
      };
    }
  }

  return { valid: true, error: null };
};

export const sanitizeMessage = (message) => {
  if (typeof message !== "string") {
    return "";
  }

  return message.trim();
};

export const isValidApiUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
