const AuthInput = ({
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  error = false,
  icon,
}) => {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`
          block w-full px-3 py-3 border rounded-lg text-gray-900 placeholder-gray-500
          ${icon ? "pl-10" : "pl-3"}
          ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          }
          ${disabled ? "bg-gray-50 cursor-not-allowed" : "bg-white"}
          focus:outline-none focus:ring-1 transition-colors
          text-sm
        `}
      />
    </div>
  );
};

export default AuthInput;
