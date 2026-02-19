// src/hooks/useAudioRecorder.js
import { useState, useRef, useCallback } from "react";

export const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  // Démarrer l'enregistrement
  const startRecording = useCallback(async () => {
    try {
      setError(null);

      // Demander l'accès au microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Créer le MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      // Collecter les chunks audio
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      // Quand l'enregistrement s'arrête
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);

        // Arrêter tous les tracks du stream
        stream.getTracks().forEach((track) => track.stop());
      };

      // Démarrer l'enregistrement
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Timer pour afficher la durée
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error starting recording:", err);
      setError("Could not access microphone. Please check permissions.");
    }
  }, []);

  // Arrêter l'enregistrement
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isRecording]);

  // Annuler l'enregistrement
  const cancelRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setAudioBlob(null);
      setRecordingTime(0);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isRecording]);

  // Réinitialiser
  const resetRecording = useCallback(() => {
    setAudioBlob(null);
    setRecordingTime(0);
    setError(null);
  }, []);

  return {
    isRecording,
    recordingTime,
    audioBlob,
    error,
    startRecording,
    stopRecording,
    cancelRecording,
    resetRecording,
  };
};

export default useAudioRecorder;
