"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LocationSelector from "@/components/ui/location-input";
import { PhoneInput } from "@/components/ui/phone-input";
import { addAddressAPI, updateAddressAPI } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { SelectUpazila } from "./SelectUpazila";

const formSchema = z.object({
  _id: z.string().optional(),
  isDefault: z.boolean().default(false),
  fullName: z.string().min(4),
  phone: z.string().min(11),
  country: z.string().min(1),
  state: z.string().min(1),
  city: z.string().min(1),
  zipCode: z.string().min(1),
  addressLine2: z.string().optional(),
  addressLine1: z.string().min(1),
});

export default function EditAddressBook({ address, onClick }) {
  const [countryName, setCountryName] = useState("Bangladesh");
  const [stateName, setStateName] = useState("");

  let form = useForm({
    resolver: zodResolver(formSchema),
  });

  if (address) {
    form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: address,
    });
  }

  const handleSelectedUpazila = (value) => {
    form.setValue("country", countryName);
    form.setValue("state", stateName);
    form.setValue("city", value);
  };

  const handleClick = () => {
    form.reset();
    onClick();
  };

  async function onSubmit(values) {
    try {
      if (address) await updateAddressAPI(values);
      else await addAddressAPI(values);
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    } finally {
      window.location.reload();
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) =>
          toast.error("Validation error!")
        )}
        className="space-y-8 max-w-3xl mx-auto py-10"
      >
        <FormField
          control={form.control}
          name="isDefault"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Set as default shipping & billing address.
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Your Full Name..."
                  type="name"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone number</FormLabel>
              <FormControl>
                <PhoneInput
                  placeholder="018......"
                  {...field}
                  defaultCountry="BD"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Country</FormLabel>
              <FormControl>
                <LocationSelector
                  onCountryChange={(country) => {
                    setCountryName(country?.name || "");
                    form.setValue("state", "");
                  }}
                  onStateChange={(state) => {
                    setStateName(state?.name || "");
                  }}
                />
              </FormControl>
              <FormDescription>
                If your country has states, it will be appear after selecting
                country
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upazila/Thana:</FormLabel>
                  <FormControl>
                    {countryName === "Bangladesh" && stateName && (
                      <SelectUpazila
                        state={stateName}
                        onValueChange={handleSelectedUpazila}
                      />
                    )}
                  </FormControl>
                  <FormDescription>
                    Upazila Only available for Bangladesh.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-6">
            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Post Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="post code"
                      type=""
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="addressLine1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Village</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Village/ward"
                      type=""
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-6">
            <FormField
              control={form.control}
              name="addressLine2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="street/house no."
                      type=""
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex gap-x-4">
          <Button type="submit">Submit</Button>
          <Button type="button" onClick={handleClick}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
