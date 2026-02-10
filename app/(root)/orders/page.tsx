import { OrdersTable } from "@/components/orders/orders-table";
import { Api } from "@/services/api-clients";
import { cookies } from "next/headers";

const getOrdersList = async () => {
  const cookieStore = await cookies();  
  const token = cookieStore.get('token')?.value;

  const data = await Api.orders.getList(token);
  return data;
};

const getTemplatesList = async () => {
  const cookieStore = await cookies();  
  const token = cookieStore.get('token')?.value;

  const data = await Api.templates.getList(token);
  return data;
};

const getCustomersList = async () => {
  const cookieStore = await cookies();  
  const token = cookieStore.get('token')?.value;

  const data = await Api.customers.getList(token);
  return data;
};

const getMaterialsList = async () => {
  const cookieStore = await cookies();  
  const token = cookieStore.get('token')?.value;

  const data = await Api.materials.getList(token);
  return data;
};
const getStaffList = async () => {
  const cookieStore = await cookies();  
  const token = cookieStore.get('token')?.value;

  const data = await Api.users.getList(token);
  return data;
};


const getMaterialConsumptions = async () => {
  const cookieStore = await cookies();  
  const token = cookieStore.get('token')?.value;

  const data = await Api.materials_consumptions.getList(token);
  return data;

};



export default async function Orders() {
  const ordersList = await getOrdersList();
  const templatesList = await getTemplatesList();
  const customersList = await getCustomersList();
  const materialsList = await getMaterialsList();
  const staffList = await getStaffList();
  const materials_consumptions = await getMaterialConsumptions();
  return (
    <div>
      <div className="bg-[#63adff] rounded-md p-4 min-h-screen">
        <OrdersTable material_consumptions={materials_consumptions} staff={staffList} materials={materialsList} customers={customersList} templates={templatesList} orders={ordersList}/>
      </div>
    </div>
  );
}
