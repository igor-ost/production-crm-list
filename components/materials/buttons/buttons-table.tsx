"use client"

import { Trash2, Search, Edit, PlusSquare, Info, Calendar } from "lucide-react"
import { SetStateAction, useEffect, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import ButtonsUpdateModal from "./button-update-modal"
import ButtonsRemoveModal from "./button-remove-modal"
import ButtonsCreateModal from "./button-create-modal"
import UpdateQtyModal from "../update-qty-materials"
import { InvoiceList } from "../materials-table"
import { ViewInvoicesList } from "../view-invoices-list"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ViewConsumptionsList } from "../view-consumptions-list"
import { materialConsumptionsStore } from "@/store/material-consumptions"
import { Api } from "@/services/api-clients"

export interface Buttons {
  id: string;
  color: string;
  type: string;
  unit: string;
  invoices?: InvoiceList[]
}

interface ButtonsTableProps {
  buttonsList: Buttons[]
  setButtonsList: React.Dispatch<SetStateAction<Buttons[]>>
}

export function ButtonsTable({ buttonsList, setButtonsList }: ButtonsTableProps) {
  const {materialConsumptions} = materialConsumptionsStore()
  const [search, setSearch] = useState("")
  const [colorFilter, setColorFilter] = useState<string>("")
  const [typeFilter, setTypeFilter] = useState<string>("")


  const handleNew = (id: string, color: string, type: string, unit: string) => {
    const updated = {
      id: id,
      color: color,
      type: type,
      unit: unit,
    }
    setButtonsList((prev) => [...prev, updated]);
  }

  const handleDelete = (id: string) => {
    const updated = buttonsList.filter(item => item.id != id)
    setButtonsList(updated)
  }
  const handleQtyUpdate = (id: string, newInvoice: InvoiceList) => {
    setButtonsList(prev =>
      prev.map(item =>
        item.id === id
          ? {
            ...item,
            invoices: [...item.invoices || [], newInvoice]
          }
          : item
      )
    );
  };

  const handleUpdate = (id: string, color: string, type: string, unit: string) => {
    setButtonsList((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, color, type, unit }
          : item
      )
    );
  }

  const handleDeleteInvoice = async (id:string) => {
      try {
        const response = await Api.buttons.removeInvoice(id);
        if(response){
           setButtonsList((prev) => prev.filter(i=>i.id != id))
        }
      } catch (error) {
        console.log(error)
      }
  }

  const handleUpdateInvoice = async (id: string, qty: number, price: number) => {
    try {
      const data = {
        qty: qty,
        price:price
      }
      await Api.buttons.updateInvoce(id,data);
    } catch (error) {
      console.log(error)
    }
  }

  const uniqueColors = useMemo(() => [...new Set(buttonsList.map(z => z.color))], [buttonsList])
  const uniqueTypes = useMemo(() => [...new Set(buttonsList.map(z => z.type))], [buttonsList])

  const filteredButtons = useMemo(() => {
    return buttonsList.filter(z => {
      const matchesSearch =
        z.color.toLowerCase().includes(search.toLowerCase()) ||
        z.type.toLowerCase().includes(search.toLowerCase()) ||
        z.id.toString().includes(search)

      const matchesColor = colorFilter ? z.color === colorFilter : true
      const matchesType = typeFilter ? z.type === typeFilter : true

      return matchesSearch && matchesColor && matchesType
    })
  }, [buttonsList, search, colorFilter, typeFilter])



  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-white p-4 shadow-sm backdrop-blur">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={colorFilter} onValueChange={setColorFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Все цвета" />
          </SelectTrigger>
          <SelectContent>
            {uniqueColors.map(color => (
              <SelectItem key={color} value={color}>{color}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Все типы" />
          </SelectTrigger>
          <SelectContent>
            {uniqueTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="ml-auto">
          <ButtonsCreateModal onSubmit={handleNew}>
            <Button variant="yellow" className="rounded-lg">
              Добавить
            </Button>
          </ButtonsCreateModal>
        </div>
      </div>

      {/* Таблица */}
      <div className="overflow-hidden rounded-xl border bg-background/60 shadow-sm backdrop-blur">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[80px]">#</TableHead>
              <TableHead>Цвет</TableHead>
              <TableHead>Тип</TableHead>
              <TableHead>Кол-во</TableHead>
              <TableHead>Цена</TableHead>
              <TableHead className="text-right px-4">Действия</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredButtons.map((button, index) => {
              const latestInvoice = button.invoices?.reduce<InvoiceList | null>(
                (latest, curr) =>
                  !latest || new Date(curr.createdAt) > new Date(latest.createdAt)
                    ? curr
                    : latest,
                null
              )
              return(
              <TableRow
                key={button.id}
                className="transition-colors hover:bg-muted/40 even:bg-muted/20"
              >
                <TableCell className="font-medium text-muted-foreground">
                  {index + 1}
                </TableCell>

                <TableCell className="font-medium">
                  {button.color}
                </TableCell>

                <TableCell className="font-mono text-sm text-muted-foreground">
                  {button.type}
                </TableCell>

                <TableCell className="font-mono text-sm text-muted-foreground">
                  {materialConsumptions && (
                    <Badge>
                      {(
                        (button.invoices?.reduce(
                          (sum, item) => sum + (item.qty ?? 0),
                          0
                        ) ?? 0)
                        -
                        materialConsumptions
                          .filter(i => i.material_id === button.id)
                          .reduce(
                            (sum, item) => sum + (Number(item.qty) || 0),
                            0
                          )
                      )}
                      {button.unit}
                    </Badge>
                  )}
                </TableCell>

                <TableCell className="font-mono text-sm text-muted-foreground">
                  <Badge variant="outline">
                    {latestInvoice?.price ?? "---"} тг.
                  </Badge>
                </TableCell>

                <TableCell className="text-right">
                  <UpdateQtyModal
                    name={button.color + " " + button.type}
                    id={button.id}
                    type="buttons"
                    onSubmit={handleQtyUpdate}
                  >
                    <Button size="icon" variant="ghost">
                      <PlusSquare className="h-4 w-4" />
                    </Button>
                  </UpdateQtyModal>

                  <ViewInvoicesList onDelete={handleDeleteInvoice} onUpdate={handleUpdateInvoice} data={button.invoices || []}>
                    <Button size="icon" variant="ghost">
                      <Info className="h-4 w-4" />
                    </Button>
                  </ViewInvoicesList>

                  <ViewConsumptionsList material_id={button.id}>
                    <Button size="icon" variant="ghost"><Calendar className="h-4 w-4" /></Button>
                  </ViewConsumptionsList>

                  <ButtonsUpdateModal
                    id={button.id}
                    color={button.color}
                    type={button.type}
                    unit={button.unit}
                    onSubmit={handleUpdate}
                  >
                    <Button size="icon" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </ButtonsUpdateModal>

                  <ButtonsRemoveModal
                    id={button.id}
                    onSubmit={handleDelete}
                  >
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </ButtonsRemoveModal>
                </TableCell>
              </TableRow>
            )})}

            {filteredButtons.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-10 text-center text-muted-foreground"
                >
                  Ничего не найдено
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>

  )
}
