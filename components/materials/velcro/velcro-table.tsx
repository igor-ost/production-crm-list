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
import { Badge } from "@/components/ui/badge"
import VelcroCreateModal from "./velcro-create-modal"
import VelcroUpdateModal from "./velcro-update-modal"
import VelcroRemoveModal from "./velcro-remove-modal"


export interface Velcro {
  id: string;
  name: string;
  unit: string;
  qty: number;
  price: number;
}

interface VelcroTableProps {
  velcro: Velcro[]
}

export function VelcroTable({ velcro }: VelcroTableProps) {
  const [search, setSearch] = useState("")
  const [VelcroList,setVelcroList] = useState(velcro)

  const handleNew = (id:string,name:string,unit:string,qty:number,price:number) => {
    const updated = {
      id:id,
      name:name,
      unit:unit,
      qty:qty,
      price,
    }
    setVelcroList((prev) => [...prev, updated]);
  }

  const handleDelete = (id:string) => {
    const updated = VelcroList.filter(item => item.id != id)
    setVelcroList(updated)
  }
  const handleUpdate = (id:string,name:string,unit:string,qty:number,price:number)=>{
    setVelcroList((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, name,unit,qty,price }
          : item
      )
    );
  }

  const filteredVelcro = useMemo(() => {
    return VelcroList.filter((zipper) => {
      const matchesSearch =
        zipper.name.toLowerCase().includes(search.toLowerCase()) ||
        zipper.id.toString().includes(search)


      return matchesSearch 
    })
  }, [VelcroList, search])

  useEffect(() => {
      setVelcroList(velcro);
   }, [velcro]);

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
      <VelcroCreateModal onSubmit={handleNew}>
        <Button className="rounded-lg">
          Добавить
        </Button>
      </VelcroCreateModal>
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
        {filteredVelcro.map((velcro, index) => (
          <TableRow
            key={velcro.id}
            className="transition-colors hover:bg-muted/40 even:bg-muted/20"
          >
            <TableCell className="font-medium text-muted-foreground">
              {index + 1}
            </TableCell>

            <TableCell className="font-medium">
              {velcro.name}
            </TableCell>

            <TableCell className="font-mono text-sm text-muted-foreground">
              <Badge>
                {velcro.qty} {velcro.unit}
              </Badge>
            </TableCell>

            <TableCell className="font-mono text-sm text-muted-foreground">
              <Badge variant="outline">
                {velcro.price} тг.
              </Badge>
            </TableCell>

            <TableCell className="text-right">
                <VelcroUpdateModal
                  id={velcro.id}
                  name={velcro.name}
                  unit={velcro.unit}
                  qty={velcro.qty}
                  price={velcro.price}
                  onSubmit={handleUpdate}
                >
                  <Button size="icon" variant="ghost">
                    <Edit className="h-4 w-4" />
                  </Button>
                </VelcroUpdateModal>

                <VelcroRemoveModal
                  id={velcro.id}
                  onSubmit={handleDelete}
                >
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </VelcroRemoveModal>
            </TableCell>
          </TableRow>
        ))}

        {filteredVelcro.length === 0 && (
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
