// src/components/ui/Button.jsx
// Composant Button réutilisable

/**
 * Composant Button avec différentes variantes
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenu du bouton
 * @param {Function} props.onClick - Handler de clic
 * @param {boolean} props.disabled - Si le bouton est désactivé
 * @param {'primary'|'secondary'|'icon'} props.variant - Style du bouton
 * @param {string} props.className - Classes CSS supplémentaires
 */
export const Button = ({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  className = "",
  ...props
}) => {
  const baseStyles =
    "rounded-md font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary:
      "bg-green-500 hover:bg-green-600 active:bg-green-700 text-white px-10 py-4 focus:ring-green-500",
    secondary:
      "bg-gray-500 hover:bg-gray-600 active:bg-gray-700 text-white px-6 py-3 focus:ring-gray-500",
    icon: "bg-green-500 hover:bg-green-600 active:bg-green-700 text-white p-4 focus:ring-green-500",
  };

  const disabledStyles = disabled
    ? "cursor-not-allowed opacity-30 hover:bg-green-500"
    : "";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variants[variant] || variants.primary}
        ${disabledStyles}
        ${className}
      `.trim()}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
