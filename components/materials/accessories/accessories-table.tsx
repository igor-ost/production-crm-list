"use client"

import { Trash2, Search, Edit, PlusSquare, Info } from "lucide-react"
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
import AccessoriesRemoveModal from "./accessories-remove-modal"
import AccessoriesUpdateModal from "./accessories-update-modal"
import AccessoriesCreateModal from "./accessories-create-modal"
import UpdateQtyModal from "../update-qty-materials"
import { InvoiceList } from "../materials-table"
import { ViewInvoicesList } from "../view-invoices-list"

export interface Accessories {
  id: string;
  name: string;
  unit: string;
  price: number;
  invoices?: InvoiceList[]
}

interface AccessoriesTableProps {
  accessoriesList: Accessories[]
  setAccessoriesList: React.Dispatch<SetStateAction<Accessories[]>>
}

export function AccessoriesTable({ accessoriesList,setAccessoriesList }: AccessoriesTableProps) {
  const [search, setSearch] = useState("")

  const handleNew = (id:string,name:string,unit:string,price:number) => {
    const updated = {
      id:id,
      name:name,
      unit:unit,
      price,
    }
    setAccessoriesList((prev) => [...prev, updated]);
  }

  const handleDelete = (id:string) => {
    const updated = accessoriesList.filter(item => item.id != id)
    setAccessoriesList(updated)
  }
  const handleQtyUpdate = (id: string, newInvoice: InvoiceList) => {
    setAccessoriesList(prev =>
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
  const handleUpdate = (id:string,name:string,unit:string,price:number)=>{
    setAccessoriesList((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, name,unit,price }
          : item
      )
    );
  }

  const filteredAccessories = useMemo(() => {
    return accessoriesList.filter((zipper) => {
      const matchesSearch =
        zipper.name.toLowerCase().includes(search.toLowerCase()) ||
        zipper.id.toString().includes(search)


      return matchesSearch 
    })
  }, [accessoriesList, search])

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

    <div className="ml-auto">
      <AccessoriesCreateModal onSubmit={handleNew}>
        <Button variant="yellow" className="rounded-lg">
          Добавить
        </Button>
      </AccessoriesCreateModal>
    </div>
  </div>

  {/* Таблица */}
  <div className="overflow-hidden rounded-xl border bg-background/60 shadow-sm backdrop-blur">
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50">
          <TableHead className="w-[80px]">#</TableHead>
          <TableHead>Название</TableHead>
          <TableHead>Кол-во</TableHead>
          <TableHead>Цена</TableHead>
          <TableHead className="text-right px-4">Действия</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {filteredAccessories.map((accessories, index) => (
          <TableRow
            key={accessories.id}
            className="transition-colors hover:bg-muted/40 even:bg-muted/20"
          >
            <TableCell className="font-medium text-muted-foreground">
              {index + 1}
            </TableCell>

            <TableCell className="font-medium">
              {accessories.name}
            </TableCell>

            <TableCell className="font-mono text-sm text-muted-foreground">
              <Badge>
                {accessories.invoices?.reduce((sum, item) => sum + (item.qty), 0) || 0}{accessories.unit}
              </Badge>
            </TableCell>

            <TableCell className="font-mono text-sm text-muted-foreground">
              <Badge variant="outline">
                {accessories.price} тг.
              </Badge>
            </TableCell>

            <TableCell className="text-right">
                  <UpdateQtyModal
                    id={accessories.id}
                    type="accessories"
                    onSubmit={handleQtyUpdate}
                  >
                  <Button size="icon" variant="ghost">
                    <PlusSquare className="h-4 w-4" />
                  </Button>
                </UpdateQtyModal>

                <ViewInvoicesList data={accessories.invoices || []}>
                  <Button size="icon" variant="ghost">
                    <Info className="h-4 w-4" />
                  </Button>
                </ViewInvoicesList>

                <AccessoriesUpdateModal
                  id={accessories.id}
                  name={accessories.name}
                  unit={accessories.unit}
                  price={accessories.price}
                  onSubmit={handleUpdate}
                >
                  <Button size="icon" variant="ghost">
                    <Edit className="h-4 w-4" />
                  </Button>
                </AccessoriesUpdateModal>

                <AccessoriesRemoveModal
                  id={accessories.id}
                  onSubmit={handleDelete}
                >
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AccessoriesRemoveModal>
            </TableCell>
          </TableRow>
        ))}

        {filteredAccessories.length === 0 && (
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
