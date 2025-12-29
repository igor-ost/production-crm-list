"use client"

import { Trash2, Search, Edit } from "lucide-react"
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
import StaffCreateModal from "./staff-create-modal"
import StaffUpdateModal from "./staff-update-modal"
import { StaffRemoveModal } from "./staff-remove-modal"
import RoleBadge from "../ui/role-badge"
import { Journal } from "../journal/journal-table"


export interface Staff {
  id: string
  login: string
  role: string
  journal?: Journal[]
}

interface StaffsTableProps {
  staffs: Staff[]
}

export function StaffTable({ staffs }: StaffsTableProps) {
  const [search, setSearch] = useState("")
  const [staffList,setStaffList] = useState(staffs)

  const handleNewStaff = (login:string,role:string,id:string) => {
    const updated = {
      login:login,
      role:role,
      id:id
    }
    setStaffList((prev) => [...prev, updated]);
  }

  const handleDeleteStaff = (id:string) => {
    const updated = staffList.filter(item => item.id != id)
    setStaffList(updated)
  }

  const handleUpdateStaff = (id: string, login: string, role: string) => {
    setStaffList(prev =>
      prev.map(item =>
        item.id === id ? { ...item, login, role } : item
      )
    );
  };

  const filteredStaff = useMemo(() => {
    return staffList.filter((customer) => {
      const matchesSearch =
        customer.login.toLowerCase().includes(search.toLowerCase()) ||
        customer.role.toLowerCase().includes(search.toLowerCase()) ||
        customer.id.toString().includes(search)


      return matchesSearch 
    })
  }, [staffList, search])

  useEffect(() => {
    setStaffList(staffs);
  }, [staffs]);

  return (
<div className="space-y-4">
  {/* Верхняя панель */}
  <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-background/60 p-4 shadow-sm backdrop-blur">
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Поиск персонала"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="pl-9"
      />
    </div>

    <div className="ml-auto">
      <StaffCreateModal onSubmit={handleNewStaff}>
        <Button className="rounded-lg">Создать персонал</Button>
      </StaffCreateModal>
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

            <TableCell className="text-right">
              {staff.role !== "admin" && (
                <div>
                  <StaffUpdateModal
                    id={staff.id}
                    login={staff.login}
                    role={staff.role}
                    onSubmit={handleUpdateStaff}
                  >
                    <Button size="icon" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </StaffUpdateModal>

                  <StaffRemoveModal
                    id={staff.id}
                    onSubmit={handleDeleteStaff}
                  >
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </StaffRemoveModal>
                </div>
              )}
            </TableCell>
          </TableRow>
        ))}

        {filteredStaff.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={4}
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
