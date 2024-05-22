import {AxiosHeaders, AxiosRequestConfig} from "axios";

import {stringify} from 'qs'
import axios from 'axios';
import {useStrapiUrl} from "./useStrapiUrl";
import {useStrapiToken} from "./useStrapiToken";
import {useStrapiVersion} from "./useStrapiVersion";


export const useStrapiClient = () => {

    const {userUrl, adminUrl} = useStrapiUrl()
    const {getToken} = useStrapiToken()
    const version = useStrapiVersion()


    return async <T>(url: string, fetchOptions: AxiosRequestConfig = {}, isForAdmin = false): Promise<T> => {

        try {

            const headers: AxiosHeaders = new AxiosHeaders()

            headers.setContentType('application/json')
            headers.setAccept('application/json')
            const token = getToken()

            if (token != null) {
                headers.Authorization = `Bearer ${token}`
            }

            if (token == null) {
                headers.setAuthorization(null)
            }

            // Map params according to strapi v3 and v4 formats
            if (fetchOptions.params) {
                const params = stringify(fetchOptions.params, {encodeValuesOnly: true})
                if (params) {
                    url = `${url}?${params}`
                }
                delete fetchOptions.params
            }


            let config = {
                maxBodyLength: Infinity,
                url: `${isForAdmin ? adminUrl() : userUrl()}/${url}`,
                headers: headers,
                ...fetchOptions
            };

            const response = await axios.request(config)

            return response.data

        } catch (e) {
            // const e: Strapi4Error | Strapi3Error = err.data || defaultErrors(err)[version]

            // nuxt.hooks.callHook('strapi:error', e)
            console.log('====================================');
            console.log("client Error ", e);
            console.log('====================================');
            throw e
        }
    }

}