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
import ThreadsCreateModal from "./thread-create-modal"
import ThreadsUpdateModal from "./thread-update-modal"
import ThreadsRemoveModal from "./thread-remove-modal"

export interface Threads {
  id: string;
  color: string;
  type: string;
  unit: string;
  qty: number;
  price: number;
}

interface ThreadsTableProps {
  threads: Threads[]
}

export function ThreadsTable({ threads }: ThreadsTableProps) {
  const [search, setSearch] = useState("")
  const [threadsList,setThreadsList] = useState(threads)

  const handleNew = (id:string,color:string,type:string,unit:string,qty:number,price:number) => {
    const updated = {
      id:id,
      color:color,
      type:type,
      unit:unit,
      qty:qty,
      price,
    }
    setThreadsList((prev) => [...prev, updated]);
  }

  const handleDelete = (id:string) => {
    const updated = threadsList.filter(item => item.id != id)
    setThreadsList(updated)
  }
  const handleUpdate = (id:string,color:string,type:string,unit:string,qty:number,price:number)=>{
    setThreadsList((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, color, type,unit,qty,price }
          : item
      )
    );
  }

  const filteredThreads = useMemo(() => {
    return threadsList.filter((thread) => {
      const matchesSearch =
        thread.color.toLowerCase().includes(search.toLowerCase()) ||
        thread.type.toLowerCase().includes(search.toLowerCase()) ||
        thread.id.toString().includes(search)


      return matchesSearch 
    })
  }, [threadsList, search])

  useEffect(() => {
      setThreadsList(threads);
   }, [threads]);

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
      <ThreadsCreateModal onSubmit={handleNew}>
        <Button className="rounded-lg">
          Добавить
        </Button>
      </ThreadsCreateModal>
    </div>
  </div>

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
        {filteredThreads.map((thread, index) => (
          <TableRow
            key={thread.id}
            className="transition-colors hover:bg-muted/40 even:bg-muted/20"
          >
            <TableCell className="font-medium text-muted-foreground">
              {index + 1}
            </TableCell>

            <TableCell className="font-medium">
              {thread.color}
            </TableCell>

            <TableCell className="font-mono text-sm text-muted-foreground">
              {thread.type}
            </TableCell>

            <TableCell className="font-mono text-sm text-muted-foreground">
              <Badge>
                {thread.qty} {thread.unit}
              </Badge>
            </TableCell>

            <TableCell className="font-mono text-sm text-muted-foreground">
              <Badge variant="outline">
                {thread.price} тг.
              </Badge>
            </TableCell>

            <TableCell className="text-right">
                <ThreadsUpdateModal
                  id={thread.id}
                  color={thread.color}
                  type={thread.type}
                  unit={thread.unit}
                  qty={thread.qty}
                  price={thread.price}
                  onSubmit={handleUpdate}
                >
                  <Button size="icon" variant="ghost">
                    <Edit className="h-4 w-4" />
                  </Button>
                </ThreadsUpdateModal>

                <ThreadsRemoveModal
                  id={thread.id}
                  onSubmit={handleDelete}
                >
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </ThreadsRemoveModal>
            </TableCell>
          </TableRow>
        ))}

        {filteredThreads.length === 0 && (
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
