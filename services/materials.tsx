import { MaterialsTableProps } from "@/components/materials/materials-table";
import ApiRouter from "./constants";
import { axiosInstanceServer } from "./instance";

export const getList = async (token:string | undefined): Promise<MaterialsTableProps> => {
    const { data } = await axiosInstanceServer.get(ApiRouter.MATERIALS,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    return data as MaterialsTableProps;
}
