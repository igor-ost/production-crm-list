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
import { Label } from "@/components/ui/label";
import { Api } from "@/services/api-clients";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";


export default function OrdersUpdateModal({children,onSubmit,status,notes,id}:{children:React.ReactNode,id:string,status:"new" | "in-progress" | "completed",notes:string,onSubmit:(id:string,status:"new" | "in-progress" | "completed",notes:string)=>void}) {
  const [newstatus, setStatus] = useState(status);
  const [newnotes, setNotes] = useState(notes);
  const [error,setError] = useState("");
  const [isLoading,setIsLoading] = useState(false)
  const [open,setOpen] = useState(false)

  const handleSubmit = async () => {
    setIsLoading(true)
    const order = {
      status:newstatus,
      notes:newnotes,
    };

    try {
        const response = await Api.orders.update(id,order)
        if(response.id){
            onSubmit(id,newstatus,newnotes)
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
          <DialogTitle>Редактировать заказ</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="status">Статус</Label>
            <Select
              value={newstatus}
              onValueChange={(value: "new" | "in-progress" | "completed") => setStatus(value)}
            >
              <SelectTrigger className="bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">Новый</SelectItem>
                <SelectItem value="in-progress">В работе</SelectItem>
                <SelectItem value="completed">Завершен</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Примечание</Label>
            <Textarea
              id="notes"
              placeholder="Введите примечание"
              value={newnotes}
              onChange={(e) => setNotes(e.target.value)}
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
