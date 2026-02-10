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


export default function FabricsUpdateModal({children,onSubmit,name,color,unit,id}:{children:React.ReactNode,id:string,name:string,color:string,unit:string,onSubmit:(id:string,name:string,color:string,unit:string)=>void}) {
  const [newname, setName] = useState(name)
  const [newcolor, setColor] = useState(color);
  const [newunit, setUnit] = useState(unit);
  const [error,setError] = useState("");
  const [isLoading,setIsLoading] = useState(false)
  const [open,setOpen] = useState(false)

  const handleSubmit = async () => {
    setIsLoading(true)
    const fabric = {
      name:newname,
      color:newcolor,
      unit:newunit,
    };

    if(newname == ""){
        setError("Поле (Название) обязательно для заполнения.")
        setIsLoading(false)
        return
    }
    if(newcolor == ""){
        setError("Поле (Цвет) обязательно для заполнения.")
        setIsLoading(false)
        return
    }
    if(newunit == ""){
        setError("Поле (Ед. Изм.) обязательно для заполнения.")
        setIsLoading(false)
        return
    }


    try {
        const response = await Api.fabrics.update(id,fabric)
        if(response.id){
            onSubmit(id,newname,newcolor,newunit)
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
          <DialogTitle>Редактировать материал - Ткань</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="color">Название</Label>
            <Input
              id="name"
              placeholder="Введите Название"
              value={newname}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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
            <Label htmlFor="unit">Ед. Изм.</Label>
            <SelectUnit value={newunit} onValueChange={setUnit}/>
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
