"use client"

import { Trash2, Search, Edit } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

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

export interface Zippers {
  id: string;
  color: string;
  type: string;
  unit: string;
  qty: number;
  price: number;
}

interface ZippersTableProps {
  zippers: Zippers[]
}

export function ZippersTable({ zippers }: ZippersTableProps) {
  const [search, setSearch] = useState("")
  const [zippersList,setZippersList] = useState(zippers)

  const handleNew = (id:string,color:string,type:string,unit:string,qty:number,price:number) => {
    const updated = {
      id:id,
      color:color,
      type:type,
      unit:unit,
      qty:qty,
      price,
    }
    setZippersList((prev) => [...prev, updated]);
  }

  const handleDelete = (id:string) => {
    const updated = zippersList.filter(item => item.id != id)
    setZippersList(updated)
  }
  const handleUpdate = (id:string,color:string,type:string,unit:string,qty:number,price:number)=>{
    setZippersList((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, color, type,unit,qty,price }
          : item
      )
    );
  }

  const filteredZippers = useMemo(() => {
    return zippersList.filter((zipper) => {
      const matchesSearch =
        zipper.color.toLowerCase().includes(search.toLowerCase()) ||
        zipper.type.toLowerCase().includes(search.toLowerCase()) ||
        zipper.id.toString().includes(search)


      return matchesSearch 
    })
  }, [zippersList, search])

  useEffect(() => {
      setZippersList(zippers);
   }, [zippers]);

  return (
<div className="space-y-4">
  <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-background/60 p-4 shadow-sm backdrop-blur">
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
      <ZippersCreateModal onSubmit={handleNew}>
        <Button className="rounded-lg">
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
        {filteredZippers.map((zipper, index) => (
          <TableRow
            key={zipper.id}
            className="transition-colors hover:bg-muted/40 even:bg-muted/20"
          >
            <TableCell className="font-medium text-muted-foreground">
              {index + 1}
            </TableCell>

            <TableCell className="font-medium">
              {zipper.color}
            </TableCell>

            <TableCell className="font-mono text-sm text-muted-foreground">
              {zipper.type}
            </TableCell>

            <TableCell className="font-mono text-sm text-muted-foreground">
              <Badge>
                {zipper.qty} {zipper.unit}
              </Badge>
            </TableCell>

            <TableCell className="font-mono text-sm text-muted-foreground">
              <Badge variant="outline">
                {zipper.price} тг.
              </Badge>
            </TableCell>

            <TableCell className="text-right">
                <ZippersUpdateModal
                  id={zipper.id}
                  color={zipper.color}
                  type={zipper.type}
                  unit={zipper.unit}
                  qty={zipper.qty}
                  price={zipper.price}
                  onSubmit={handleUpdate}
                >
                  <Button size="icon" variant="ghost">
                    <Edit className="h-4 w-4" />
                  </Button>
                </ZippersUpdateModal>

                <ZippersRemoveModal
                  id={zipper.id}
                  onSubmit={handleDelete}
                >
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </ZippersRemoveModal>
            </TableCell>
          </TableRow>
        ))}

        {filteredZippers.length === 0 && (
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
