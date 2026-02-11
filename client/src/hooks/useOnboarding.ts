import { useState, useCallback } from "react";

const ONBOARDING_KEY = "mjml-editor-onboarding-complete";

export function useOnboarding() {
  const [showTour, setShowTour] = useState(() => {
    return !localStorage.getItem(ONBOARDING_KEY);
  });

  const completeTour = useCallback(() => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setShowTour(false);
  }, []);

  const resetTour = useCallback(() => {
    localStorage.removeItem(ONBOARDING_KEY);
    setShowTour(true);
  }, []);

  return { showTour, completeTour, resetTour };
}
