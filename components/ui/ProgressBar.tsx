"use client";

type Props = {
  current: number;
  max: number;
  label: string;
  color?: "primary" | "accent" | "warn" | "danger";
  showPercentage?: boolean;
};

export default function ProgressBar({ 
  current, 
  max, 
  label, 
  color = "primary",
  showPercentage = true 
}: Props) {
  const percentage = Math.min((current / max) * 100, 100);
  
  const colorClasses = {
    primary: "bg-green-500",
    accent: "bg-blue-500", 
    warn: "bg-yellow-500",
    danger: "bg-red-500"
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium">{label}</span>
        {showPercentage && (
          <span className="text-muted">
            {current} / {max}
          </span>
        )}
      </div>
      
      <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
        <div 
          className={`h-full ${colorClasses[color]} transition-all duration-500 ease-out rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {showPercentage && (
        <div className="text-right text-xs text-muted">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
} 