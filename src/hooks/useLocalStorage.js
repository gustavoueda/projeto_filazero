import { useState, useRef } from 'react';

export function useLocalStorage(key, initialValue) {
  const [stored, setStored] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const latestRef = useRef(stored);
  latestRef.current = stored;

  function setValue(value) {
    try {
      const toStore = typeof value === 'function' ? value(latestRef.current) : value;
      latestRef.current = toStore;
      setStored(toStore);
      if (toStore === null || toStore === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(toStore));
      }
    } catch {
      // ignore write errors
    }
  }

  return [stored, setValue];
}
