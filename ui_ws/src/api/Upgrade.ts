import axios from "axios"
import config from "../config/config";

export async function triggerUpgrade( version: string ){

    console.log(`Upgrade to ${version}`)

    try {
        
        const resp = await axios({
            url: `http://${config.API_SERVER_IP}:${config.API_SERVER_PORT}/v1/versions/upgrade/${version}`,
            method: 'post',
            timeout: 1000,
        })

        // const { message } = resp.data;

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

interface UpgradeProgress {
    message: string,
    state: string
}


export async function fetchUpgradeProgress( { queryKey } ) {

    const [, { version }] = queryKey;

    console.log(`fetch upgrade ${version} progress`);

    try {
        
        const resp = await axios({
            url: `http://${config.API_SERVER_IP}:${config.API_SERVER_PORT}/v1/versions/upgrade/${version}/progress`,
            method: 'get',
            timeout: 1000,
        })

        const { message, state }: UpgradeProgress = resp.data;

        console.log(`Upgrade state: ${message} ${state}`);

        return state

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
