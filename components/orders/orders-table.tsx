"use client"

import { Eye, Trash2, Search, Edit3, Calendar } from "lucide-react"
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
import { OrderConsumptionsList } from "./order-consumptions-list"
import { MaterialConsumptions, materialConsumptionsStore } from "@/store/material-consumptions"

export interface OrderStaffs {
  id:string;
  qty:number;
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
  buttonsPrice:number;
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
  materials: MaterialsTableProps,
  material_consumptions:MaterialConsumptions[]
}

export function OrdersTable({ orders,templates,customers,materials,staff,material_consumptions }: OrdersTableProps) {
  const {setMaterialConsumptions} = materialConsumptionsStore()
  const { setStaff,staff:staffList } = staffsStore();
  const { setOrders, orders: orderList } = ordersStore()
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<"all" | Orders["status"]>("all")
  const handleDelete = (id:string) => {
    const update = orderList.filter(i => i.id != id)
    setOrders(update)
  }
  const handleUpdate = (id: string, size:string, status:"new" | "in-progress" | "completed",sewing_price:number,cutting_price:number,buttons:number,quantity:number,notes:string,deadline:string,customer:Customers,template:Templates) => {
    const newOrders = orderList.map(item =>
        item.id === id
          ? { ...item, size, status, sewing_price, cutting_price, buttons, quantity, notes, deadline,customer,template }
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
      buttonsPrice: response.buttonsPrice,
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
  useEffect(()=>{
    if(material_consumptions){
      setMaterialConsumptions(material_consumptions)
    }
  },[material_consumptions])

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
            <SelectTrigger className="w-45">
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
<div className="overflow-hidden rounded-xl border bg-white shadow-sm backdrop-blur">
  <div className="overflow-x-auto max-w-full max-h-175">
    <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-black/20">
              <th className="text-xs font-medium text-left p-3 border-b sticky top-0 left-0 bg-amber-300 z-10 min-w-12.5 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">#</th>
              <th className="text-xs font-medium text-left p-3 border-b sticky top-0 left-0 bg-amber-300 z-10 min-w-12.5 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">№</th>
              <th className="text-xs font-medium text-left p-3 border-b sticky top-0 left-0 bg-amber-300 z-10 min-w-12.5 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Изделие</th>
              <th className="text-xs font-medium text-left p-3 border-b sticky top-0 left-0 bg-amber-300 z-10 min-w-12.5 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Заказчик</th>
              <th className="text-xs font-medium text-left p-3 border-b sticky top-0 left-0 bg-amber-300 z-10 min-w-12.5 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Срок Исп.</th>
              <th className="text-xs font-medium text-left p-3 border-b sticky top-0 left-0 bg-amber-300 z-10 min-w-12.5 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Размер</th>
              <th className="text-xs font-medium text-left p-3 border-b sticky top-0 left-0 bg-amber-300 z-10 min-w-12.5 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Кол-во</th>
              <th className="text-xs font-medium text-left p-3 border-b sticky top-0 left-0 bg-amber-300 z-10 min-w-12.5 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Пошив</th>
               <th className="text-xs font-medium text-left p-3 border-b sticky top-0 left-0 bg-amber-300 z-10 min-w-12.5 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Крой</th>
               <th className="text-xs font-medium text-left p-3 border-b sticky top-0 left-0 bg-amber-300 z-10 min-w-12.5 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Блочки-Кнопки</th>
               <th className="text-xs font-medium text-left p-3 border-b sticky top-0 left-0 bg-amber-300 z-10 min-w-12.5 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Статус</th>
              <th className="text-xs font-medium p-3 border-b sticky top-0 left-0 bg-amber-300 z-10 min-w-12.5 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] text-center">Действия</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order,index) => (
              <tr key={order.id} className="hover:bg-black/5">
              <td className="font-medium text-muted-foreground">
                {index + 1}
              </td>
                <td>{order.order_number}</td>
               <td className="font-bold text-xs text-black">{order.template.name}</td>
                <td className="font-bold text-xs text-black">{order.customer.name}</td>
                <td className="font-bold text-xs text-black">{order.deadline ? order.deadline : "---"}</td>
                <td>
                  <Badge>{order.size}</Badge>
                </td>
                <td>
                  <div className="gap-2 flex">
                    <Badge variant="outline">{order.quantity}шт.</Badge>
                    <Badge variant="outline">{order.buttons}п.</Badge>
                  </div>
                </td>
                <td>
                  <Badge variant="fabrics">{order.sewing_price}тг.</Badge>
                </td>
               <td>
                  <Badge variant="fabrics">{order.cutting_price}тг.</Badge>
                </td>
                <td>
                  <Badge variant="fabrics">{order.buttonsPrice}тг.</Badge>
                </td>
                <td>
                  <Badge className={`${statusColors[order.status]} border`}>
                    {statusLabels[order.status]}
                  </Badge>
                </td>
                <td>
                  <div className="flex justify-center gap-2">
                    <OrderConsumptionsList materials={materials} order_id={order.id}>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {}}
                      >
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </OrderConsumptionsList>
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
                    customer={order.customer.id}
                    customerList={customers}
                    size={order.size}
                    sewing_price={order.sewing_price}
                    cutting_price={order.cutting_price}
                    buttons={order.buttons}
                    quantity={order.quantity}
                    status={order.status} 
                    template_id={order.template.id}
                    templates={templates}
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
                </td>
              </tr>
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
          </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
