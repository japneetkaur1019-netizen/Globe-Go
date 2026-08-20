import { useEffect, useRef, useState } from "react";

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const storedValue = localStorage.getItem(key);

      return storedValue !== null
        ? JSON.parse(storedValue)
        : initialValue;
    } catch (error) {
      console.error("Error reading localStorage:", error);

      return initialValue;
    }
  });

  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    try {
      localStorage.setItem(
        key,
        JSON.stringify(value)
      );
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorage;