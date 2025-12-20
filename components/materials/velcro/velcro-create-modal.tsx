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


export default function VelcroCreateModal({children,onSubmit}:{children:React.ReactNode,onSubmit:(id:string,name:string,unit:string,qty:number,price:number,)=>void}) {
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("шт");
  const [qty, setQty] = useState(0);
  const [price, setPrice] = useState(0);
  const [error,setError] = useState("");
  const [isLoading,setIsLoading] = useState(false)
  const [open,setOpen] = useState(false)

  const handleSubmit = async () => {
    setIsLoading(true)
    const velcro = {
      name,
      unit,
      qty,
      price
    };

    if(name == ""){
        setError("Поле (Название) обязательно для заполнения.")
        setIsLoading(false)
        return
    }

    if(unit == ""){
        setError("Поле (Ед. Изм.) обязательно для заполнения.")
        setIsLoading(false)
        return
    }

    try {
        const response = await Api.velcro.create(velcro)
        if(response.id){
            setName("");
            setUnit("");
            setQty(0);
            setPrice(0);
            onSubmit(response.id,name,unit,qty,price)
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
          <DialogTitle>Создание материала - Велькро</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Название</Label>
            <Input
              id="name"
              placeholder="Введите Название"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>



          <div className="grid gap-2">
            <Label htmlFor="unit">Ед. Изм.</Label>
            <SelectUnit value={unit} onValueChange={setUnit}/>
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

          <div className="grid gap-2">
            <Label htmlFor="price">Цена</Label>
            <Input
              id="price"
              placeholder="Введите цену"
              type="price"
              value={price}
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
          <Button disabled={isLoading} onClick={handleSubmit}>{!isLoading ? "Создать" : "Создание..."}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
