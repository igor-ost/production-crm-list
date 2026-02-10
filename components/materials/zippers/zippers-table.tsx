"use client"

import { Trash2, Search, Edit, PlusSquare, Info, MinusCircleIcon, Calendar } from "lucide-react"
import { SetStateAction, useMemo, useState } from "react"

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
import ZippersCreateModal from "./zipper-create-modal"
import ZippersUpdateModal from "./zipper-update-modal"
import ZippersRemoveModal from "./zipper-remove-modal"
import { Badge } from "@/components/ui/badge"
import UpdateQtyModal from "../update-qty-materials"
import { InvoiceList } from "../materials-table"
import { ViewInvoicesList } from "../view-invoices-list"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ViewConsumptionsList } from "../view-consumptions-list"
import { materialConsumptionsStore } from "@/store/material-consumptions"

export interface Zippers {
  id: string
  color: string
  type: string
  unit: string
  invoices?: InvoiceList[]
}

interface ZippersTableProps {
  zippersList: Zippers[]
  setZippersList: React.Dispatch<SetStateAction<Zippers[]>>
}

export function ZippersTable({ zippersList, setZippersList }: ZippersTableProps) {
  const {materialConsumptions} = materialConsumptionsStore()
  const [search, setSearch] = useState("")
  const [colorFilter, setColorFilter] = useState<string>("")
  const [typeFilter, setTypeFilter] = useState<string>("")

  // Для создания новых элементов
  const handleNew = (id:string,color:string,type:string,unit:string) => {
    const updated = { id, color, type, unit }
    setZippersList((prev) => [...prev, updated])
  }

  const handleDelete = (id:string) => {
    setZippersList(zippersList.filter(item => item.id !== id))
  }

  const handleQtyUpdate = (id: string, newInvoice: InvoiceList) => {
    setZippersList(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, invoices: [...item.invoices || [], newInvoice] }
          : item
      )
    )
  }

  const handleUpdate = (id:string,color:string,type:string,unit:string) => {
    setZippersList(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, color, type, unit }
          : item
      )
    )
  }

  const uniqueColors = useMemo(() => [...new Set(zippersList.map(z => z.color))], [zippersList])
  const uniqueTypes = useMemo(() => [...new Set(zippersList.map(z => z.type))], [zippersList])

  const filteredZippers = useMemo(() => {
    return zippersList.filter(z => {
      const matchesSearch =
        z.color.toLowerCase().includes(search.toLowerCase()) ||
        z.type.toLowerCase().includes(search.toLowerCase()) ||
        z.id.toString().includes(search)

      const matchesColor = colorFilter ? z.color === colorFilter : true
      const matchesType = typeFilter ? z.type === typeFilter : true

      return matchesSearch && matchesColor && matchesType
    })
  }, [zippersList, search, colorFilter, typeFilter])

  return (
    <div className="space-y-4">
      {/* Панель поиска и фильтров */}
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

        {/* Фильтр по цвету */}
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

        {/* Фильтр по типу */}
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

         <Button
          variant="outline"
          onClick={() => {
            setSearch("")
            setColorFilter("")
            setTypeFilter("")
          }}
        >
          Очистить фильтры
        </Button>

        <div className="ml-auto">
          <ZippersCreateModal onSubmit={handleNew}>
            <Button variant="yellow" className="rounded-lg">
              Добавить
            </Button>
          </ZippersCreateModal>
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
            {filteredZippers.map((zipper, index) => {
              const latestInvoice = zipper.invoices?.reduce<InvoiceList | null>(
                (latest, curr) =>
                  !latest || new Date(curr.createdAt) > new Date(latest.createdAt)
                    ? curr
                    : latest,
                null
              )
              return(
              <TableRow key={zipper.id} className="transition-colors hover:bg-muted/40 even:bg-muted/20">
                <TableCell className="font-medium text-muted-foreground">{index + 1}</TableCell>
                <TableCell className="font-medium">{zipper.color}</TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">{zipper.type}</TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">
                  {materialConsumptions && (
                    <Badge>
                      {(
                        (zipper.invoices?.reduce(
                          (sum, item) => sum + (item.qty ?? 0),
                          0
                        ) ?? 0)
                        -
                        materialConsumptions
                          .filter(i => i.material_id === zipper.id)
                          .reduce(
                            (sum, item) => sum + (Number(item.qty) || 0),
                            0
                          )
                      )}
                      {zipper.unit}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">
                    <Badge variant="outline">
                        {latestInvoice?.price ?? "---"} тг.
                    </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <UpdateQtyModal id={zipper.id} type="zippers" onSubmit={handleQtyUpdate}>
                    <Button size="icon" variant="ghost"><PlusSquare className="h-4 w-4" /></Button>
                  </UpdateQtyModal>

                  <ViewInvoicesList data={zipper.invoices || []}>
                    <Button size="icon" variant="ghost"><Info className="h-4 w-4" /></Button>
                  </ViewInvoicesList>

                  <ViewConsumptionsList material_id={zipper.id}>
                    <Button size="icon" variant="ghost"><Calendar className="h-4 w-4" /></Button>
                  </ViewConsumptionsList>

                  <ZippersUpdateModal
                    id={zipper.id} color={zipper.color} type={zipper.type} unit={zipper.unit}
                    onSubmit={handleUpdate}
                  >
                    <Button size="icon" variant="ghost"><Edit className="h-4 w-4" /></Button>
                  </ZippersUpdateModal>

                  <ZippersRemoveModal id={zipper.id} onSubmit={handleDelete}>
                    <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </ZippersRemoveModal>
                </TableCell>
              </TableRow>
            )})}

            {filteredZippers.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
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
