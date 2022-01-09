import { useEffect } from "react";

type KeyboardEventCallback = (e: KeyboardEvent) => void;

export default function useKeyDownEvent(callback: KeyboardEventCallback): void {
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      callback(e);
    };
    document.addEventListener("keydown", listener);

    return () => document.removeEventListener("keydown", listener);
  }, []);
}
