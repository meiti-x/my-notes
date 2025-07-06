import React, { useEffect, useRef } from "react";

const PwaInstallButton: React.FC = () => {
  const deferredPromptRef = useRef<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      deferredPromptRef.current = e;
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPromptRef.current) {
      deferredPromptRef.current.prompt();
      const result = await deferredPromptRef.current.userChoice;
      console.log(result.outcome);
    } else {
      alert("مرورگر از نصب PWA پشتیبانی نمی‌کنه یا آماده نیست.");
    }
  };

  return (
    <button
      onClick={handleInstall}
      style={{
        marginTop: "1.5rem",
        padding: "0.8rem 1.5rem",
        fontSize: "1rem",
        fontFamily: "Vazirmatn",
        backgroundColor: "#007acc",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "0.3s",
      }}
    >
      📲 نصب نسخه آفلاین
    </button>
  );
};

export default PwaInstallButton;
