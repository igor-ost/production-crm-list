import {MaterialsTable} from "@/components/materials/materials-table";
import { Api } from "@/services/api-clients";
import { cookies } from "next/headers";

const getMaterialList = async () => {
  const cookieStore = await cookies();  
  const token = cookieStore.get('token')?.value;

  const data = await Api.materials.getList(token);
  return data;

};


export default async function Orders() {

  const materialList = await getMaterialList();

  return (
    <div>
      <div className="bg-[#63adff] rounded-md p-4 min-h-screen">
        <MaterialsTable 
          velcro={materialList.velcro}
          accessories={materialList.accessories}
          fabrics={materialList.fabrics}
          zippers={materialList.zippers}
          threads={materialList.threads}
          buttons={materialList.buttons}/>
      </div>
    </div>
  );
}
