"use client";
import { Edit, MapPin, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";
import { useState } from "react";
import EditAddressBook from "./EditAddressBook";
import { Button } from "./ui/button";

export default function AddressCard({ address, payment }) {
  const addressData = {
    fullName: address.fullName || "",
    village: address.addressLine1 || "",
    street: address.addressLine2 || "",
    phone: address.phone || "",
    city: address.city || "",
    state: address.state || "",
    country: address.country || "",
    code: address.zipCode || "",
    default: address.isDefault,
  };
  const [edit, setEdit] = useState(false);

  const handleClick = () => {
    setEdit(!edit);
  };

  return (
    <CardContent>
      {!edit && (
        <div className="flex justify-between bg-blue-50 border border-blue-200 rounded-lg p-4 dark:bg-gray-800">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {addressData.fullName}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                {addressData.street}, {addressData.village}, {addressData.city}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                {addressData.state}-{addressData.code}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                {addressData.country}
              </p>
              <p className="text-gray-700 dark:text-gray-300 mt-1">
                Phone: {addressData.phone}
              </p>
              {addressData.default ? (
                <Badge variant="secondary" className="mt-2 text-green-500">
                  Default Address
                </Badge>
              ) : (
                ""
              )}
            </div>
          </div>
          {!payment && (
            <div>
              <Button
                variant="outline"
                size="sm"
                className="flex flex-end gap-2 bg-transparent mb-2"
                onClick={handleClick}
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent text-red-600 hover:bg-red-600"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          )}
        </div>
      )}
      {edit && <EditAddressBook address={address} onClick={handleClick} />}
    </CardContent>
  );
}
