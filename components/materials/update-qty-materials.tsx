"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Api } from "@/services/api-clients";
import { InvoiceList } from "./materials-table";
import { cn } from "@/lib/utils";
import { GripHorizontal, XIcon } from "lucide-react";

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // месяцы с 0
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

interface Position {
  x: number;
  y: number;
}

export default function UpdateQtyModal({children,onSubmit,id,type,name}:{children:React.ReactNode,id:string,type:"zippers" | "velcro" | "fabrics" | "threads" | "buttons" | "accessories",onSubmit:(id:string,invoice:InvoiceList)=>void,name:string}) {
  const [qty, setQty] = useState(0);
  const [price,setPrice] = useState(0)
  const [dateArrived, setDateArrived] = useState(new Date());
  const [error,setError] = useState("");
  const [isLoading,setIsLoading] = useState(false)
  const [open,setOpen] = useState(false)

  const [qty1, setQty1] = useState(0);
  const [qty2, setQty2] = useState(0);

    // Dragging state
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const positionStartRef = useRef<Position>({ x: 0, y: 0 });
  const dialogRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    positionStartRef.current = { ...position };
  }, [position]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    setPosition({
      x: positionStartRef.current.x + deltaX,
      y: positionStartRef.current.y + deltaY,
    });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Reset position when dialog opens
  useEffect(() => {
    if (open) {
      setPosition({ x: 0, y: 0 });
    }
  }, [open]);
  

  const handleSubmit = async () => {
    setIsLoading(true)
    const invoice = {
      material_id:id,
      qty:qty,
      dateArrived: new Date(dateArrived),
      price: price
    };


    try {
        const response = await Api[type].createInvoice(invoice as any)
        if(response){
            onSubmit(id,response)
            setIsLoading(false)
            setOpen(false)
            setQty(0)
            setDateArrived(new Date())
        }
    } catch (error:unknown) {
        setIsLoading(false)
        setError(error instanceof Error ? error.message : "Произошла ошибка")
    }

  };

  useEffect(()=>{
    setQty(qty1 * qty2)
  },[qty1,qty2])

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>{children}</DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          ref={dialogRef}
          className={cn(
            "bg-background fixed z-50 grid w-full max-w-[calc(100%-2rem)] gap-4 rounded-lg border p-6 shadow-lg sm:max-w-[425px]",
            "top-[50%] left-[50%]",
            !isDragging && "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200"
          )}
          style={{
            transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
          }}
        >
          {/* Draggable Header */}
          <div
            className={cn(
              "flex items-center gap-2 cursor-grab select-none",
              isDragging && "cursor-grabbing"
            )}
            onMouseDown={handleMouseDown}
          >
            <GripHorizontal className="h-4 w-4 text-muted-foreground" />
            <DialogPrimitive.Title className="text-lg font-semibold leading-none flex-1">
              Добавить накладную - {name}
            </DialogPrimitive.Title>
          </div>

          <DialogPrimitive.Close className="ring-offset-background focus:ring-ring absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
            <XIcon className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Дата</Label>
              <Input
                id="date"
                type="date"
                value={formatDate(dateArrived)}
                onChange={(e) => setDateArrived(new Date(e.target.value))}
              />
            </div>

            {type === "threads" && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="qty1">Кол-во бобин</Label>
                  <Input
                    id="qty1"
                    placeholder="Введите Кол-во бобин"
                    type="number"
                    value={qty1}
                    onChange={(e) => setQty1(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="qty2">Кол-во в 1 бобине</Label>
                  <Input
                    id="qty2"
                    placeholder="Введите Кол-во в 1 бобине"
                    type="number"
                    value={qty2}
                    onChange={(e) => setQty2(Number(e.target.value))}
                  />
                </div>
              </div>
            )}

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
                placeholder="Введите Цену"
                type="number"
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

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button disabled={isLoading} onClick={handleSubmit}>
              {!isLoading ? "Сохранить" : "Сохранение..."}
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
