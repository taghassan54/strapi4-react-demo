import {AxiosRequestConfig} from "axios";
import {useStrapiVersion} from "./composables/useStrapiVersion";
import {useStrapiClient} from "./composables/useStrapiClient";
import {Strapi4RequestParams} from "./types";

/**
 * @deprecated use `useStrapi` for correct types
 */
export const useStrapi4 = () => {

    const client = useStrapiClient()
    const version = useStrapiVersion()
    if (version !== 'v4') {
        console.warn('useStrapi4 is only available for v4')
    }

    /**
     * Get a list of {content-type} entries
     *
     * @param  {string} contentType - Content type's name pluralized
     * @param  {Strapi4RequestParams} [params] - Query parameters
     * @param fetchOptions
     * @param isForAdmin
     * @returns Promise<T>
     */
    const find = (contentType: string, params?: Strapi4RequestParams,fetchOptions?: AxiosRequestConfig,isForAdmin?): Promise<T> => {
      return client(contentType,{method:'GET',params:params,...fetchOptions},isForAdmin)
    }

    /**
     * Get a specific {content-type} entry
     *
     * @param  {string} contentType - Content type's name pluralized
     * @param  {string|number} id - ID of entry
     * @param  {Strapi4RequestParams} [params] - Query parameters
     * @param fetchOptions
     * @param isForAdmin
     * @returns Promise<T>
     */
    const findOne = <T>(contentType: string, id?: string | number | Strapi4RequestParams, params?: Strapi4RequestParams, fetchOptions?: AxiosRequestConfig,isForAdmin=false): Promise<T> => {
        if (typeof id === 'object') {
            params = id
            id = undefined
        }

        const path = [contentType, id].filter(Boolean).join('/')

        return client(path, { method: 'GET', params, ...fetchOptions },isForAdmin)
    }


    /**
     * Create a {content-type} entry
     *
     * @param  {string} contentType - Content type's name pluralized
     * @param  {Record<string, any>} data - Form data
     * @param fetchOptions
     * @param isForAdmin
     * @returns Promise<T>
     */
    const create = <T>(contentType: string, data: Partial<T>,fetchOptions?: AxiosRequestConfig,isForAdmin=false): Promise<T> => {
        return client(contentType, { method: 'POST', data: data ,...fetchOptions },isForAdmin)
    }

    /**
     * Update an entry
     *
     * @param  {string} contentType - Content type's name pluralized
     * @param  {string|number} id - ID of entry to be updated
     * @param  {Record<string, any>} data - Form data
     * @param fetchOptions
     * @param isForAdmin
     * @returns Promise<T>
     */
    const update = <T>(contentType: string, id?: string | number | Partial<T>, data?: Partial<T>,fetchOptions?: AxiosRequestConfig,isForAdmin=false): Promise<T> => {
        if (typeof id === 'object') {
            data = id
            id = undefined
        }

        const path = [contentType, id].filter(Boolean).join('/')

        return client(path, { method: 'PUT', data:  data ,...fetchOptions},isForAdmin)
    }

    /**
     * Delete an entry
     *
     * @param  {string} contentType - Content type's name pluralized
     * @param  {string|number} id - ID of entry to be deleted
     * @param isForAdmin
     * @returns Promise<T>
     */
    const _delete = <T>(contentType: string, id?: string | number,fetchOptions?: AxiosRequestConfig,isForAdmin=false): Promise<T> => {
        const path = [contentType, id].filter(Boolean).join('/')

        return client(path, { method: 'DELETE' ,...fetchOptions},isForAdmin)
    }



    return {
        find,
        findOne,
        create,
        update,
        delete: _delete
    }
}