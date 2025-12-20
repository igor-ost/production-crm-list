import ApiRouter from "./constants";
import { axiosInstance, axiosInstanceServer } from "./instance";

export const getList = async (token:string | undefined): Promise<{id:string;name:string,unit:string,qty:number,price:number}[]> => {
    const { data } = await axiosInstanceServer.get(ApiRouter.VELCRO,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    return data as {id:string;name:string,unit:string,qty:number,price:number}[];
}

export const create = async (req:{name:string,unit:string,qty:number,price:number}): Promise<{id:string;name:string,unit:string,qty:number,price:number}> => {
    const { data } = await axiosInstance.post(ApiRouter.VELCRO,req);
    return data as {id:string;name:string;unit:string,qty:number,price:number};
}


export const update = async (id:string,req:{name:string,unit:string,qty:number,price:number}): Promise<{id:string;name:string,unit:string,qty:number,price:number}> => {
    const { data } = await axiosInstance.patch(ApiRouter.VELCRO + "/" + id,req);
    return data as {id:string;name:string,unit:string,qty:number,price:number};
}

export const remove = async (id:string): Promise<{status:string}> => {
    const { data } = await axiosInstance.delete(ApiRouter.VELCRO + "/" +id);
    return data as {status:string};
}
