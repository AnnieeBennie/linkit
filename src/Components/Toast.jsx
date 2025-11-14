import { useEffect } from "react";

export default function Toast({
  open,
  message,
  actionText,
  onAction,
  onClose,
  duration = 2500,
}) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(t);
  }, [open, duration, onClose]);

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        background: "#333",
        color: "#fff",
        padding: "10px 14px",
        borderRadius: 8,
        boxShadow: "0 6px 20px rgba(0,0,0,.25)",
        display: "flex",
        gap: 10,
        alignItems: "center",
        zIndex: 9999,
      }}
      role="status"
      aria-live="polite"
    >
      <span>{message}</span>
      {actionText && (
        <button
          onClick={onAction}
          style={{
            background: "transparent",
            color: "#ffd28a",
            border: "none",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
