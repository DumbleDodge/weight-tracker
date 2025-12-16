export const Input = ({ type = "text", value, onChange, placeholder, className = "" }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    // Usamos 'bg-input' y 'text-main' (que viene heredado o explícito)
    className={`w-full bg-input border border-border rounded-2xl p-4 text-center font-bold outline-none focus:ring-2 focus:ring-primary/50 transition-colors duration-300 ${className}`}
  />
);