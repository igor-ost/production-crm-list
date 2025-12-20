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
import SelectUnit from "@/components/ui/select-unit";


export default function ThreadsUpdateModal({children,onSubmit,color,type,unit,qty,price,id}:{children:React.ReactNode,id:string,color:string,type:string,unit:string,qty:number,price:number,onSubmit:(id:string,color:string,type:string,unit:string,qty:number,price:number)=>void}) {
  const [newcolor, setColor] = useState(color);
  const [newtype, setType] = useState(type);
  const [newunit, setUnit] = useState(unit);
  const [newqty, setQty] = useState(qty);
  const [newprice, setPrice] = useState(price);
  const [error,setError] = useState("");
  const [isLoading,setIsLoading] = useState(false)
  const [open,setOpen] = useState(false)

  const handleSubmit = async () => {
    setIsLoading(true)
    const thread = {
      color:newcolor,
      type:newtype,
      unit:newunit,
      qty:newqty,
      price:newprice
    };

    if(newcolor == ""){
        setError("Поле (Цвет) обязательно для заполнения.")
        setIsLoading(false)
        return
    }
    if(newtype == ""){
        setError("Поле (Тип) обязательно для заполнения.")
        setIsLoading(false)
        return
    }
    if(newunit == ""){
        setError("Поле (Ед. Изм.) обязательно для заполнения.")
        setIsLoading(false)
        return
    }


    try {
        const response = await Api.threads.update(id,thread)
        if(response.id){
            onSubmit(id,newcolor,newtype,newunit,newqty,newprice)
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
          <DialogTitle>Редактировать материал - Нитки</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="color">Цвет</Label>
            <Input
              id="color"
              placeholder="Введите цвет"
              value={newcolor}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="type">Тип</Label>
            <Input
              id="type"
              placeholder="Введите Тип"
              value={newtype}
              onChange={(e) => setType(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="unit">Ед. Изм.</Label>
            <SelectUnit value={newunit} onValueChange={setUnit}/>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="qty">Кол-во</Label>
            <Input
              id="qty"
              placeholder="Введите Кол-во"
              type="number"
              value={newqty}
              onChange={(e) => setQty(Number(e.target.value))}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="price">Цена</Label>
            <Input
              id="price"
              placeholder="Введите цену"
              type="price"
              value={newprice}
              onChange={(e) => setPrice(Number(e.target.value))}
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
