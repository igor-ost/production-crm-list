"use client"

import { Search, Info, Download } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Staff } from "@/components/staff/staff-table"
import RoleBadge, { getRoleLabel } from "@/components/ui/role-badge"
import { Badge } from "@/components/ui/badge"
import SalaryViewModal from "./salary-view-modal"
import * as XLSX from "xlsx"
import { workTypeLabel } from "@/components/journal/journal-table"



interface SalaryTableProps {
  staffs: Staff[]
}

export function SalaryTable({ staffs }: SalaryTableProps) {

  const isSameMonth = (dateString: Date | undefined, selectedMonth: string) => {
    if (dateString) {
      return new Date(dateString).toISOString().slice(0, 7) === selectedMonth;
    }
  };

  const getCurrentMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  };

  const [search, setSearch] = useState("")
  const [staffList, setStaffList] = useState(staffs)

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  const filteredStaff = useMemo(() => {
    return staffList.filter((staff) => {
      if (["admin", "manager", "accountant", "technologist"].includes(staff.role.toLowerCase())) {
        return false;
      }
      const matchesSearch =
        staff.login.toLowerCase().includes(search.toLowerCase()) ||
        staff.role.toLowerCase().includes(search.toLowerCase()) ||
        staff.id.toString().includes(search)


      return matchesSearch
    })
  }, [staffList, search])

  useEffect(() => {
    setStaffList(staffs);
  }, [staffs]);


  const exportToExcel = () => {
    const summaryData = filteredStaff.map((staff) => {
      const journal = staff.journal?.filter(j => isSameMonth(j.createdAt, selectedMonth)) || [];
      let salary = 0;
      let quantity = 0;
      journal.forEach(j => {
        switch (j.type) {
          case "cutting":
            salary += j.quantity * j.order.cutting_price;
            quantity += j.quantity;
            break;
          case "sewing":
            salary += j.quantity * j.order.sewing_price;
            quantity += j.quantity;
            break;
          case "buttons":
            quantity += j.quantity;
            break;
        }
      });

      return {
        "Работник": staff.login || "",
        "Должность": getRoleLabel(staff.role) || "",
        "Работ за месяц": journal.length,
        "Кол-во": quantity,
        "Зарплата": salary + " тг.",
        "Период": selectedMonth || ""
      };
    });

    const summarySheet = XLSX.utils.json_to_sheet(summaryData, { header: ["Работник", "Должность", "Работ за месяц", "Кол-во", "Зарплата", "Период"] });
    if (summarySheet['!ref']) {
      const summaryRange = XLSX.utils.decode_range(summarySheet['!ref']);
      for (let C = summaryRange.s.c; C <= summaryRange.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ c: C, r: 0 });
        if (!summarySheet[cellAddress]) continue;
        summarySheet[cellAddress].s = { font: { bold: true }, alignment: { horizontal: "center" } };
      }
    }
    summarySheet['!cols'] = [
      { wch: 20 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 }
    ];

    let journalData: any[] = [];
    filteredStaff.forEach((staff) => {
      const journal = staff.journal?.filter(j => isSameMonth(j.createdAt, selectedMonth)) || [];
      journal.forEach((item, index) => {
        journalData.push({
          "№": index + 1,
          "Работник": staff.login || "",
          "Заказ №": item.order.order_number || "",
          "Цена пошива": item.order.sewing_price || 0,
          "Цена раскроя": item.order.cutting_price || 0,
          "Тип работы": workTypeLabel(item.type) || "",
          "Кол-во": item.quantity || 0,
          "Дата": item.createdAt ? new Date(item.createdAt).toLocaleString() : ""
        });
      });
    });

    const journalSheet = XLSX.utils.json_to_sheet(journalData, {
      header: ["№", "Работник", "Заказ №", "Цена пошива", "Цена раскроя", "Тип работы", "Кол-во", "Дата"]
    });
    if (journalSheet['!ref']) {
      const journalRange = XLSX.utils.decode_range(journalSheet['!ref']);
      for (let C = journalRange.s.c; C <= journalRange.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ c: C, r: 0 });
        if (!journalSheet[cellAddress]) continue;
        journalSheet[cellAddress].s = { font: { bold: true }, alignment: { horizontal: "center" } };
      }
    }
    journalSheet['!cols'] = [
      { wch: 5 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 10 },
      { wch: 20 }
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Отчёт по зарплате");
    XLSX.utils.book_append_sheet(workbook, journalSheet, "Журнал работ");

    XLSX.writeFile(workbook, `Отчёт_по_зарплате_${selectedMonth}.xlsx`);
  };


  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-background/60 p-4 shadow-sm backdrop-blur">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Поиск</label>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск персонала"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Месяц</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Ecxel</label>
          <Button onClick={exportToExcel} className="bg-green-600 hover:bg-green-700 cursor-pointer">
            Скачать отчёт<Download />
          </Button>
        </div>
      </div>

      {/* Таблица */}
      <div className="overflow-hidden rounded-xl border bg-background/60 shadow-sm backdrop-blur">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[80px]">#</TableHead>
              <TableHead>Пользователь</TableHead>
              <TableHead>Роль</TableHead>
              <TableHead className="text-center">Работ за месяц</TableHead>
              <TableHead className="text-center">Кол-во</TableHead>
              <TableHead className="text-center">З\П</TableHead>
              <TableHead className="text-right px-4">Действия</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredStaff.map((staff, index) => (
              <TableRow
                key={staff.id}
                className="transition-colors hover:bg-muted/40 even:bg-muted/20"
              >
                <TableCell className="font-medium text-muted-foreground">
                  {index + 1}
                </TableCell>

                <TableCell className="font-medium">
                  {staff.login}
                </TableCell>

                <TableCell>
                  <RoleBadge role={staff.role} />
                </TableCell>

                <TableCell className="text-center">
                  <Badge variant="default">
                    {
                      staff.journal?.filter(j =>
                        isSameMonth(j.createdAt, selectedMonth)
                      ).length ?? 0
                    }
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline">
                    {(() => {
                      const journal = staff.journal?.filter(j =>
                        isSameMonth(j.createdAt, selectedMonth)
                      ) || [];
                      let quantity = 0;

                      journal.forEach(j => {
                        switch (j.type) {
                          case "cutting":
                            quantity += j.quantity;
                            break;
                          case "sewing":
                            quantity += j.quantity;
                            break;
                          case "buttons":
                            quantity += j.quantity;
                            break;
                          default:
                            break;
                        }
                      });

                      return quantity;
                    })()}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="fabrics">
                    {(() => {
                      const journal = staff.journal?.filter(j =>
                        isSameMonth(j.createdAt, selectedMonth)
                      ) || [];

                      let price = 0;
                      let quantity = 0;

                      journal.forEach(j => {
                        switch (j.type) {
                          case "cutting":
                            price += j.quantity * j.order.cutting_price;
                            break;
                          case "sewing":
                            price += j.quantity * j.order.sewing_price;
                            break;
                          case "buttons":
                            break;
                          default:
                            break;
                        }
                      });

                      return price;
                    })()}тг.
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <SalaryViewModal
                    staff={staff}
                    month={selectedMonth}
                  >
                    <Button
                      size="icon"
                      variant="ghost"
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </SalaryViewModal>
                </TableCell>
              </TableRow>
            ))}

            {filteredStaff.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-10 text-center text-muted-foreground"
                >
                  Ничего не найдено
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>

  )
}
