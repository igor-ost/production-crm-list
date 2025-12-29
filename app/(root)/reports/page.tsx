import { ReportsTable } from "@/components/reports/reports-table";
import { Api } from "@/services/api-clients";
import { cookies } from "next/headers";

const getStaffList = async () => {
  const cookieStore = await cookies();  
  const token = cookieStore.get('token')?.value;

  const data = await Api.users.getList(token);
  return data;
};

const getOrdersList = async () => {
  const cookieStore = await cookies();  
  const token = cookieStore.get('token')?.value;

  const data = await Api.orders.getList(token);
  return data;
};


export default async function Reports() {
  const staffList = await getStaffList();
  const ordersList = await getOrdersList();
  return (
    <div>
      <div className="bg-white rounded-md p-4">
        <ReportsTable orders={ordersList} staffs={staffList}/>
      </div>
    </div>
  );
}
