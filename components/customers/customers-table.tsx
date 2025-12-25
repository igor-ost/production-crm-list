"use client"

import { Trash2, Search, Edit, Eye } from "lucide-react"
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
import CustomerCreateModal from "./customer-create-modal"
import { CustomerRemoveModal } from "./customer-remove-modal"
import CustomerUpdateModal from "./customer-update-modal"
import CustomersViewModal from "./customers-view-modal"
import { Orders } from "../orders/orders-table"

export interface Customers {
  id: string
  name: string
  bin: string
  orders?: Orders[]
}

interface CustomersTableProps {
  customers: Customers[]
}

export function CustomersTable({ customers }: CustomersTableProps) {
  const [search, setSearch] = useState("")
  const [customerList,setCustomerList] = useState(customers)

  const handleNewCustomer = (name:string,bin:string,id:string) => {
    const updated = {
      name:name,
      bin:bin,
      id:id
    }
    setCustomerList((prev) => [...prev, updated]);
  }

  const handleDeleteCustomer = (id:string) => {
    const updated = customerList.filter(item => item.id != id)
    setCustomerList(updated)
  }
  const handleUpdateCustomer = (id:string,name:string,bin:string)=>{
    setCustomerList((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, name, bin }
          : item
      )
    );
  }

  const filteredCustomer = useMemo(() => {
    return customerList.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(search.toLowerCase()) ||
        customer.bin.toLowerCase().includes(search.toLowerCase()) ||
        customer.id.toString().includes(search)


      return matchesSearch 
    })
  }, [customerList, search])

  useEffect(() => {
      setCustomerList(customers);
   }, [customers]);

  return (
<div className="space-y-4">
  {/* Верхняя панель */}
  <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-background/60 p-4 shadow-sm backdrop-blur">
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Поиск заказчика"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="pl-9"
      />
    </div>

    <div className="ml-auto">
      <CustomerCreateModal onSubmit={handleNewCustomer}>
        <Button className="rounded-lg">
          Создать заказчика
        </Button>
      </CustomerCreateModal>
    </div>
  </div>

  {/* Таблица */}
  <div className="overflow-hidden rounded-xl border bg-background/60 shadow-sm backdrop-blur">
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50">
          <TableHead className="w-[80px]">#</TableHead>
          <TableHead>Название</TableHead>
          <TableHead>БИН</TableHead>
          <TableHead className="text-right px-4">Действия</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {filteredCustomer.map((customer, index) => (
          <TableRow
            key={customer.id}
            className="transition-colors hover:bg-muted/40 even:bg-muted/20"
          >
            <TableCell className="font-medium text-muted-foreground">
              {index + 1}
            </TableCell>

            <TableCell className="font-medium">
              {customer.name}
            </TableCell>

            <TableCell className="font-mono text-sm text-muted-foreground">
              {customer.bin}
            </TableCell>

            <TableCell className="text-right">
               <div className="flex justify-end gap-2">
                <CustomersViewModal
                  orders={customer?.orders || []}
                >
                  <Button size="icon" variant="ghost">
                    <Eye className="h-4 w-4" />
                  </Button>
                </CustomersViewModal>

                <CustomerUpdateModal
                  id={customer.id}
                  name={customer.name}
                  bin={customer.bin}
                  onSubmit={handleUpdateCustomer}
                >
                  <Button size="icon" variant="ghost">
                    <Edit className="h-4 w-4" />
                  </Button>
                </CustomerUpdateModal>

                <CustomerRemoveModal
                  id={customer.id}
                  onSubmit={handleDeleteCustomer}
                >
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CustomerRemoveModal>
                </div>
            </TableCell>
          </TableRow>
        ))}

        {filteredCustomer.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={4}
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
