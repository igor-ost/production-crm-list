"use client";

import { Orders, statusColors, statusLabels } from "../orders/orders-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";


export default function CustomersOrdersTable({
  orders,
}: {
  orders: Orders[];
}) {

  return (

      <div className="rounded-lg border border-black/20 shadow-xl backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-black/20">
              <TableHead>#</TableHead>
              <TableHead>№</TableHead>
              <TableHead>Изделие</TableHead>
              <TableHead>Заказчик</TableHead>
              <TableHead>Размер</TableHead>
              <TableHead>Кол-во</TableHead>
              <TableHead>Пошив</TableHead>
              <TableHead>Крой</TableHead>
              <TableHead>Статус</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.map((order,index) => (
              <TableRow key={order.id} className="hover:bg-black/5">
              <TableCell className="font-medium text-muted-foreground">
                {index + 1}
              </TableCell>
                <TableCell>{order.order_number}</TableCell>
               <TableCell className="font-bold text-xs text-black">{order.template.name}</TableCell>
                <TableCell className="font-bold text-xs text-black">{order.customer.name}</TableCell>
                <TableCell>
                  <Badge>{order.size}</Badge>
                </TableCell>
                <TableCell>
                  <div className="gap-2 flex">
                    <Badge variant="outline">{order.quantity}шт.</Badge>
                    <Badge variant="outline">{order.buttons}п.</Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="fabrics">{order.sewing_price}тг.</Badge>
                </TableCell>
               <TableCell>
                  <Badge variant="fabrics">{order.cutting_price}тг.</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={`${statusColors[order.status]} border`}>
                    {statusLabels[order.status]}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}

            {orders.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={11}
                  className="py-8 text-center text-black/50"
                >
                  Ничего не найдено
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
  );
}
