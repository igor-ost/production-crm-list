import { OrdersTable } from "@/components/orders/orders-table";

export default function Orders() {
  const orders = [{
    id: "121225_00001",
    date: "12.12.2025",
    customer: "Игорь Остапенко",
    product: "Зимняя куртка",
    size: "120cm",
    quantity: 10,
    buttons: 10,
    cuttingCost: 1000,
    sewingCost: 1000,
    status: "new"
  }]

  return (
    <div>
      <div className="bg-white rounded-md p-4">
        {/* <OrdersTable orders={orders}/> */}
      </div>
    </div>
  );
}
