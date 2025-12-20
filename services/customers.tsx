import ApiRouter from "./constants";
import { axiosInstance, axiosInstanceServer } from "./instance";

export const getList = async (token:string | undefined): Promise<{id:string;name:string;bin:string}[]> => {
    const { data } = await axiosInstanceServer.get(ApiRouter.CUSTOMERS,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    return data as {id:string;name:string;bin:string}[];
}

export const create = async (req:{name:string;bin:string}): Promise<{id:string;name:string;bin:string}> => {
    const { data } = await axiosInstance.post(ApiRouter.CUSTOMERS,req);
    return data as {id:string;name:string;bin:string};
}


export const update = async (id:string,req:{name:string;bin:string}): Promise<{id:string;name:string;bin:string}> => {
    const { data } = await axiosInstance.patch(ApiRouter.CUSTOMERS + "/" + id,req);
    return data as {id:string;name:string;bin:string};
}

export const remove = async (id:string): Promise<{status:string}> => {
    const { data } = await axiosInstance.delete(ApiRouter.CUSTOMERS + "/" +id);
    return data as {status:string};
}
