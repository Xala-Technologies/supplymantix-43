import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown, Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchableComboboxProps {
  value?: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  createText?: string;
  onCreateNew?: (searchValue: string) => void;
  options: Array<{
    id: string;
    name: string;
    label?: string;
  }>;
  className?: string;
}

export const SearchableCombobox = ({
  value,
  onSelect,
  placeholder = "Select item...",
  searchPlaceholder = "Search...",
  emptyText = "No items found.",
  createText = "Create new",
  onCreateNew,
  options,
  className
}: SearchableComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const selectedOption = options.find(option => option.id === value);

  const filteredOptions = options.filter(option =>
    option.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    option.label?.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleCreateNew = () => {
    if (onCreateNew && searchValue.trim()) {
      onCreateNew(searchValue.trim());
      setOpen(false);
      setSearchValue("");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {selectedOption ? selectedOption.label || selectedOption.name : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 shadow-lg border border-gray-200" align="start">
        <Command className="rounded-lg">
          <CommandInput 
            placeholder={searchPlaceholder}
            value={searchValue}
            onValueChange={setSearchValue}
            className="flex h-11 w-full rounded-md bg-transparent py-3 px-3 text-sm outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50 border-none focus:ring-0"
          />
          <CommandList>
            <CommandGroup>
              {/* None/Unassigned option - only show if no search or "none" matches search */}
              {(!searchValue.trim() || "none".toLowerCase().includes(searchValue.toLowerCase())) && (
                <CommandItem
                  value="none"
                  onSelect={() => {
                    onSelect("none");
                    setOpen(false);
                    setSearchValue("");
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === "none" ? "opacity-100" : "opacity-0"
                    )}
                  />
                  None
                </CommandItem>
              )}
              
              {/* Filtered existing options */}
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.id}
                  value={option.id}
                  onSelect={(currentValue) => {
                    onSelect(currentValue === value ? "" : currentValue);
                    setOpen(false);
                    setSearchValue("");
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label || option.name}
                </CommandItem>
              ))}
            </CommandGroup>
            
            {/* Show create option only when no matches found and search has value */}
            {filteredOptions.length === 0 && searchValue.trim() && onCreateNew && (
              <CommandEmpty>
                <div className="flex flex-col items-center gap-2 py-6">
                  <p className="text-sm text-muted-foreground">{emptyText}</p>
                  <Button
                    size="sm"
                    onClick={handleCreateNew}
                    className="h-8"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {createText} "{searchValue.trim()}"
                  </Button>
                </div>
              </CommandEmpty>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};