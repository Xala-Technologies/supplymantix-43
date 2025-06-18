
interface PageContentProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}

export function PageContent({ children, className = "", padding = true }: PageContentProps) {
  const paddingClass = padding ? "p-4" : "";
  
  return (
    <div className={`flex-1 overflow-y-auto ${paddingClass} ${className}`}>
      {children}
    </div>
  );
}
