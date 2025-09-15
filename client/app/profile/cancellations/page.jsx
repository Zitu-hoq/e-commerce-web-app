import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { XCircle } from "lucide-react"

export default function CancellationsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Cancellations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <XCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Cancellations</h3>
          <p className="text-sm text-muted-foreground">You have no cancelled orders.</p>
        </div>
      </CardContent>
    </Card>
  )
}

