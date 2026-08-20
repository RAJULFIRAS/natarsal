import React from "react";
import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
  textColor?: string;
  size?: "sm" | "md" | "lg";
}

const Logo: React.FC<LogoProps> = ({
  className = "",
  textColor = "text-natarsal-black",
  size = "md",
}) => {
  const sizes = {
    sm: { text: "text-xl", icon: 32 },
    md: { text: "text-2xl", icon: 40 },
    lg: { text: "text-3xl", icon: 48 },
  };

  return (
    <Link to="/" className={`flex items-center gap-2 group ${className}`}>
      <div className="relative transition-transform duration-300 group-hover:scale-105">
        <img
          src="public/images/logo.png"
          alt="Natarsal Logo"
          className="w-10 h-10 object-contain"
        />
      </div>
      <span
        className={`font-display font-bold tracking-wide transition-colors duration-300 ${textColor} ${sizes[size].text}`}
      >
        NATARSAL
      </span>
    </Link>
  );
};

export default Logo;
