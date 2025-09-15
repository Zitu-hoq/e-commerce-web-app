import district from "@/public/bd-districts.json";
import other from "@/public/bd-upazilas.json";
import dhaka from "@/public/dhaka-city.json";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

export const SelectUpazila = ({ state, onValueChange }) => {
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const dhakaCityData = dhaka;
  const otherCityData = other;
  const districtData = district;

  useEffect(() => {
    const selectedState = state.split(" ")[0];
    const selectedDistrict = districtData.districts.find(
      (district) => district.name === selectedState
    );
    const districtID = selectedDistrict.id || 0;
    if (districtID == 1) {
      setData(dhakaCityData.dhaka);
      setShow(true);
    } else {
      const upazilas = otherCityData.upazilas.filter(
        (upazilas) => upazilas.district_id === districtID
      );

      setData(upazilas);
      setShow(true);
    }
  }, [state]);

  return (
    <Select onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a Upazila/Thana" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Select Upazila</SelectLabel>
          {show &&
            data.map((upazila) => (
              <SelectItem
                key={`${upazila.district_id}-${upazila.name}`}
                value={upazila.name}
              >
                {upazila.name}
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
