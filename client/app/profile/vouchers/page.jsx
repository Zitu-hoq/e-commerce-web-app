import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Ticket } from "lucide-react"

export default function VouchersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Vouchers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Ticket className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Vouchers</h3>
          <p className="text-sm text-muted-foreground">You have no vouchers at this time.</p>
        </div>
      </CardContent>
    </Card>
  )
}

