import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

// Import JSON data directly
import countries from "@/public/countries.json";
import states from "@/public/states.json";

const LocationSelector = ({ disabled, onCountryChange, onStateChange }) => {
  const [selectedCountry, setSelectedCountry] = useState({
    id: 19,
    name: "Bangladesh",
    iso3: "BGD",
    iso2: "BD",
    numeric_code: "050",
    phone_code: "880",
    capital: "Dhaka",
    currency: "BDT",
    currency_name: "Bangladeshi taka",
    currency_symbol: "৳",
    tld: ".bd",
    native: "Bangladesh",
    region: "Asia",
    region_id: "3",
    subregion: "Southern Asia",
    subregion_id: "14",
    nationality: "Bangladeshi",
    timezones: [
      {
        zoneName: "Asia/Dhaka",
        gmtOffset: 21600,
        gmtOffsetName: "UTC+06:00",
        abbreviation: "BDT",
        tzName: "Bangladesh Standard Time",
      },
    ],
    translations: {
      kr: "방글라데시",
      "pt-BR": "Bangladesh",
      pt: "Bangladeche",
      nl: "Bangladesh",
      hr: "Bangladeš",
      fa: "بنگلادش",
      de: "Bangladesch",
      es: "Bangladesh",
      fr: "Bangladesh",
      ja: "バングラデシュ",
      it: "Bangladesh",
      cn: "孟加拉",
      tr: "Bangladeş",
    },
    latitude: "24.00000000",
    longitude: "90.00000000",
    emoji: "🇧🇩",
    emojiU: "U+1F1E7 U+1F1E9",
  });
  const [selectedState, setSelectedState] = useState(null);
  const [openCountryDropdown, setOpenCountryDropdown] = useState(false);
  const [openStateDropdown, setOpenStateDropdown] = useState(false);

  const countriesData = countries;
  const statesData = states;

  // Filter states for selected country
  const availableStates = statesData.filter(
    (state) => state.country_id === selectedCountry?.id
  );

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setSelectedState(null); // Reset state when country changes
    onCountryChange?.(country);
    onStateChange?.(null);
  };

  const handleStateSelect = (state) => {
    setSelectedState(state);
    onStateChange?.(state);
  };

  return (
    <div className="flex gap-4">
      {/* Country Selector */}
      <Popover open={openCountryDropdown} onOpenChange={setOpenCountryDropdown}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openCountryDropdown}
            disabled={disabled}
            className="w-full justify-between"
          >
            {selectedCountry ? (
              <div className="flex items-center gap-2">
                <span>{selectedCountry.emoji}</span>
                <span>{selectedCountry.name}</span>
              </div>
            ) : (
              <span>Select Country...</span>
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            <CommandInput placeholder="Search country..." />
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                <ScrollArea className="h-[300px]">
                  {countriesData.map((country) => (
                    <CommandItem
                      key={country.id}
                      value={country.name}
                      onSelect={() => {
                        handleCountrySelect(country);
                        setOpenCountryDropdown(false);
                      }}
                      className="flex cursor-pointer items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span>{country.emoji}</span>
                        <span>{country.name}</span>
                      </div>
                      <Check
                        className={cn(
                          "h-4 w-4",
                          selectedCountry?.id === country.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                  <ScrollBar orientation="vertical" />
                </ScrollArea>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* State Selector - Only shown if selected country has states */}
      {availableStates.length > 0 && (
        <Popover open={openStateDropdown} onOpenChange={setOpenStateDropdown}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openStateDropdown}
              disabled={!selectedCountry}
              className="w-full justify-between"
            >
              {selectedState ? (
                <span>{selectedState.name}</span>
              ) : (
                <span>Select State...</span>
              )}
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Command>
              <CommandInput placeholder="Search state..." />
              <CommandList>
                <CommandEmpty>No state found.</CommandEmpty>
                <CommandGroup>
                  <ScrollArea className="h-[300px]">
                    {availableStates.map((state) => (
                      <CommandItem
                        key={state.id}
                        value={state.name}
                        onSelect={() => {
                          handleStateSelect(state);
                          setOpenStateDropdown(false);
                        }}
                        className="flex cursor-pointer items-center justify-between text-sm"
                      >
                        <span>{state.name}</span>
                        <Check
                          className={cn(
                            "h-4 w-4",
                            selectedState?.id === state.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                    <ScrollBar orientation="vertical" />
                  </ScrollArea>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default LocationSelector;
