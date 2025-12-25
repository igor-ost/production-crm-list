"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Staff } from "../staff/staff-table"
import RoleBadge from "./role-badge"




interface SelectStaffProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  staff:Staff[]
}


export default function SelectStaff({
  value,
  onValueChange,
  placeholder = "Выберите пользователя...",
  disabled = false,
  staff,
}: SelectStaffProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const selectedStaff = staff.find((unit) => unit.id === value)

const filteredStaff = React.useMemo(() => {
  const excludedRoles = ["admin", "manager", "accountant", "technologist"];

  return staff
    .filter(st => !excludedRoles.includes(st.role?.toLowerCase() || ""))
    .filter(st => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return st.login?.toLowerCase().includes(query) || st.role?.toLowerCase().includes(query);
    });
}, [staff, searchQuery]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn("w-full justify-between font-normal", !value && "text-muted-foreground")}
        >
          {selectedStaff ? (
            <div className="flex items-center gap-2">
              <span className="font-medium">{selectedStaff.login} - {selectedStaff.role}</span>
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput placeholder="Поиск..." value={searchQuery} onValueChange={setSearchQuery} />
          <CommandList>
            <CommandEmpty>Пользователь не найден.</CommandEmpty>
            <CommandGroup>
              {filteredStaff.map((staff) => (
                <CommandItem
                  key={staff.id}
                  value={staff.id}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                    setSearchQuery("")
                  }}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="font-medium">{staff.login} - <RoleBadge role={staff.role}/></span>
                   
                  </div>
                  <Check className={cn("size-4 shrink-0", value === staff.id ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
