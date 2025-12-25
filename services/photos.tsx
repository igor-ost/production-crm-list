import ApiRouter from "./constants";
import { axiosInstance, axiosInstanceFormData } from "./instance";
import { Photos } from "@/components/orders/orders-view-photo";


export const create = async (
  id: string,
  file: File,
): Promise<Photos> => {
  const formData = new FormData();
  formData.append("file", file); 

  const { data } = await axiosInstanceFormData.post(
    `${ApiRouter.PHOTOS}/${id}`,
    formData,
  );

  return data as Photos;
};


export const remove = async (id:string): Promise<{status:string}> => {
    const { data } = await axiosInstance.delete(ApiRouter.PHOTOS + "/" +id);
    return data as {status:string};
}
