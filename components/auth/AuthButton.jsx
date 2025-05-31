const AuthButton = ({
  type = "button",
  onClick,
  children,
  disabled = false,
  loading = false,
  variant = "primary",
  fullWidth = true,
  icon,
}) => {
  const baseClasses = `
    flex items-center justify-center px-4 py-3 border rounded-lg font-medium text-sm
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
    ${fullWidth ? "w-full" : ""}
    ${disabled || loading ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
  `;

  const variants = {
    primary: `
      bg-blue-600 hover:bg-blue-700 text-white border-transparent
      focus:ring-blue-500 shadow-sm hover:shadow-md
    `,
    secondary: `
      bg-white hover:bg-gray-50 text-gray-700 border-gray-300
      focus:ring-blue-500 shadow-sm hover:shadow-md
    `,
    google: `
      bg-white hover:bg-gray-50 text-gray-700 border-gray-300
      focus:ring-blue-500 shadow-sm hover:shadow-md
    `,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant]}`}
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          <span>Loading...</span>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          {icon && <span className="w-5 h-5">{icon}</span>}
          <span>{children}</span>
        </div>
      )}
    </button>
  );
};

export default AuthButton;
