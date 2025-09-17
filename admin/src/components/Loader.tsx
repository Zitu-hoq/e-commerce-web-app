"use client";

import { cn } from "@/lib/utils";

interface WaveformLoaderProps {
  className?: string;
  barCount?: number;
  size?: "sm" | "md" | "lg";
}

export function WaveformLoader({
  className,
  barCount = 5,
  size = "md",
}: WaveformLoaderProps) {
  const sizeClasses = {
    sm: "h-4 w-1",
    md: "h-8 w-1.5",
    lg: "h-12 w-2",
  };

  const containerSizeClasses = {
    sm: "gap-1",
    md: "gap-1.5",
    lg: "gap-2",
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div
        className={cn(
          "flex items-center justify-center",
          containerSizeClasses[size],
          className
        )}
      >
        {Array.from({ length: barCount }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "bg-green-500 dark:bg-blue-500 rounded-full animate-pulse origin-center",
              sizeClasses[size]
            )}
            style={{
              animation: `waveform 1.2s ease-in-out infinite`,
              animationDelay: `${index * 0.1}s`,
              transformOrigin: "center",
            }}
          />
        ))}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @keyframes waveform {
            0%, 40%, 100% {
              transform: scaleY(0.4);
            }
            20% {
              transform: scaleY(1);
            }
          }
        `,
          }}
        />
      </div>
    </div>
  );
}
