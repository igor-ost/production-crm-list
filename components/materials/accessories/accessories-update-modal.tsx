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


export default function AccessoriesUpdateModal({children,onSubmit,name,unit,qty,price,id}:{children:React.ReactNode,id:string,name:string,unit:string,qty:number,price:number,onSubmit:(id:string,name:string,unit:string,qty:number,price:number)=>void}) {
  const [newname, setName] = useState(name);
  const [newunit, setUnit] = useState(unit);
  const [newqty, setQty] = useState(qty);
  const [newprice, setPrice] = useState(price);
  const [error,setError] = useState("");
  const [isLoading,setIsLoading] = useState(false)
  const [open,setOpen] = useState(false)

  const handleSubmit = async () => {
    setIsLoading(true)
    const accessories = {
      name:newname,
      unit:newunit,
      qty:newqty,
      price:newprice
    };

    if(newname == ""){
        setError("Поле (Название) обязательно для заполнения.")
        setIsLoading(false)
        return
    }
    if(newunit == ""){
        setError("Поле (Ед. Изм.) обязательно для заполнения.")
        setIsLoading(false)
        return
    }


    try {
        const response = await Api.accessories.update(id,accessories)
        if(response.id){
            onSubmit(id,newname,newunit,newqty,newprice)
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
          <DialogTitle>Редактировать материал - Аксессуары</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Название</Label>
            <Input
              id="name"
              placeholder="Введите цвет"
              value={newname}
              onChange={(e) => setName(e.target.value)}
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
