import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
}

export default function Card({ children, className = "", header, ...rest }: CardProps) {
  return (
    <div className={`card ${className}`.trim()} {...rest}>
      {header && <div className="mb-4">{header}</div>}
      <div>{children}</div>
    </div>
  );
}
