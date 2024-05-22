import {joinURL} from 'ufo'
import axios, {AxiosHeaders, AxiosProgressEvent} from "axios";
import {useStrapiToken} from "./useStrapiToken";
import {useStrapiUrl} from "./useStrapiUrl";
import {useState} from "react";
import {strapiConfig} from "../config/strapiConfig";
import {useStrapi} from "../useStrapi";
/************************************************/
/* ref https://docs.strapi.io/dev-docs/plugins/upload */
/************************************************/

interface fileInfoProps {
    ref: string,
    refId: any,
    field: string,
    source?: string | null | undefined,
    path?: string | null | undefined,
}

interface FileInfoUpdateProps {
    name?: string | null | undefined,
    caption?: string | null | undefined,
    alternativeText?: string | null | undefined,
    fileId: number,
}

export const useStrapiMedia = () => {

    const {create}=useStrapi()
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    const {getToken} = useStrapiToken()
    const {adminUrl, userUrl} = useStrapiUrl()

    const getMediaUrl = (path: string) => {
        const url = strapiConfig.url ?? 'http://localhost:1337'
        return joinURL(url, path)
    }

    const uploadSingleMedia = async (formData?: FormData | null | undefined, fileInfo?: fileInfoProps, isForAdmin = false, onUploadProgress?: (progressEvent: AxiosProgressEvent) => void) => {
        try {

            if (!formData && !selectedFile) {
                throw 'Please select a file first.'
            }

            if (!formData) {
                formData = new FormData();
                formData!.append('files', selectedFile);
            }

            return await postFormDataRequest(formData, fileInfo, isForAdmin, onUploadProgress)
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error
        }
    }
    const uploadMultipleMedia = async (formData?: FormData | null | undefined, fileInfo?: fileInfoProps, isForAdmin = false, onUploadProgress?: (progressEvent: AxiosProgressEvent) => void) => {
        try {

            if (!formData && selectedFiles.length === 0) {
                throw 'Please select at least one file.';
            }

            if (!formData) {

                formData = new FormData();

                for (let i = 0; i < selectedFiles.length; i++) {
                    formData!.append('files', selectedFiles[i]);
                }

            }

            return await postFormDataRequest(formData, fileInfo, isForAdmin, onUploadProgress)

        } catch (error) {
            console.error('Error uploading file:', error);
            throw error
        }
    }


    const updateFileInfo = async (fileInfo: FileInfoUpdateProps, isForAdmin = false, onUploadProgress?: (progressEvent: AxiosProgressEvent) => void) => {
        try {

            if(!fileInfo)
                throw 'file Info is required.';

            const path = `upload?id=${fileInfo?.fileId}`

            return  await create(path, {
                fileInfo
            });

        } catch (error) {
            console.error('Error uploading file:', error);
            throw error
        }
    }


    const postFormDataRequest = async (formData, fileInfo?: fileInfoProps, isForAdmin = false, onUploadProgress?: (progressEvent: AxiosProgressEvent) => void, path?: string) => {


        const headers: AxiosHeaders = new AxiosHeaders()

        headers.setContentType('multipart/form-data')

        const token = getToken()

        if (token != null) {
            headers.Authorization = `Bearer ${token}`
        }

        if (fileInfo) {
            formData!.append('ref', fileInfo.ref);
            formData!.append('refId', fileInfo.refId);
            formData!.append('field', fileInfo.field);

            if (fileInfo.source)
                formData!.append('source', fileInfo.source);

            if (fileInfo.path)
                formData!.append('path', fileInfo.path);
        }

        // Using for...of loop to iterate over entries
        for (let [key, value] of formData!.entries()) {


            console.log('====================================');
            console.log(key, value);
            console.log('====================================');

        }

        const response = await axios.post(`${isForAdmin ? adminUrl() : userUrl()}/${path ?? 'upload'}`, formData, {
            headers: headers,
            onUploadProgress: onUploadProgress,
        });

        console.log('File uploaded successfully:', response.data);
        return response.data

    }

    return {
        getMediaUrl,
        uploadSingleMedia,
        uploadMultipleMedia,
        setSelectedFiles,
        selectedFiles,
        selectedFile,
        setSelectedFile,
        updateFileInfo
    }

}
