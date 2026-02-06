"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Templates } from "../templates/templates-table"
import TemplatesCreateModal from "../templates/templates-create-modal"


interface TemplatesSelectProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  templates:Templates[]
  onCreate?: (id: string, name: string, description: string,cuttingPrice:number,sewingPrice:number,buttonsPrice:number)=>void
}


export default function SelectTemplates({
  value,
  onValueChange,
  placeholder = "Выберите изделие...",
  disabled = false,
  templates,
  onCreate,
}: TemplatesSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [templatesList,setTemplatesList] = React.useState(templates)
  const selectedTemplates = templates.find((unit) => unit.id === value)

  const filteredTemplates = React.useMemo(() => {
    if (!searchQuery) return templates

    const query = searchQuery.toLowerCase()
    return templates.filter(
      (template) =>
        template.name?.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query)
    )
  }, [searchQuery])

  React.useEffect(()=>{
    setTemplatesList(templates)
    setSearchQuery("")
  },[templates])

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
          {selectedTemplates ? (
            <div className="flex items-center gap-2">
              <span className="font-medium">{selectedTemplates.name}</span>
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
            <CommandEmpty>
              Изделие не найдено.
              {onCreate && (
                <TemplatesCreateModal defaultName={searchQuery} onSubmit={onCreate}>
                  <Button variant="link" className="cursor-pointer">Создать новое изделие ({searchQuery})</Button>
                </TemplatesCreateModal>
              )}
            </CommandEmpty>
            <CommandGroup>
              {filteredTemplates.map((template) => (
                <CommandItem
                  key={template.id}
                  value={template.id}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                    setSearchQuery("")
                  }}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="font-medium">{template.name}</span>
                   
                  </div>
                  <Check className={cn("size-4 shrink-0", value === template.id ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
