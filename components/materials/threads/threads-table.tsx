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
import ThreadsCreateModal from "./thread-create-modal"
import ThreadsUpdateModal from "./thread-update-modal"
import ThreadsRemoveModal from "./thread-remove-modal"
import UpdateQtyModal from "../update-qty-materials"
import { InvoiceList } from "../materials-table"
import { ViewInvoicesList } from "../view-invoices-list"

export interface Threads {
  id: string;
  color: string;
  type: string;
  unit: string;
  price: number;
  invoices?: InvoiceList[]
}

interface ThreadsTableProps {
  threadsList: Threads[]
  setThreadsList: React.Dispatch<SetStateAction<Threads[]>>
}

export function ThreadsTable({ threadsList, setThreadsList}: ThreadsTableProps) {
  const [search, setSearch] = useState("")

  const handleNew = (id:string,color:string,type:string,unit:string,price:number) => {
    const updated = {
      id:id,
      color:color,
      type:type,
      unit:unit,
      price,
    }
    setThreadsList((prev) => [...prev, updated]);
  }

  const handleDelete = (id:string) => {
    const updated = threadsList.filter(item => item.id != id)
    setThreadsList(updated)
  }

  const handleQtyUpdate = (id: string, newInvoice: InvoiceList) => {
    setThreadsList(prev =>
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

  const handleUpdate = (id:string,color:string,type:string,unit:string,price:number)=>{
    setThreadsList((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, color, type,unit,price }
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
      <ThreadsCreateModal onSubmit={handleNew}>
        <Button variant="yellow" className="rounded-lg">
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
                 {thread.invoices?.reduce((sum, item) => sum + (item.qty), 0) || 0}{thread.unit}
              </Badge>
            </TableCell>

            <TableCell className="font-mono text-sm text-muted-foreground">
              <Badge variant="outline">
                {thread.price} тг.
              </Badge>
            </TableCell>

            <TableCell className="text-right">
                <UpdateQtyModal
                    id={thread.id}
                    type="threads"
                    onSubmit={handleQtyUpdate}
                  >
                  <Button size="icon" variant="ghost">
                    <PlusSquare className="h-4 w-4" />
                  </Button>
                </UpdateQtyModal>

                <ViewInvoicesList data={thread.invoices || []}>
                  <Button size="icon" variant="ghost">
                    <Info className="h-4 w-4" />
                  </Button>
                </ViewInvoicesList>

                <ThreadsUpdateModal
                  id={thread.id}
                  color={thread.color}
                  type={thread.type}
                  unit={thread.unit}
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
