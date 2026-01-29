import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import SelectStaff from "../ui/select-staff";
import { Api } from "@/services/api-clients";
import { ordersStore } from "@/store/order-store";
import { OrderStaffs } from "../orders/orders-table";
import { Staff } from "../staff/staff-table";
import { Input } from "../ui/input";


interface OrderStaffsModalProps {
  children: React.ReactNode
  order_id:string
  staff:Staff[]
}

export default function OrderStaffsCreate({
  children,
  order_id,
  staff
}: OrderStaffsModalProps) {
  const {orders,setOrders} = ordersStore()
  const [open,setOpen] = useState(false)
  const [qty,setQty] = useState(0)
  const [selected, setSelected] = useState("");
  const [isLoading,setIsLoading] = useState(false)


  const handleAdd = async () => {
    try {
      const response = await Api.order_staffs.create({
        order_id,
        qty: qty,
        staff_id:selected
      })
      if(response.id){
        const newArray = orders.map((item) => {
            if (item.id === order_id) {
              return {
                ...item,
                staffs: [...(item.staffs || []), response] as OrderStaffs[]
              };
            }
            return item;
        });

        setOrders(newArray);
        setOpen(false)
      }
    } catch (error) {
      
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Добавить исполнителя</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Персонал</Label>
            <SelectStaff staff={staff} onValueChange={setSelected} value={selected}/>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name">Нужно изготовить</Label>
            <Input onChange={(e)=>setQty(Number(e.target.value))} type="number" value={qty}/>
          </div>
    
        </div>

        <DialogFooter>
          <Button disabled={isLoading} onClick={handleAdd}>{!isLoading ? "Добавить" : "Добавление..."}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
