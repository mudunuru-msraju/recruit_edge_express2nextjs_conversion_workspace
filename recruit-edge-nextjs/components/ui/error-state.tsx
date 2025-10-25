import { AlertTriangleIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ErrorStateProps {
  title?: string
  description?: string
  className?: string
  onRetry?: () => void
  retryText?: string
}

export function ErrorState({
  title = "Something went wrong",
  description = "An error occurred while loading the data. Please try again.",
  className,
  onRetry,
  retryText = "Try again"
}: ErrorStateProps) {
  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="flex flex-col items-center justify-center py-8 text-center">
        <AlertTriangleIcon className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4 max-w-md">{description}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            {retryText}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}