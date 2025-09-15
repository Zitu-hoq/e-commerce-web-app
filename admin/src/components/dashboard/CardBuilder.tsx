import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardCardProps } from "@/types";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

export function CardBuilder({
  title,
  primary,
  secondary,
  paint,
}: DashboardCardProps) {
  return (
    <Card className="m-4 w-[350px] md:w-[300px] sm:w-full bg-slate-200 border-slate-300 dark:bg-slate-900 dark:border-slate-800">
      <CardHeader>
        <CardTitle className={`text-center text-2xl ${paint}`}>
          {title}
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent>
        <p className="flex flex-row justify-between text-xl pt-4">
          <span>Total &nbsp;{title} : </span>
          <Badge className="text-2xl bg-primary">{primary}</Badge>
        </p>
      </CardContent>
      {typeof secondary === "number" && (
        <CardFooter className="flex justify-between text-lg">
          <p>{title === "Coupons" ? "Active Coupons:" : "Last Month: "}</p>
          <Badge
            className="text-xl text-primary border-primary"
            variant="outline"
          >
            {secondary}
          </Badge>
        </CardFooter>
      )}
    </Card>
  );
}
