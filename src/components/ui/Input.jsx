//
// src/components/ui/Input.jsx
import { forwardRef } from "react";

export const Input = forwardRef(
  (
    {
      placeholder = "Type a message...", // ✅ Placeholder par défaut
      value,
      onChange,
      onKeyDown,
      className = "",
      disabled = false,
      ...props
    },
    ref,
  ) => {
    const baseStyles = `
      w-full p-4 rounded-md
      bg-white bg-opacity-50 backdrop-blur-md
      placeholder:text-gray-800 placeholder:italic
      border-2 border-transparent
      focus:outline-none focus:border-green-500 focus:bg-opacity-70
      transition-all duration-200
    `;

    const disabledStyles = disabled ? "cursor-not-allowed opacity-50" : "";

    return (
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={`${baseStyles} ${disabledStyles} ${className}`.trim()}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export default Input;

// // src/components/ui/Input.jsx
// import { forwardRef } from "react";

// export const Input = forwardRef(
//   (
//     {
//       placeholder,
//       value,
//       onChange,
//       onKeyDown,
//       className = "",
//       disabled = false,
//       ...props
//     },
//     ref,
//   ) => {
//     return (
//       <input
//         ref={ref}
//         type="text"
//         value={value}
//         onChange={onChange}
//         onKeyDown={onKeyDown}
//         placeholder={placeholder}
//         disabled={disabled}
//         className={`w-full px-5 rounded-md focus:outline-none ${className}`}
//         {...props}
//       />
//     );
//   },
// );

// Input.displayName = "Input";

// export default Input;
