import { AlertCircle } from "lucide-react";

export default function FieldError({ id, message, className = "field-error-msg" }) {
  if (!message) return null;
  return (
    <span id={id} className={className} role="alert">
      <AlertCircle size={12} /> {message}
    </span>
  );
}
