// src/components/ui/LoadingSpinner.jsx
// Composant LoadingSpinner

/**
 * Spinner de chargement
 * @param {Object} props
 * @param {string} props.size - Taille ('sm'|'md'|'lg')
 * @param {string} props.className - Classes CSS supplémentaires
 */
export const LoadingSpinner = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div
      className={`
        ${sizes[size]}
        border-gray-300 border-t-green-500
        rounded-full
        animate-spin
        ${className}
      `.trim()}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
