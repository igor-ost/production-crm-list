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
import FabricsCreateModal from "./fabric-create-modal"
import FabricsUpdateModal from "./fabric-update-modal"
import FabricsRemoveModal from "./fabric-remove-modal"

export interface Fabrics {
  id: string;
  name: string;
  color: string;
  type: string;
  unit: string;
  qty: number;
  price: number;
}

interface FabricsTableProps {
  fabrics: Fabrics[]
}

export function FabricsTable({ fabrics }: FabricsTableProps) {
  const [search, setSearch] = useState("")
  const [fabricsList,setFabricsList] = useState(fabrics)

  const handleNew = (id:string,name:string,color:string,type:string,unit:string,qty:number,price:number) => {
    const updated = {
      id:id,
      name:name,
      color:color,
      type:type,
      unit:unit,
      qty:qty,
      price,
    }
    setFabricsList((prev) => [...prev, updated]);
  }

  const handleDelete = (id:string) => {
    const updated = fabricsList.filter(item => item.id != id)
    setFabricsList(updated)
  }
  const handleUpdate = (id:string,name:string,color:string,type:string,unit:string,qty:number,price:number)=>{
    setFabricsList((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item , name, color, type,unit,qty,price }
          : item
      )
    );
  }

  const filteredFabrics = useMemo(() => {
    return fabricsList.filter((fabric) => {
      const matchesSearch =
        fabric.name.toLowerCase().includes(search.toLowerCase()) ||
        fabric.color.toLowerCase().includes(search.toLowerCase()) ||
        fabric.type.toLowerCase().includes(search.toLowerCase()) ||
        fabric.id.toString().includes(search)


      return matchesSearch 
    })
  }, [fabricsList, search])

  useEffect(() => {
      setFabricsList(fabrics);
   }, [fabrics]);

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
      <FabricsCreateModal onSubmit={handleNew}>
        <Button className="rounded-lg">
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
          <TableHead>Тип</TableHead>
          <TableHead>Кол-во</TableHead>
          <TableHead>Цена</TableHead>
          <TableHead className="text-right px-4">Действия</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {filteredFabrics.map((fabric, index) => (
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
              {fabric.type}
            </TableCell>

            <TableCell className="font-mono text-sm text-muted-foreground">
              <Badge>
                {fabric.qty} {fabric.unit}
              </Badge>
            </TableCell>

            <TableCell className="font-mono text-sm text-muted-foreground">
              <Badge variant="outline">
                {fabric.price} тг.
              </Badge>
            </TableCell>

            <TableCell className="text-right">
                <FabricsUpdateModal
                  id={fabric.id}
                  name={fabric.name}
                  color={fabric.color}
                  type={fabric.type}
                  unit={fabric.unit}
                  qty={fabric.qty}
                  price={fabric.price}
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
        ))}

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
