import { useEffect, useRef, useState } from 'react';

export const useScrollObserver = () => {
  const scrollableElement = useRef(null);
  const observedElement = useRef(null);
  // Set to true first to not flash the scroll gradient
  const [isAtBottom, setIsAtBottom] = useState(true);

  useEffect(() => {
    if (scrollableElement.current === null) {
      return;
    }
    const currentScrollableElement = scrollableElement.current;
    const options = {
      root: observedElement.current,
    };

    const observer = new IntersectionObserver(callback, options);
    observer.observe(currentScrollableElement);
    return () => {
      observer.unobserve(currentScrollableElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollableElement.current, observedElement.current]);

  function callback(entries: IntersectionObserverEntry[]) {
    entries.forEach((entry) => {
      setIsAtBottom(entry.isIntersecting);
    });
  }

  return { scrollableElement, observedElement, isAtBottom };
};
