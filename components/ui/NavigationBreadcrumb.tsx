"use client";
import Link from "next/link";

type NavigationBreadcrumbProps = {
  items: Array<{
    label: string;
    href?: string;
    icon?: string;
  }>;
  showHome?: boolean;
  className?: string;
};

export default function NavigationBreadcrumb({ 
  items, 
  showHome = true, 
  className = "" 
}: NavigationBreadcrumbProps) {
  return (
    <nav className={`flex items-center gap-2 text-sm ${className}`}>
      {showHome && (
        <Link 
          href="/" 
          className="btn-ghost btn-sm px-3 py-1 text-muted hover:text-white transition-colors"
        >
          🏠 Home
        </Link>
      )}
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && <span className="text-muted">/</span>}
          
          {item.href ? (
            <Link 
              href={item.href}
              className="btn-ghost btn-sm px-3 py-1 text-muted hover:text-white transition-colors"
            >
              {item.icon && <span className="mr-1">{item.icon}</span>}
              {item.label}
            </Link>
          ) : (
            <span className="text-white px-3 py-1">
              {item.icon && <span className="mr-1">{item.icon}</span>}
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}

// Predefined navigation patterns
export const NavigationPatterns = {
  // For parent dashboard flows
  parentDashboard: [
    { label: "Dashboard", href: "/dashboard", icon: "📊" }
  ],
  
  // For chore management flows
  choreManagement: [
    { label: "Dashboard", href: "/dashboard", icon: "📊" },
    { label: "Klussen Beheren", icon: "📝" }
  ],
  
  // For kid view flows
  kidView: [
    { label: "Dashboard", href: "/dashboard", icon: "📊" },
    { label: "Kid View", icon: "👶" }
  ],
  
  // For game flows
  gameView: [
    { label: "Dashboard", href: "/dashboard", icon: "📊" },
    { label: "Spel", icon: "🎮" }
  ],
  
  // For reward flows
  rewardManagement: [
    { label: "Dashboard", href: "/dashboard", icon: "📊" },
    { label: "Beloningen", icon: "🎁" }
  ],
  
  // For onboarding flows
  onboarding: [
    { label: "Onboarding", icon: "📋" }
  ]
}; 