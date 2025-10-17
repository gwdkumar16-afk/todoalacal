
import { useState, useMemo, useCallback } from 'react';

export const useAudio = (url: string) => {
  const audio = useMemo(() => typeof Audio !== "undefined" ? new Audio(url) : undefined, [url]);
  const [playing, setPlaying] = useState(false);

  if (audio) {
      audio.loop = true;
  }

  const play = useCallback(() => {
    if (audio) {
      audio.play().then(() => setPlaying(true)).catch(err => console.error("Audio play failed:", err));
    }
  }, [audio]);

  const stop = useCallback(() => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setPlaying(false);
    }
  }, [audio]);

  return { playing, play, stop };
};
