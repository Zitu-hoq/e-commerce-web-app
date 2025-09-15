"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Logout } from "@/lib/auth";
import { Info } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";

export default function MessagesPage() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await dispatch(Logout());
      window.location.href = "/";
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Logout</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center text-destructive justify-center py-12 text-center">
          <Info className="h-12 w-12 text-muted-destructive mb-4" />
          <h3 className="text-lg font-medium mb-2">Desclaimer</h3>
          <p className="text-sm text-muted-foreground">
            Once you log out. You can't place order!
          </p>
        </div>
        <div className="text-right">
          <Button
            type="button"
            variant="destructive"
            disabled={loading}
            onClick={handleLogout}
          >
            {loading ? "Logging out..." : "Log Out"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
