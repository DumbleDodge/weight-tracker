export const Button = ({ children, onClick, disabled, variant = "primary", className = "" }) => {
  const baseStyles = "w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/20",
    danger: "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400",
    outline: "bg-transparent border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled} 
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};