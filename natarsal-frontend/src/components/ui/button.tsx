import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "white-outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  fullWidth = false,
  ...props
}) => {
  const baseStyles =
    "rounded-md font-medium transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center";

  const variantStyles = {
    primary:
      "bg-natarsal-gold text-white hover:bg-natarsal-black focus:ring-natarsal-gold",
    outline:
      "border-2 border-natarsal-gold text-natarsal-gold hover:bg-natarsal-gold hover:text-white focus:ring-natarsa-gold",
    "white-outline":
      "border-2 border-white text-white hover:bg-white hover:text-natarsal-black focus:ring-white",
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-10 py-4 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
