import { Plus, X } from "lucide-react";
import { OrderStaffs } from "./orders-table";
import RoleBadge from "../ui/role-badge";
import { Button } from "../ui/button";
import { Api } from "@/services/api-clients";
import OrderStaffsCreate from "../order-staffs/order-staffs-create";
import { ordersStore } from "@/store/order-store";
import { staffsStore } from "@/store/staff-store";

interface OrdersViewStaff {
  order_id: string;
  staffs: OrderStaffs[]
}

export default function OrdersViewStaff({ order_id,staffs }: OrdersViewStaff) {
  const { setOrders,orders } = ordersStore()
  const { staff } = staffsStore()
  const handleRemove = async (id:string) => {
    try {
      const response = await Api.order_staffs.remove(id)
      if(response.status){
        const newArray = orders.map((item) => {
            if (item.id === order_id) {
              return {
                ...item,
                staffs: [...(item.staffs?.filter(i=>i.id != id) || []) ] as OrderStaffs[]
              };
            }
            return item;
        });

        setOrders(newArray);
      }
    } catch (error) {
      
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Исполнители заказа
        </h3>

        <OrderStaffsCreate staff={staff.filter(s => !staffs.some(i => i.id === s.id))} order_id={order_id}>
          <Button variant="yellow">
            <Plus className="h-4 w-4" />
              Добавить
          </Button>
        </OrderStaffsCreate>
      </div>

      <div className="space-y-2">
        {staffs && staffs.length > 0 ? (
          staffs.map((i) => (
            <div
              key={i.id}
              className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3 transition hover:bg-muted"
            >
              <div className="flex gap-2">
                <div className="text-sm font-medium text-foreground">
                  {i.user.login}
                </div>
                <RoleBadge role={i.user.role}/>
              </div>

              <button
                onClick={()=>handleRemove(i.id)}
                className="rounded-md p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))
        ) : (
          <div className="rounded-lg border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
            Исполнители не добавлены
          </div>
        )}
      </div>
    </div>
  );
}
