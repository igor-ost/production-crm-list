"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"

export type Materials = {
  id: string
  name?: string
  type?: string
  color?: string
}

interface MaterialSelectProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  materials: Materials[]
}

export default function SelectMaterials({
  value,
  onValueChange,
  placeholder = "Выберите материал...",
  disabled = false,
  materials
}: MaterialSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  const selectedMaterial = materials.find((m) => m.id === value)

  // Универсальное форматирование
  const formatMaterial = React.useCallback((material: Materials) => {
    return [material.name, material.color, material.type]
      .filter(Boolean)
      .join(" - ")
  }, [])

  const filteredMaterials = React.useMemo(() => {
    if (!searchQuery) return materials

    const query = searchQuery.toLowerCase()

    return materials.filter((material) =>
      [material.name, material.color, material.type]
        .filter(Boolean)
        .some((field) =>
          field!.toLowerCase().includes(query)
        )
    )
  }, [searchQuery, materials])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between font-normal",
            !value && "text-muted-foreground"
          )}
        >
          {selectedMaterial ? (
            <span className="truncate font-medium">
              {formatMaterial(selectedMaterial)}
            </span>
          ) : (
            placeholder
          )}

          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-(--radix-popover-trigger-width) p-0"
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Поиск..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />

          <CommandList>
            <CommandEmpty>Материал не найден.</CommandEmpty>

            <CommandGroup>
              {filteredMaterials.map((material) => (
                <CommandItem
                  key={material.id}
                  value={material.id}
                  onSelect={(currentValue) => {
                    onValueChange(
                      currentValue === value ? "" : currentValue
                    )
                    setOpen(false)
                    setSearchQuery("")
                  }}
                  className="flex items-center justify-between"
                >
                  <span className="truncate font-medium">
                    {formatMaterial(material)}
                  </span>

                  <Check
                    className={cn(
                      "size-4 shrink-0",
                      value === material.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}