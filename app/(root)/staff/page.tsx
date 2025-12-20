'use server'
import { CustomersTable } from "@/components/customers/customers-table";
import { StaffTable } from "@/components/staff/staff-table";
import { Api } from "@/services/api-clients";
import { cookies } from "next/headers";


const getStaffList = async () => {
  const cookieStore = await cookies();  
  const token = cookieStore.get('token')?.value;

  const data = await Api.users.getList(token);
  return data;

};

export default async function Staff() {

  const staffList = await getStaffList();

  return (
    <div>
      <div className="bg-white rounded-md p-4 min-h-screen">
        <StaffTable staffs={staffList}/>
      </div>
    </div>
  );
}

