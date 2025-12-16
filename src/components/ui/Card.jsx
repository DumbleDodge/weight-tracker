export const Card = ({ children, className = "" }) => (
  // Fíjate: ahora usamos 'bg-surface' y 'border-border' que definimos en index.css
  <div className={`w-full p-6 bg-surface border border-border rounded-3xl shadow-sm transition-colors duration-300 ${className}`}>
    {children}
  </div>
);