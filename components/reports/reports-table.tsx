"use client"

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import { SalaryTable } from "./salary/salary-table"
import { Staff } from "../staff/staff-table"
import { MaterialsTable } from "./materials/materials-table"
import { Orders } from "../orders/orders-table"
import { MaterialsTableProps } from "../materials/materials-table"
import { OrdersReportTable } from "./orders/orders-table"


export interface ReportsTableProps{
 staffs: Staff[]
 orders: Orders[]
}

export function ReportsTable({staffs,orders}:ReportsTableProps) {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="salary" className="space-y-4">
        <TabsList className="flex flex-wrap gap-2 bg-gray-100 rounded-lg p-1">
          {[
            { value: "salary", label: "Зарплата" },
            // { value: "materials", label: "Материалы" },
            { value: "orders", label: "Заказы" }
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="px-4 py-2 rounded-lg text-gray-700 data-[state=active]:bg-white data-[state=active]:shadow data-[state=active]:text-blue-600 hover:bg-white hover:text-blue-600 transition-all"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="salary">
          <SalaryTable staffs={staffs}/>
        </TabsContent>

        {/* <TabsContent value="materials">
          <MaterialsTable orders={orders} materilas={materials}/>
        </TabsContent> */}

        <TabsContent value="orders">
          <OrdersReportTable orders={orders}/>
        </TabsContent>

      </Tabs>
    </div>
  )
}
