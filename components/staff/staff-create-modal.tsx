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
import { Eye, EyeOff } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import axios from "axios";


export default function StaffCreateModal({children,onSubmit}:{children:React.ReactNode,onSubmit:(login:string,role:string,id:string)=>void}) {
  const [login, setLogin] = useState("");
  const [role, setRole] = useState("manager");
  const [password, setPassword] = useState("");
  const [showPassword,setShowPassword] = useState(false)
  const [error,setError] = useState("");
  const [isLoading,setIsLoading] = useState(false)
  const [open,setOpen] = useState(false)

  const handleSubmit = async () => {
    setIsLoading(true)
    const staff = {
      login,
      role,
      password
    };

    if(password.length < 8 ){
      setError("Поле (Пароль) должно быть больше или равно 8 символов.")
      setIsLoading(false)
      return
    }

    if(login == ""){
        setError("Поле (Логин) обязательно для заполнения.")
        setIsLoading(false)
        return
    }

    try {
        const response = await Api.users.create(staff)
        if(response.id){
            setLogin("");
            setRole("manager");
            onSubmit(login,role,response.id)
            setIsLoading(false)
            setOpen(false)
        }
    } catch (error:unknown) {
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
          <DialogTitle>Новый заказчик</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Логин</Label>
            <Input
              id="login"
              placeholder="Введите логин"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
             <Label htmlFor="role">Роль</Label>
              <Select value={role} onValueChange={(value) => setRole(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                      <SelectItem value="manager">Менеджер</SelectItem>
                      <SelectItem value="technologist">Технолог</SelectItem>
                      <SelectItem value="accountant">Бухгалтер</SelectItem>
                      <SelectItem value="seamstress">Швея</SelectItem>
                      <SelectItem value="cutter">Закройщик</SelectItem>
                      <SelectItem value="buttons">Портной (Пуговицы)</SelectItem>
                </SelectContent>
              </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name">Пароль</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Введите пароль"
                required
                value={password} 
                onChange={(e)=>setPassword(e.target.value)}
                className="h-11 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                <span className="sr-only">{showPassword ? "Скрыть пароль" : "Показать пароль"}</span>
              </button>
            </div>
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
