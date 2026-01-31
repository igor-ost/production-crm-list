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
import { InvoiceList } from "./materials-table";

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // месяцы с 0
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function UpdateQtyModal({children,onSubmit,id,type}:{children:React.ReactNode,id:string,type:"zippers" | "velcro" | "fabrics" | "threads" | "buttons" | "accessories",onSubmit:(id:string,invoice:InvoiceList)=>void}) {
  const [qty, setQty] = useState(0);
  const [dateArrived, setDateArrived] = useState(new Date());
  const [error,setError] = useState("");
  const [isLoading,setIsLoading] = useState(false)
  const [open,setOpen] = useState(false)

  const handleSubmit = async () => {
    setIsLoading(true)
    const invoice = {
      material_id:id,
      qty:qty,
      dateArrived: new Date(dateArrived)
    };


    try {
        const response = await Api[type].createInvoice(invoice as any)
        if(response){
            onSubmit(id,response)
            setIsLoading(false)
            setOpen(false)
            setQty(0)
            setDateArrived(new Date())
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
          <DialogTitle>Добавить накладную</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="qty">Дата</Label>
            <Input
                id="date"
                type="date"
                value={formatDate(dateArrived)}
                onChange={(e) => setDateArrived(new Date(e.target.value))}
              />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="qty">Кол-во</Label>
            <Input
              id="qty"
              placeholder="Введите Кол-во"
              type="number"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
            />
          </div>

        {error && (
            <div className="p-2">
              <p className="text-red-600 font-bold text-sm">{error}</p>
            </div>
        )}
        </div>

        <DialogFooter>
          <Button disabled={isLoading} onClick={handleSubmit}>{!isLoading ? "Сохранить" : "Сохранение..."}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
