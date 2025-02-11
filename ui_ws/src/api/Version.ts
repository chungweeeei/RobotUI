import axios from "axios"
import config  from "../config/config"
import { Versions } from "../entities/Version"

export const fetchVersions = async ( { queryKey } ) => {

    const [, { page }] = queryKey;

    console.log("fetch versions");

    try{
        
        const resp = await axios({
            url: `http://${config.API_SERVER_IP}:${config.API_SERVER_PORT}/v1/versions`,
            method: 'get',
            headers: {"Content-Type": "application/json"},
            timeout: 1000,
            params: {
                page: page + 1,
                size: 5
            }
        })

        if (resp.status !== 200){
            throw new Error("Failed to fetch versions");
        }

        const versions: Versions = resp.data;

        return versions;

    } catch(error){

        if (axios.isAxiosError(error)){
            if (error.code === "ECONNABORTED"){
                console.log(`Request timeout: ${error.message}`);
            } else {
                console.log(`Failed to fetch versions: ${error.message}`)
            }
        } else {
            console.log(`An unexpected error occurred: ${error}`);
        }
        throw error;
    }

}