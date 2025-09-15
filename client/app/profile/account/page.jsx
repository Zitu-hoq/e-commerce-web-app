"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { DeleteUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AccountPage() {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const [password, setPassword] = useState("");
  const handleClick = () => {
    setShowPopup(!showPopup);
    setPassword("");
  };
  const handleDeleteUser = async () => {
    const success = await DeleteUser(password);
    if (success) {
      setShowPopup(false);
      setPassword("");
      router.push("/");
    } else {
      return;
    }
  };
  return (
    <Card className="md:mt-0 mt-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">
          Account Information
        </CardTitle>
        <Button variant="link" className="text-blue-600">
          EDIT
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium">User Name</h3>
          <p className="text-sm text-muted-foreground">user@example.com</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="marketing-sms" />
            <label htmlFor="marketing-sms">Receive marketing SMS</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="marketing-email" />
            <label htmlFor="marketing-email">Receive marketing emails</label>
          </div>
          <div className="flex flex-row-reverse items-center space-x-2">
            <Button variant="destructive" onClick={handleClick}>
              Delete My Account
            </Button>
          </div>
        </div>
      </CardContent>
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
          <div className="bg-red-200 p-6 rounded shadow-lg w-[400px] text-center relative">
            <h2 className="text-xl font-semibold text-red-600 mb-4">
              Warning!
            </h2>
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>

            <Input
              type="password"
              placeholder="Enter your password"
              className="w-full px-3 py-2 text-black border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex justify-center gap-4">
              <Button
                variant="primary"
                onClick={handleClick}
                className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="px-4 py-2"
                onClick={handleDeleteUser}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
