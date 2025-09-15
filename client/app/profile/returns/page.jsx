import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RotateCcw } from "lucide-react"

export default function ReturnsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Returns</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <RotateCcw className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Returns</h3>
          <p className="text-sm text-muted-foreground">You have no returns at this time.</p>
        </div>
      </CardContent>
    </Card>
  )
}

