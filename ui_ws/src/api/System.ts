import axios from "axios";
import config from "../config/config";

export async function restartSystem(){

    console.log("Restart System");

    try {
        
        const resp = await axios({
            url: `http://${config.API_SERVER_IP}:${config.API_SERVER_PORT}/v1/system/restart`,
            method: 'post',
            timeout: 1000
        })

        console.log(resp.data);

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