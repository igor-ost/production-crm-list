"use client"

import { AlertTriangle, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import React, { useState } from 'react'
import { Api } from '@/services/api-clients'


interface DeleteConfirmationDialogProps {
  onSubmit:  (id: string ) => void
  children: React.ReactNode,
  id:string
}

export function CustomerRemoveModal({
  onSubmit,
  id,
  children
}: DeleteConfirmationDialogProps) {

  const [open,setOpen] = useState(false)
  const [error,setError] = useState("")
  const [isLoading,setIsLoading] = useState(false)

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
        const response = await Api.customers.remove(id)
        if(response.status){
            setIsLoading(false)
            setOpen(false)
            onSubmit(id)
        }
    } catch (error) {
        setError(error instanceof Error ? error.message : "Произошла ошибка")
        setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/20">
            <AlertTriangle className="h-8 w-8 text-red-800 dark:text-red-800" />
          </div>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100 text-center">
           Удалить Заказчика?
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600 dark:text-gray-400 mt-2 text-center">
            Вы уверены, что хотите удалить этот элемент? Это действие не может быть отменено и безвозвратно удалит все связанные с ним данные..
          </DialogDescription>
        </DialogHeader>
        {error && (
            <div className="p-2">
              <p className="text-red-600 font-bold text-sm">{error}</p>
            </div>
          )}
        <DialogFooter>
          <div className="flex justify-center gap-4 mt-4 w-full">
          <Button
            variant="outline"
            className='cursor-pointer'
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Отмена
          </Button>
          <Button
            variant="destructive"
            className="bg-red-800 cursor-pointer hover:bg-red-700"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Удаление...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Удалить
              </>
            )}
          </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}