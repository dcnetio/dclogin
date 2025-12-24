import React from "react";

type Variant = "primary" | "neutral" | "ghost" | "danger" | "outline";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children?: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary: "btn-primary",
  neutral: "bg-gray-100 hover:bg-gray-200 text-gray-900",
  ghost: "bg-transparent text-white hover:opacity-90",
  danger: "bg-red-600 hover:bg-red-700 text-white",
  outline: "bg-transparent border border-white/20 text-white px-3 py-2 rounded-lg",
};

export default function Button({
  variant = "primary",
  className = "",
  children,
  disabled,
  ...rest
}: ButtonProps) {
  const base = "inline-flex items-center justify-center font-medium rounded-lg px-4 py-2 disabled:opacity-50";
  const classes = `${base} ${variantClasses[variant]} ${className}`.trim();

  return (
    // eslint-disable-next-line react/button-has-type
    <button className={classes} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}
