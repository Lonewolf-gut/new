import { cn } from "@/lib/utils"

interface ProgressIndicatorProps {
  current: number
  total: number
}

export function ProgressIndicator({ current, total }: ProgressIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "w-2.5 h-2.5 rounded-full transition-colors",
            index === current ? "bg-primary" : "bg-gray-300",
          )}
        />
      ))}
    </div>
  )
}
