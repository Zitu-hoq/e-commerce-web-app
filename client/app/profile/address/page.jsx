"use client";
import AddressCard from "@/components/AddressCard";
import EditAddressBook from "@/components/EditAddressBook";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PlusSquare } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function AddressPage() {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [edit, setEdit] = useState(false);
  const handleEdit = () => {
    setEdit(!edit);
  };
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Address Book</CardTitle>
        <Button onClick={handleEdit} variant="link" className="text-blue-600">
          {edit ? (
            "Cancel"
          ) : (
            <span className="flex">
              <PlusSquare className="mr-1" /> Add New Address
            </span>
          )}
        </Button>
      </CardHeader>
      {!edit && (
        <CardContent className="space-y-4">
          {user.addresses.map((address) => (
            <AddressCard key={address._id} address={address} />
          ))}
          <Separator />
          <div>
            <h3 className="font-medium mb-1">DEFAULT BILLING ADDRESS</h3>
            <p className="text-sm text-muted-foreground">
              Same as shipping address
            </p>
          </div>
        </CardContent>
      )}
      {edit && <EditAddressBook onClick={handleEdit} />}
    </Card>
  );
}
