import { Plus, PlusCircle, X } from "lucide-react";
import { Orders, OrderStaffs } from "./orders-table";
import RoleBadge from "../ui/role-badge";
import { Button } from "../ui/button";
import { Api } from "@/services/api-clients";
import OrderStaffsCreate from "../order-staffs/order-staffs-create";
import { ordersStore } from "@/store/order-store";
import { staffsStore } from "@/store/staff-store";
import { Badge } from "../ui/badge";
import JournalCreateModal from "../journal/journal-create-modal";
import { Journal } from "../journal/journal-table";
import { Staff } from "../staff/staff-table";
import { create } from "domain";

interface OrdersViewStaff {
  order_id: string;
  staffs: OrderStaffs[]
  journal: Journal[]
  setJournal?: (journal: Journal[])=> void
}

export default function OrdersViewStaff({ order_id,staffs, journal,setJournal }: OrdersViewStaff) {
  const { setOrders,orders } = ordersStore()
  const { staff } = staffsStore()

  const handleAddJournal = (id:string,order:Orders,user:Staff,type:string,quantity:number,createdAt: Date) => {

    const updated = {
      order:order,
      user:user,
      type: type,
      quantity: quantity,
      id:id,
      createdAt:createdAt
    }

    const newArray = [...journal, updated];
    if(setJournal){
      setJournal(newArray)
    }

  }

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
        {staffs && staffs.length > 0 && staffs.map((i) => {
        const staffJournal = journal.filter(j => j.user.id === i.staff_id)

        const totalDone = staffJournal.reduce(
          (sum, j) => sum + j.quantity,
          0
        )

        return (
          <div
            key={i.id}
            className="space-y-3 rounded-xl border border-border bg-background p-4"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-sm font-semibold">
                  {i.user.login}
                </div>

                <RoleBadge role={i.user.role} />
              </div>

              <div className="flex items-center gap-2">
                <JournalCreateModal
                  orders={orders}
                  afterClear={false}
                  onSubmit={handleAddJournal}
                  staff={staff}
                  type_id={
                    i.user.role === "seamstress"
                      ? "sewing"
                      : i.user.role === "cutter"
                      ? "cutting"
                      : "buttons"
                  }
                  staff_id={i.staff_id}
                  order_id={order_id}
                >
                  <Button size="icon" variant="ghost">
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </JournalCreateModal>

                <button
                  onClick={() => handleRemove(i.id)}
                  className="rounded-md p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Нужно:</span>
                <Badge variant="outline">{i.qty}</Badge>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Сделано:</span>
                <Badge variant="secondary">{totalDone}</Badge>
              </div>
            </div>

            {staffJournal.length > 0 && (
              <div className="rounded-lg bg-muted/40 p-3 text-sm">

                <div className="space-y-1">
                  {staffJournal.map((j) => (
                    <div
                      key={j.id}
                      className="flex items-center justify-between rounded-md bg-background px-3 py-1"
                    >
                      <span className="text-muted-foreground">
                        {j.createdAt?.toString()}
                      </span>

                      <Badge>{j.quantity} шт</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })}
      </div>
    </div>
  );
}
