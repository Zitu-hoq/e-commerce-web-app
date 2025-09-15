"use client";
import { PaymentOption } from "@/components/PaymentOption";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function MessagesPage() {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const messages = user.message || [];

  const [popup, setPopup] = useState(false);
  const handleCancel = () => setPopup(false);
  const handlePayment = () => setPopup(true);
  useEffect(() => {
    const reload = sessionStorage.getItem("reload") === "true";
    if (reload) {
      sessionStorage.removeItem("reload");
      window.location.reload();
    }
  }, []);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Messages</CardTitle>
      </CardHeader>
      <CardContent>
        {messages.length !== 0 ? (
          messages.map((message) => {
            return (
              <div
                key={message._id}
                className="flex flex-col items-left justify-center text-start"
              >
                <p className="m-2">
                  <span className="font-semibold text-lg text-red-600">
                    {message.title}:&nbsp;
                  </span>
                  <span className="text-sm">{message.description}</span>
                </p>
                <p className="text-start text-sm text-muted-foreground m-2">
                  <span>Items:</span>
                  {message.products.map((name) => {
                    return (
                      <span key={name} className="p-1 underline">
                        {name}
                      </span>
                    );
                  })}
                </p>
                <Button
                  variant="outline"
                  className="m-2 text-green-500"
                  onClick={handlePayment}
                >
                  go to Payment
                </Button>
                {popup && (
                  <PaymentOption
                    handleCancel={handleCancel}
                    orderId={message.Link}
                  />
                )}

                <Separator />
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Messages</h3>
            <p className="text-sm text-muted-foreground">
              You have no messages at this time.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
