'use server'

import { JournalTable } from "@/components/journal/journal-table";
import { Api } from "@/services/api-clients";
import { cookies } from "next/headers";


const getStaffList = async () => {
  const cookieStore = await cookies();  
  const token = cookieStore.get('token')?.value;

  const data = await Api.users.getList(token);
  return data;

};
const getJournalList = async () => {
  const cookieStore = await cookies();  
  const token = cookieStore.get('token')?.value;

  const data = await Api.journal.getList(token);
  return data;

};
const getOrdersList = async () => {
  const cookieStore = await cookies();  
  const token = cookieStore.get('token')?.value;

  const data = await Api.orders.getList(token);
  return data;

};


export default async function Journal() {

  const staffList = await getStaffList();
  const ordersList = await getOrdersList();
  const journalList = await getJournalList();
  return (
    <div>
      <div className="bg-white rounded-md p-4 min-h-screen">
        <JournalTable staff={staffList} orders={ordersList} journal={journalList}/>
      </div>
    </div>
  );
}

