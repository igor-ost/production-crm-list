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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import axios from "axios";


export default function StaffUpdateModal({children,onSubmit,login,role,id}:{children:React.ReactNode,id:string,login:string,role:string,onSubmit:(id:string,name:string,role:string)=>void}) {
  const [newLogin, setLogin] = useState(login);
  const [newrole, setRole] = useState(role);
  const [error,setError] = useState("");
  const [isLoading,setIsLoading] = useState(false)
  const [open,setOpen] = useState(false)

  const handleSubmit = async () => {
    setIsLoading(true)
    const staff = {
      login:newLogin,
      role:newrole,
    };

    if(newLogin == ""){
        setError("Поле (Логин) обязательно для заполнения.")
        setIsLoading(false)
        return
    }

    try {
        const response = await Api.users.update(id,staff)
        if(response.id){
            onSubmit(id,newLogin,newrole)
            setIsLoading(false)
            setOpen(false)
        }
      }catch (error: unknown) {
          setIsLoading(false);

          if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message;

            setError(
              Array.isArray(message)
                ? message.join("\n")
                : message || "Произошла ошибка"
            );
          } else {
            setError("Произошла ошибка");
          }
      }

  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Редактировать пользователя</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Логин</Label>
            <Input
              id="login"
              placeholder="Введите Логин"
              value={newLogin}
              onChange={(e) => setLogin(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
              <Label htmlFor="role">Роль</Label>
              <Select value={newrole} onValueChange={(value) => setRole(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                      <SelectItem value="manager">Менеджер</SelectItem>
                      <SelectItem value="technologist">Технолог</SelectItem>
                      <SelectItem value="accountant">Бухгалтер</SelectItem>
                      <SelectItem value="seamstress">Швея</SelectItem>
                      <SelectItem value="cutter">Закройщик</SelectItem>
                </SelectContent>
              </Select>
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
