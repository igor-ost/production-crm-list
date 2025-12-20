"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff } from "lucide-react"
import { Api } from "@/services/api-clients"
import { useRouter } from "next/navigation"



export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [login,setLogin] = useState("")
  const [password,setPassword] = useState("")
  const [error,setError] = useState("")

  const handleSubmit = async () => {
    setIsLoading(true)
    setError("")
    try {
      const data = {
        login: login,
        password:password
      }
      const response = await Api.auth.login(data)
      if(response.token){
        const token = response.token
        const expires = new Date()
        expires.setDate(expires.getDate() + 7)

        document.cookie = `token=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`
        console.log(`token=${token}; expires=${expires.toUTCString()}; path=/; secure; SameSite=Lax`)
        router.push("/orders")
        setIsLoading(false)
      }
    } catch (error: unknown) {
      console.log(error)
      setIsLoading(false)
      setError(error instanceof Error ? error.message : "Произошла ошибка")
    }
  }

  return (
    <Card className="border-0 shadow-none lg:border lg:shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-3xl font-bold">Вход</CardTitle>
        <CardDescription className="text-base">Введите свои данные для входа в систему</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Логин</Label>
            <Input id="login" type="text" value={login} onChange={(e)=>setLogin(e.target.value)} placeholder="Введите логин" required className="h-11" />
          </div>

          <div className="space-y-2">
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
          <Button onClick={handleSubmit} className="w-full h-11 text-base font-semibold" disabled={isLoading}>
            {isLoading ? "Вход..." : "Войти"}
          </Button>
         
        </div>
      </CardContent>
    </Card>
  )
}
