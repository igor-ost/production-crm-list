import { Templates } from "@/components/templates/templates-table";
import ApiRouter from "./constants";
import { axiosInstance, axiosInstanceServer } from "./instance";

export const getList = async (token:string | undefined): Promise<Templates[]> => {
    const { data } = await axiosInstanceServer.get(ApiRouter.TEMPLATES,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    return data as Templates[];
}

export const create = async (req:{name:string;description:string}): Promise<Templates> => {
    const { data } = await axiosInstance.post(ApiRouter.TEMPLATES,req);
    return data as Templates;
}


export const update = async (id:string,req:{name:string;description:string}): Promise<Templates> => {
    const { data } = await axiosInstance.patch(ApiRouter.TEMPLATES + "/" + id,req);
    return data as Templates;
}

export const remove = async (id:string): Promise<{status:string}> => {
    const { data } = await axiosInstance.delete(ApiRouter.TEMPLATES + "/" +id);
    return data as {status:string};
}
