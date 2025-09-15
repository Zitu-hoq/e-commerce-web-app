import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"

export default function ReviewsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Star className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Reviews</h3>
          <p className="text-sm text-muted-foreground">You haven't written any reviews yet.</p>
        </div>
      </CardContent>
    </Card>
  )
}

