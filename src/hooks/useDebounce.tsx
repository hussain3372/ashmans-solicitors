import { useState, useEffect } from "react";

function useDebounce(value: string) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [value]);

  return debouncedValue;
}

export default useDebounce;
