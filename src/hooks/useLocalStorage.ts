import { useEffect, useState } from "react";


// Custom hook to store data in local storage
export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
  const [value, setValue] = useState<T>(() => {
    const jsonValue = localStorage.getItem(key);
    if (jsonValue !== null) return JSON.parse(jsonValue);

    if (typeof initialValue === "function") {
      return (initialValue as () => T)();
    } else {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  // Function to remove the item from local storage
  const removeFromLocalStorage = () => {
    localStorage.removeItem(key);
    setValue(initialValue); // Reset the value to initialValue
  };

  return [value, setValue, removeFromLocalStorage] as [
    typeof value,
    typeof setValue,
    typeof removeFromLocalStorage
  ];
}
