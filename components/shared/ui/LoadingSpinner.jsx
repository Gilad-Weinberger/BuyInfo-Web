const LoadingSpinner = ({ size = "default", message = "Loading..." }) => {
  const sizeClasses = {
    small: "w-4 h-4",
    default: "w-8 h-8",
    large: "w-12 h-12",
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`${sizeClasses[size]} border-4 border-blue-600 border-t-transparent rounded-full animate-spin`}
      ></div>
      {message && <p className="text-gray-600 mt-4 text-sm">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
