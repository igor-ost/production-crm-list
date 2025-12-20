import ApiRouter from "./constants";
import { axiosInstance, axiosInstanceServer } from "./instance";

export const getList = async (token:string | undefined): Promise<{id:string;color:string;type:string,unit:string,qty:number,price:number}[]> => {
    const { data } = await axiosInstanceServer.get(ApiRouter.BUTTONS,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    return data as {id:string;color:string;type:string,unit:string,qty:number,price:number}[];
}

export const create = async (req:{color:string;type:string,unit:string,qty:number,price:number}): Promise<{id:string;color:string;type:string,unit:string,qty:number,price:number}> => {
    const { data } = await axiosInstance.post(ApiRouter.BUTTONS,req);
    return data as {id:string;color:string;type:string,unit:string,qty:number,price:number};
}


export const update = async (id:string,req:{color:string;type:string,unit:string,qty:number,price:number}): Promise<{id:string;color:string;type:string,unit:string,qty:number,price:number}> => {
    const { data } = await axiosInstance.patch(ApiRouter.BUTTONS + "/" + id,req);
    return data as {id:string;color:string;type:string,unit:string,qty:number,price:number};
}

export const remove = async (id:string): Promise<{status:string}> => {
    const { data } = await axiosInstance.delete(ApiRouter.BUTTONS + "/" +id);
    return data as {status:string};
}
