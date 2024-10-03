import { useState, useEffect } from 'react';

export const useInterval = () => {
  const [seconds, setSeconds] = useState(0);

  const resetTimer = () => {
    setSeconds(0);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(seconds + 1);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [seconds]);

  return { seconds, resetTimer };
};
