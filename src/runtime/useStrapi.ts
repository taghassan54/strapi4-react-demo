import {useStrapi4} from "./useStrapi4";
import {Strapi4RequestParams, Strapi4ResponseMany, Strapi4ResponseSingle} from "./types";
import {AxiosRequestConfig} from "axios";

interface StrapiV4Client<T> {
  find<F = T>(contentType: string, params?: Strapi4RequestParams,fetchOptions?: AxiosRequestConfig,isForAdmin?:boolean): Promise<Strapi4ResponseMany<F>>
  findOne<F = T>(contentType: string, id?: string | number | Strapi4RequestParams, params?: Strapi4RequestParams,fetchOptions?: AxiosRequestConfig,isForAdmin?:boolean): Promise<Strapi4ResponseSingle<F>>
  create<F = T>(contentType: string, data: Partial<F>,fetchOptions?: AxiosRequestConfig,isForAdmin?:boolean): Promise<Strapi4ResponseSingle<F>>
  update<F = T>(contentType: string, id: string | number | Partial<F>, data?: Partial<F>,fetchOptions?: AxiosRequestConfig,isForAdmin?:boolean): Promise<Strapi4ResponseSingle<F>>
  delete<F = T>(contentType: string, id?: string | number,fetchOptions?: AxiosRequestConfig,isForAdmin?:boolean): Promise<Strapi4ResponseSingle<F>>
}

export const useStrapi = <T>(): StrapiV4Client<T>=> {
  return useStrapi4() as StrapiV4Client<T>
}
