import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button: React.FC<ButtonProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={cn(
        "px-6 py-2 bg-primary text-primary-foreground font-bold text-xl tracking-wider",
        "hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary",
        "transition-colors duration-200",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};