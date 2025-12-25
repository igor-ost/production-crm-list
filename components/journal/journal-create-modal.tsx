"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Api } from "@/services/api-clients";
import SelectWorkType from "../ui/select-worktype";
import SelectOrders from "../ui/select-orders";
import { Orders } from "../orders/orders-table";
import { Staff } from "../staff/staff-table";
import SelectStaff from "../ui/select-staff";


export default function JournalCreateModal({children,staff,orders,onSubmit,order_id = ""}:{order_id?:string,staff:Staff[],orders:Orders[],children:React.ReactNode,onSubmit:(id:string,order:Orders,user:Staff,type:string,quantity:number)=>void}) {
  const [quantity, setQuantity] = useState(0);
  const [type, setType] = useState("");
  const [user, setUser] = useState("");
  const [order, setOrder] = useState(order_id);
  const [error,setError] = useState("");
  const [isLoading,setIsLoading] = useState(false)
  const [open,setOpen] = useState(false)

  const handleSubmit = async () => {
    setIsLoading(true)
    const journal = {
      type,
      quantity,
      order_id: order,
      user_id: user
    };

    if(type == ""){
        setError("Поле (Тип) обязательно для заполнения.")
        setIsLoading(false)
        return
    }
    if(quantity == 0){
        setError("Поле (Кол-во) обязательно для заполнения.")
        setIsLoading(false)
        return
    }
    if(order == ""){
        setError("Поле (Заказ) обязательно для заполнения.")
        setIsLoading(false)
        return
    }
    if(user == ""){
        setError("Поле (Пользователь) обязательно для заполнения.")
        setIsLoading(false)
        return
    }

    try {
        const response = await Api.journal.create(journal)
        if(response.id){
            setQuantity(0);
            setType("");
            setUser("");
            setOrder("");
            onSubmit(response.id,response.order,response.user,type,quantity)
            setIsLoading(false)
            setOpen(false)
        }
    } catch (error:unknown) {
        setIsLoading(false)
        setError(error instanceof Error ? error.message : "Произошла ошибка")
    }

  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Новая запись</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="order">Заказ</Label>
            <SelectOrders orders={orders} value={order} onValueChange={setOrder} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="order">Тип Работ</Label>
            <SelectWorkType value={type} onValueChange={setType}/>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="order">Пользователь</Label>
            <SelectStaff value={user} onValueChange={setUser} staff={staff}/>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="quantity">Кол-во</Label>
            <Input
              id="quantity"
              placeholder="Введите название"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>



        {error && (
            <div className="p-2">
              <p className="text-red-600 font-bold text-sm">{error}</p>
            </div>
        )}
        </div>

        <DialogFooter>
          <Button disabled={isLoading} onClick={handleSubmit}>{!isLoading ? "Создать" : "Создание..."}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
