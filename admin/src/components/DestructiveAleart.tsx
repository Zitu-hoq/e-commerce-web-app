import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { Alert, AlertTitle } from "./ui/alert";

interface aleartProps {
  trigger: string;
  description: string;
  btn: string;
  onConfirm: () => void;
}

export function DestructiveAlert(props: aleartProps) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await props.onConfirm();
    } catch (err) {
      console.error("Error during API call:", err);
    } finally {
      setIsSubmitting(false);
      setDialogOpen(false);
    }
  };
  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          {props.trigger}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogHeader>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{props.description}</AlertTitle>
          </Alert>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
          <Button
            type="button"
            disabled={isSubmitting}
            variant="destructive"
            onClick={handleConfirm}
          >
            {isSubmitting ? "Deleting..." : props.btn}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
