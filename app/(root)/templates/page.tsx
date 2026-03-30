import { TemplatesTable } from "@/components/templates/templates-table";
import { Api } from "@/services/api-clients";
import { cookies } from "next/headers";

const getTemplatesList = async () => {
  const cookieStore = await cookies();  
  const token = cookieStore.get('token')?.value;

  const data = await Api.templates.getList(token);
  return data;

};

const getMaterialList = async () => {
  const cookieStore = await cookies();  
  const token = cookieStore.get('token')?.value;

  const data = await Api.materials.getList(token);
  return data;

};


export default async function Templates() {
  const templatesList = await getTemplatesList();
  const materialList = await getMaterialList();

  return (
    <div>
      <div className="bg-[#63adff] rounded-md p-4  min-h-[80vh]">
        <TemplatesTable materials={materialList} templates={templatesList}/>
      </div>
    </div>
  );
}
