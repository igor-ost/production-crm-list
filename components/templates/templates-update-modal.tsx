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
import { Textarea } from "../ui/textarea";


export default function TemplatesUpdateModal({children,onSubmit,name,description,id}:{children:React.ReactNode,id:string,name:string,description:string,onSubmit:(id:string,name:string,description:string)=>void}) {
  const [newname, setName] = useState(name);
  const [newdescription, setDescription] = useState(description);
  const [error,setError] = useState("");
  const [isLoading,setIsLoading] = useState(false)
  const [open,setOpen] = useState(false)

  const handleSubmit = async () => {
    setIsLoading(true)
    const template = {
      name:newname,
      description:newdescription,
    };

    if(newname == ""){
        setError("Поле (Название) обязательно для заполнения.")
        setIsLoading(false)
        return
    }
    if(newdescription == ""){
        setError("Поле (Описание) обязательно для заполнения.")
        setIsLoading(false)
        return
    }


    try {
        const response = await Api.templates.update(id,template)
        if(response.id){
            onSubmit(id,newname,newdescription)
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
          <DialogTitle>Редактировать шаблон - Изделие</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Название</Label>
            <Input
              id="name"
              placeholder="Введите название"
              value={newname}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="type">Описание</Label>
            <Textarea
              id="type"
              placeholder="Введите описание"
              value={newdescription}
              onChange={(e) => setDescription(e.target.value)}
            >

            </Textarea>
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
