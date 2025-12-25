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
import { Orders } from "../orders/orders-table"
import { Staff } from "../staff/staff-table"
import JournalCreateModal from "./journal-create-modal"
import RoleBadge from "../ui/role-badge"
import { JournalRemoveModal } from "./journal-remove-modal"
import JournalUpdateModal from "./journal-update-modal"
import { Badge } from "../ui/badge"

export interface Journal {
  id: string
  type: string
  quantity: number
  order: Orders
  user: Staff
}

interface JournalTableProps {
  journal: Journal[]
  orders: Orders[]
  staff: Staff[]
  order_id?: string
}

export const workTypeLabel = (type: string) => {
    if (type === "sewing") return "Пошив"
    if (type === "cutting") return "Крой"
    if (type === "buttons") return "Пуговницы"  
    return "Неизвестно"
  }

export const workTypeColor = (type: string) => {
    if (type === "sewing") return "bg-purple-100 text-purple-800"
    if (type === "cutting") return "bg-pink-100 text-pink-800"
    if (type === "buttons") return "bg-green-100 text-green-800"  

    return "bg-gray-100 text-gray-800"
  }

export function JournalTable({ journal,orders,staff,order_id }: JournalTableProps) {
  const [search, setSearch] = useState("")
  const [journalList,setJournalList] = useState(journal)
  const handleNew = (id:string,order:Orders,user:Staff,type:string,quantity:number) => {

    const updated = {
      order:order,
      user:user,
      type: type,
      quantity: quantity,
      id:id
    }

    setJournalList((prev) => [...prev, updated]);
  }

  const handleDelete = (id:string) => {
    const updated = journalList.filter(item => item.id != id)
    setJournalList(updated)
  }
  const handleUpdate = (id:string,quantity:number)=>{
    setJournalList((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity }
          : item
      )
    );
  }

  const filteredJournal = useMemo(() => {
    return journalList.filter((journal) => {
      const matchesSearch =
        journal.type.toLowerCase().includes(search.toLowerCase()) ||
        journal.quantity.toString().includes(search.toLowerCase()) ||
        journal.order.order_number.toString().includes(search.toLowerCase()) ||
        journal.user.login.toString().includes(search.toLowerCase()) ||
        journal.id.toString().includes(search)


      return matchesSearch 
    })
  }, [journalList, search])

  useEffect(() => {
      setJournalList(journalList);
   }, [journal]);

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
      <JournalCreateModal order_id={order_id} staff={staff} orders={orders} onSubmit={handleNew}>
        <Button className="rounded-lg">
          Создать запись
        </Button>
      </JournalCreateModal>
    </div>
  </div>

  {/* Таблица */}
  <div className="overflow-hidden rounded-xl border bg-background/60 shadow-sm backdrop-blur">
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50">
          <TableHead className="w-[80px]">#</TableHead>
          <TableHead>Пользователь</TableHead>
          <TableHead>Заказ</TableHead>
          <TableHead>Тип работ</TableHead>
          <TableHead>Кол-во</TableHead>
          <TableHead className="text-right px-4">Действия</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {filteredJournal.map((journal, index) => (
          <TableRow
            key={journal.id}
            className="transition-colors hover:bg-muted/40 even:bg-muted/20"
          >
            <TableCell className="font-medium text-muted-foreground">
              {index + 1}
            </TableCell>

            <TableCell className="font-medium">
              {journal.user.login} <RoleBadge role={journal.user.role}/>
            </TableCell>

            <TableCell className="font-mono text-sm text-muted-foreground">
              {journal.order.order_number}
            </TableCell>

            <TableCell className="font-medium">
              <Badge className={workTypeColor(journal.type)}>{workTypeLabel(journal.type)}</Badge>
            </TableCell>

            <TableCell className="font-medium">
              {journal.quantity}
            </TableCell>

            <TableCell className="text-right">
                <JournalUpdateModal
                  id={journal.id}
                  quantity={journal.quantity}
                  onSubmit={handleUpdate}
                >
                  <Button size="icon" variant="ghost">
                    <Edit className="h-4 w-4" />
                  </Button>
                </JournalUpdateModal>

                <JournalRemoveModal
                  id={journal.id}
                  onSubmit={handleDelete}
                >
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </JournalRemoveModal>
            </TableCell>
          </TableRow>
        ))}

        {filteredJournal.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={6}
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
