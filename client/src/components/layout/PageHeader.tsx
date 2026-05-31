import type { ReactNode } from "react";

interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <section className="bg-gray-50 border-b border-gray-200 py-5 md:py-6">
      <div className="container">
        <h1 className="font-oswald text-xl sm:text-2xl md:text-3xl font-bold uppercase mb-1.5 md:mb-2">
          {title}
        </h1>
        {subtitle && (
          <p className="text-gray-600 text-sm md:text-base max-w-2xl">{subtitle}</p>
        )}
        {children}
      </div>
    </section>
  );
}
