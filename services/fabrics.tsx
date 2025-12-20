import ApiRouter from "./constants";
import { axiosInstance, axiosInstanceServer } from "./instance";

export const getList = async (token:string | undefined): Promise<{id:string;name:string;color:string;type:string,unit:string,qty:number,price:number}[]> => {
    const { data } = await axiosInstanceServer.get(ApiRouter.FABRICS,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    return data as {id:string;name:string;color:string;type:string,unit:string,qty:number,price:number}[];
}

export const create = async (req:{name:string;color:string;type:string,unit:string,qty:number,price:number}): Promise<{id:string;name:string;color:string;type:string,unit:string,qty:number,price:number}> => {
    const { data } = await axiosInstance.post(ApiRouter.FABRICS,req);
    return data as {id:string;name:string;color:string;type:string,unit:string,qty:number,price:number};
}


export const update = async (id:string,req:{name:string;color:string;type:string,unit:string,qty:number,price:number}): Promise<{id:string;name:string;color:string;type:string,unit:string,qty:number,price:number}> => {
    const { data } = await axiosInstance.patch(ApiRouter.FABRICS + "/" + id,req);
    return data as {id:string;name:string;color:string;type:string,unit:string,qty:number,price:number};
}

export const remove = async (id:string): Promise<{status:string}> => {
    const { data } = await axiosInstance.delete(ApiRouter.FABRICS + "/" +id);
    return data as {status:string};
}
