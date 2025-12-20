'use server'
import { CustomersTable } from "@/components/customers/customers-table";
import { Api } from "@/services/api-clients";
import { cookies } from "next/headers";


const getCustomerList = async () => {
  const cookieStore = await cookies();  
  const token = cookieStore.get('token')?.value;

  const data = await Api.customers.getList(token);
  return data;

};

export default async function Customers() {

  const customeList = await getCustomerList();

  return (
    <div>
      <div className="bg-white rounded-md p-4 min-h-screen">
        <CustomersTable customers={customeList}/>
      </div>
    </div>
  );
}

