"use client"

import { Trash2, Search, Edit, PlusSquare, Info, Calendar } from "lucide-react"
import { SetStateAction, useMemo, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import FabricsCreateModal from "./fabric-create-modal"
import FabricsUpdateModal from "./fabric-update-modal"
import FabricsRemoveModal from "./fabric-remove-modal"
import UpdateQtyModal from "../update-qty-materials"
import { InvoiceList } from "../materials-table"
import { ViewInvoicesList } from "../view-invoices-list"
import { ViewConsumptionsList } from "../view-consumptions-list"
import { materialConsumptionsStore } from "@/store/material-consumptions"
import { Api } from "@/services/api-clients"

export interface Fabrics {
  id: string;
  name: string;
  color: string;
  unit: string;
  invoices?: InvoiceList[]
}

interface FabricsTableProps {
  fabricsList: Fabrics[]
  setFabricsList: React.Dispatch<SetStateAction<Fabrics[]>>
}

export function FabricsTable({ fabricsList, setFabricsList }: FabricsTableProps) {
  const {materialConsumptions} = materialConsumptionsStore()
  const [search, setSearch] = useState("")
  const [colorFilter,setColorFilter] = useState("")

  const handleNew = (id: string, name: string, color: string, unit: string) => {
    const updated = {
      id: id,
      name: name,
      color: color,
      unit: unit,
    }
    setFabricsList((prev) => [...prev, updated]);
  }

  const handleDelete = (id: string) => {
    const updated = fabricsList.filter(item => item.id != id)
    setFabricsList(updated)
  }

  const handleQtyUpdate = (id: string, newInvoice: InvoiceList) => {
    setFabricsList(prev =>
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

  const handleUpdate = (id: string, name: string, color: string, unit: string) => {
    setFabricsList((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, name, color, unit }
          : item
      )
    );
  }

  const handleDeleteInvoice = async (id:string) => {
      try {
        const response = await Api.fabrics.removeInvoice(id);
        if(response){
           setFabricsList((prev) => prev.filter(i=>i.id != id))
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
      await Api.fabrics.updateInvoce(id,data);
    } catch (error) {
      console.log(error)
    }
  }
  
  const uniqueColors = useMemo(() => [...new Set(fabricsList.map(z => z.color))], [fabricsList])

  const filteredFabrics = useMemo(() => {
    return fabricsList.filter(z => {
      const matchesSearch =
        z.name.toLowerCase().includes(search.toLowerCase()) ||
        z.color.toLowerCase().includes(search.toLowerCase()) ||
        z.id.toString().includes(search)

      const matchesColor = colorFilter ? z.color === colorFilter : true

      return matchesSearch && matchesColor
    })
  }, [fabricsList, search, colorFilter])


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


        <Button
          variant="outline"
          onClick={() => {
            setSearch("")
            setColorFilter("")
          }}
        >
          Очистить фильтры
        </Button>

        <div className="ml-auto">
          <FabricsCreateModal onSubmit={handleNew}>
            <Button variant="yellow" className="rounded-lg">
              Добавить
            </Button>
          </FabricsCreateModal>
        </div>
      </div>

      {/* Таблица */}
      <div className="overflow-hidden rounded-xl border bg-background/60 shadow-sm backdrop-blur">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[80px]">#</TableHead>
              <TableHead>Название</TableHead>
              <TableHead>Цвет</TableHead>
              <TableHead>Кол-во</TableHead>
              <TableHead>Цена</TableHead>
              <TableHead className="text-right px-4">Действия</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredFabrics.map((fabric, index) => {
              const latestInvoice = fabric.invoices?.reduce<InvoiceList | null>(
                (latest, curr) =>
                  !latest || new Date(curr.createdAt) > new Date(latest.createdAt)
                    ? curr
                    : latest,
                null
              )
              return(
              <TableRow
                key={fabric.id}
                className="transition-colors hover:bg-muted/40 even:bg-muted/20"
              >
                <TableCell className="font-medium text-muted-foreground">
                  {index + 1}
                </TableCell>

                <TableCell className="font-medium">
                  {fabric.name}
                </TableCell>

                <TableCell className="font-medium">
                  {fabric.color}
                </TableCell>

                <TableCell className="font-mono text-sm text-muted-foreground">
                  {materialConsumptions && (
                    <Badge>
                      {(
                        (fabric.invoices?.reduce(
                          (sum, item) => sum + (item.qty ?? 0),
                          0
                        ) ?? 0)
                        -
                        materialConsumptions
                          .filter(i => i.material_id === fabric.id)
                          .reduce(
                            (sum, item) => sum + (Number(item.qty) || 0),
                            0
                          )
                      )}
                      {fabric.unit}
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
                    name={fabric.color + " " + fabric.name}
                    id={fabric.id}
                    type="fabrics"
                    onSubmit={handleQtyUpdate}
                  >
                    <Button size="icon" variant="ghost">
                      <PlusSquare className="h-4 w-4" />
                    </Button>
                  </UpdateQtyModal>

                  <ViewInvoicesList onDelete={handleDeleteInvoice} onUpdate={handleUpdateInvoice} data={fabric.invoices || []}>
                    <Button size="icon" variant="ghost">
                      <Info className="h-4 w-4" />
                    </Button>
                  </ViewInvoicesList>

                  <ViewConsumptionsList material_id={fabric.id}>
                    <Button size="icon" variant="ghost"><Calendar className="h-4 w-4" /></Button>
                  </ViewConsumptionsList>

                  <FabricsUpdateModal
                    id={fabric.id}
                    name={fabric.name}
                    color={fabric.color}
                    unit={fabric.unit}
                    onSubmit={handleUpdate}
                  >
                    <Button size="icon" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </FabricsUpdateModal>

                  <FabricsRemoveModal
                    id={fabric.id}
                    onSubmit={handleDelete}
                  >
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </FabricsRemoveModal>
                </TableCell>
              </TableRow>
            )})}

            {filteredFabrics.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
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
