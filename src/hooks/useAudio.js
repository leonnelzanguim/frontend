// src/hooks/useAudio.js
import { useState, useEffect, useCallback, useRef } from "react";
import {
  createAudioFromBase64,
  playAudio,
  cleanupAudio,
} from "../utils/audio.js";

export const useAudio = (audioBase64, onEnded) => {
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(null);

  const audioRef = useRef(null);
  const isMountedRef = useRef(true); // ✅ Track si le composant est monté

  useEffect(() => {
    if (!audioBase64) return;

    // ✅ Marquer comme monté
    isMountedRef.current = true;

    let audioElement;

    try {
      audioElement = createAudioFromBase64(audioBase64);
    } catch (err) {
      console.error("Failed to create audio:", err);
      setTimeout(() => {
        if (isMountedRef.current) {
          setError("Failed to create audio element");
        }
      }, 0);
      return;
    }

    audioRef.current = audioElement;

    audioElement.onloadedmetadata = () => {
      if (isMountedRef.current) {
        setDuration(audioElement.duration);
      }
    };

    audioElement.ontimeupdate = () => {
      if (isMountedRef.current) {
        setCurrentTime(audioElement.currentTime);
      }
    };

    audioElement.onended = () => {
      if (isMountedRef.current) {
        setIsPlaying(false);
        setCurrentTime(0);
        onEnded?.();
      }
    };

    // ✅ CORRECTION : Vérifier isMountedRef avant de setter l'état
    audioElement.onerror = (err) => {
      // ✅ Ignorer les erreurs si le composant est déjà unmonted
      if (!isMountedRef.current) return;

      console.error("Audio playback error:", err);
      setError("Failed to play audio");
      setIsPlaying(false);
    };

    playAudio(audioElement)
      .then(() => {
        if (isMountedRef.current) {
          setIsPlaying(true);
          setAudio(audioElement);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMountedRef.current) {
          console.error("Failed to start audio:", err);
          setError("Failed to start audio playback");
        }
      });

    // ✅ Cleanup amélioré
    return () => {
      isMountedRef.current = false; // ✅ Marquer comme unmonted

      // ✅ Retirer TOUS les event handlers avant de cleanup
      if (audioElement) {
        audioElement.onloadedmetadata = null;
        audioElement.ontimeupdate = null;
        audioElement.onended = null;
        audioElement.onerror = null;

        cleanupAudio(audioElement);
        audioRef.current = null;
      }

      // ✅ Réinitialiser l'état seulement si on change de message
      setAudio(null);
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setError(null);
    };
  }, [audioBase64, onEnded]);

  const pause = useCallback(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [isPlaying]);

  const play = useCallback(() => {
    if (audioRef.current && !isPlaying) {
      playAudio(audioRef.current)
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error("Failed to resume audio:", err);
          setError("Failed to resume playback");
        });
    }
  }, [isPlaying]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, []);

  const seekTo = useCallback(
    (time) => {
      if (audioRef.current && time >= 0 && time <= duration) {
        audioRef.current.currentTime = time;
        setCurrentTime(time);
      }
    },
    [duration],
  );

  return {
    audio,
    isPlaying,
    currentTime,
    duration,
    error,
    pause,
    play,
    stop,
    seekTo,
  };
};

export default useAudio;
