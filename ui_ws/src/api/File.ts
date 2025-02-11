import axios from "axios"
import config  from "../config/config"

import { UploadProgress, UpgradeArchives } from "../entities/File";

export const fetchUploadFileProgress = async(fileId: string) => {

    try {

        const resp = await axios({
            url: `http://${config.API_SERVER_IP}:${config.API_SERVER_PORT}/v1/file/upload/progress/`,
            method: 'get',
            timeout: 1000,
            params: {
                file_id: fileId
            }
        })

        const progress: UploadProgress = resp.data;

        return progress

    } catch(error){
        if (axios.isAxiosError(error)){
            if (error.code === "ECONNABORTED"){
                console.log(`Request timeout: ${error.message}`);
            } else {
                console.log(`Failed to fetch ${fileId} upload progress: ${error.message}`)
            }
        } else {
            console.log(`An unexpected error occurred: ${error}`);
        }
        throw error;
    }
}

export const uploadFile = async(file: File, onProgress: (loaded: number, total: number) => void) => {
    
    var uploaded_byte = 0

    try {
        const progress: UploadProgress = await fetchUploadFileProgress(file.name);
        uploaded_byte = progress.uploaded_byte;
    } catch(error) {
        console.log(`Failed to fetch ${file.name} uploaded progress`);
    }

    try{

        const resp = await axios({
            url: `http://${config.API_SERVER_IP}:${config.API_SERVER_PORT}/v1/file/upload`,
            method: 'post',
            headers: {
                "Content-Type": "application/octet-stream",
                "x-file-id": file.name,
                "x-file-name": file.name,
                "x-start-byte": uploaded_byte.toString(),
            },

            data: file.slice(uploaded_byte),

            onUploadProgress: (progressEvent) => {
                const { loaded, total } = progressEvent;
                onProgress(loaded, total);
            }
        }) 

    } catch(error){
        if (axios.isAxiosError(error)){
            if (error.code === "ECONNABORTED"){
                console.log(`Request timeout: ${error.message}`);
            } else {
                console.log(`Failed to fetch ${file.name} upload progress: ${error.message}`)
            }
        } else {
            console.log(`An unexpected error occurred: ${error}`);
        }
        throw error;  

    }

}

export const fetchUpgradeArchives = async () => {

    console.log("fetch upgrade archives");

    try {
        
        const resp = await axios({
            url: `http://${config.API_SERVER_IP}:${config.API_SERVER_PORT}/v1/file/upgrade/archives`,
            method: 'get',
            timeout: 1000
        })

        const archives: UpgradeArchives = resp.data;

        return archives

    } catch(error){
        if (axios.isAxiosError(error)){
            if (error.code === "ECONNABORTED"){
                console.log(`Request timeout: ${error.message}`);
            } else {
                console.log(`Failed to fetch upgrade archives: ${error.message}`)
            }
        } else {
            console.log(`An unexpected error occurred: ${error}`);
        }
        throw error;
    }

}