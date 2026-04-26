import { useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";

interface UseSessionTimeoutOptions {
  timeoutMinutes?: number;
  warningMinutes?: number;
  onWarning?: () => void;
}

// Type untuk Timeout
type TimeoutId = ReturnType<typeof setTimeout>;

export const useSessionTimeout = ({
  timeoutMinutes = 30,
  warningMinutes = 1,
  onWarning,
}: UseSessionTimeoutOptions = {}) => {
  const { logout } = useAuth();
  const timeoutRef = useRef<TimeoutId | null>(null);
  const warningRef = useRef<TimeoutId | null>(null);
  const lastActivityRef = useRef<number>(0);

  // Inisialisasi lastActivity di useEffect, bukan di render
  useEffect(() => {
    const savedActivity = localStorage.getItem("lastActivity");
    if (savedActivity) {
      lastActivityRef.current = parseInt(savedActivity);
    } else {
      lastActivityRef.current = Date.now();
      localStorage.setItem("lastActivity", lastActivityRef.current.toString());
    }
  }, []);

  const clearTimeouts = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (warningRef.current) {
      clearTimeout(warningRef.current);
      warningRef.current = null;
    }
  }, []);

  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    localStorage.setItem("lastActivity", lastActivityRef.current.toString());
    clearTimeouts();

    // Set warning timeout
    const warningMs = (timeoutMinutes - warningMinutes) * 60 * 1000;
    if (warningMs > 0 && onWarning) {
      warningRef.current = setTimeout(() => {
        onWarning();
      }, warningMs);
    }

    // Set logout timeout
    const timeoutMs = timeoutMinutes * 60 * 1000;
    timeoutRef.current = setTimeout(() => {
      logout();
      window.location.href = "/login";
    }, timeoutMs);
  }, [timeoutMinutes, warningMinutes, onWarning, logout, clearTimeouts]);

  useEffect(() => {
    const events = [
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "click",
      "mousemove",
    ];

    const handleActivity = () => {
      resetTimer();
    };

    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    resetTimer();

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      clearTimeouts();
    };
  }, [resetTimer, clearTimeouts]);

  return { resetTimer };
};
