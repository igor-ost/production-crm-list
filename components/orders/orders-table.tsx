"use client"

import { Eye, Trash2, Search, Edit3 } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Customers } from "../customers/customers-table"
import { Templates } from "../templates/templates-table"
import OrdersRemoveModal from "./orders-remove-modal"
import OrdersUpdateModal from "./orders-update-modal"
import OrdersCreateModal from "./orders-create-modal"
import { MaterialsTableProps } from "../materials/materials-table"
import { TemplateItems } from "../templates/templates-add-items-modal"
import OrdersViewModal from "./orders-view-modal"
import { Journal } from "../journal/journal-table"
import { Staff } from "../staff/staff-table"
import { Photos } from "./orders-view-photo"
import { staffsStore } from "@/store/staff-store"
import { ordersStore } from "@/store/order-store"

export interface OrderStaffs {
  id:string;
  order_id:string;
  staff_id:string;
  user:Staff,
}

export interface Orders {
  id: string
  order_number:string;
  size: string;
  status: "new" | "in-progress" | "completed",
  quantity: number;
  buttons: number;
  sewing_price:number;
  cutting_price:number;
  notes: string;
  deadline: string;
  customer: Customers;
  template: Templates;
  materials?: TemplateItems[]
  journal?: Journal[]
  photos?: Photos[]
  staffs?: OrderStaffs[] 
}

export const statusLabels: Record<Orders["status"], string> = {
  new: "Новый",
  "in-progress": "В работе",
  completed: "Готов",
}

export const statusColors: Record<Orders["status"], string> = {
  new: "bg-blue-300/20 text-blue-500 border-transparent",
  "in-progress": "bg-yellow-300/20 text-yellow-500 border-transparent",
  completed: "bg-green-300/20 text-green-500 border-transparent",
}

interface OrdersTableProps {
  orders: Orders[]
  templates: Templates[]
  customers: Customers[]
  staff: Staff[]
  materials: MaterialsTableProps
}

export function OrdersTable({ orders,templates,customers,materials,staff }: OrdersTableProps) {
  const { setStaff,staff:staffList } = staffsStore();
  const { setOrders, orders: orderList } = ordersStore()
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<"all" | Orders["status"]>("all")
  const handleDelete = (id:string) => {
    const update = orderList.filter(i => i.id != id)
    setOrders(update)
  }
  const handleUpdate = (id: string, size:string, status:"new" | "in-progress" | "completed",sewing_price:number,cutting_price:number,buttons:number,quantity:number,notes:string,deadline:string) => {
    const newOrders = orderList.map(item =>
        item.id === id
          ? { ...item, size, status, sewing_price, cutting_price, buttons, quantity, notes, deadline }
          : item
      );

    setOrders(newOrders);
  }

  const handleCreate = (id:string,response:Orders)=>{
    const updated: Orders = {
      id:id,
      order_number: response.order_number,
      size: response.size,
      status: response.status,
      quantity: response.quantity,
      buttons: response.buttons,
      cutting_price: response.cutting_price,
      sewing_price: response.sewing_price,
      notes: response.notes,
      deadline: response.deadline,
      customer: response.customer,
      template: response.template,
      materials: response.materials
    }
    const newOrders = [...orderList, updated];
    setOrders(newOrders);
  }

  const filteredOrders = useMemo(() => {
    return orderList.filter((order) => {
      const matchesSearch =
        order.order_number.toLowerCase().includes(search.toLowerCase()) ||
        order.size.toLowerCase().includes(search.toLowerCase()) ||
        order.status.toLowerCase().includes(search.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(search.toLowerCase()) ||
        order.template.name.toLowerCase().includes(search.toLowerCase()) ||
        order.id.toString().includes(search)

      const matchesStatus = status === "all" || order.status === status

      return matchesSearch && matchesStatus
    })
  }, [orderList, search, status])

  useEffect(()=>{
    setStaff(staff)
  },[staff])

  useEffect(()=>{
    setOrders(orders)
  },[orders])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-3 rounded-lg border p-4 bg-white">
        <div className="flex gap-3">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" />
            <Input
              placeholder="Поиск"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={status} onValueChange={(v) => setStatus(v as any)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Статус" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="new">Новый</SelectItem>
              <SelectItem value="in-progress">В работе</SelectItem>
              <SelectItem value="completed">Готов</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <OrdersCreateModal materials={materials} templates={templates} customers={customers} onSubmit={handleCreate}>
            <Button variant="yellow">Создать новый заказ</Button>
        </OrdersCreateModal>
      </div>

      {/* Таблица */}
      <div className="rounded-lg border border-black/20 shadow-xl backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-black/20">
              <TableHead>#</TableHead>
              <TableHead>№</TableHead>
              <TableHead>Изделие</TableHead>
              <TableHead>Заказчик</TableHead>
              <TableHead>Срок Исп.</TableHead>
              <TableHead>Размер</TableHead>
              <TableHead>Кол-во</TableHead>
              <TableHead>Пошив</TableHead>
              <TableHead>Крой</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="text-center">Действия</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredOrders.map((order,index) => (
              <TableRow key={order.id} className="hover:bg-black/5">
              <TableCell className="font-medium text-muted-foreground">
                {index + 1}
              </TableCell>
                <TableCell>{order.order_number}</TableCell>
               <TableCell className="font-bold text-xs text-black">{order.template.name}</TableCell>
                <TableCell className="font-bold text-xs text-black">{order.customer.name}</TableCell>
                <TableCell className="font-bold text-xs text-black">{order.deadline ? order.deadline : "---"}</TableCell>
                <TableCell>
                  <Badge>{order.size}</Badge>
                </TableCell>
                <TableCell>
                  <div className="gap-2 flex">
                    <Badge variant="outline">{order.quantity}шт.</Badge>
                    <Badge variant="outline">{order.buttons}п.</Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="fabrics">{order.sewing_price}тг.</Badge>
                </TableCell>
               <TableCell>
                  <Badge variant="fabrics">{order.cutting_price}тг.</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={`${statusColors[order.status]} border`}>
                    {statusLabels[order.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <OrdersViewModal photos={order.photos || []} staff={staffList} order={order} materials={materials}>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {}}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </OrdersViewModal>
                    <OrdersUpdateModal 
                    size={order.size}
                    sewing_price={order.sewing_price}
                    cutting_price={order.cutting_price}
                    buttons={order.buttons}
                    quantity={order.quantity}
                    status={order.status} 
                    notes={order.notes} 
                    deadline={order.deadline ? order.deadline : ""}
                    onSubmit={handleUpdate} id={order.id}>
                      <Button
                        size="sm"
                        variant="ghost"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    </OrdersUpdateModal>
                    <OrdersRemoveModal
                        id={order.id}
                        onSubmit={handleDelete}
                    >
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                    </OrdersRemoveModal>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {filteredOrders.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={11}
                  className="py-8 text-center text-black/50"
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
