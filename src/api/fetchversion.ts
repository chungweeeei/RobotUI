import { version } from 'react';
import xmlHttpRequest from 'xmlhttprequest';

const versionBaseURL = "http://172.27.0.4:3000/v1/versions";

type VersionInfo = {
    version: string,
    upgrade_from: string,
    state: string,
    // started_at should convert to date object
    started_at: string,
    finished_at: string,
    builded_at: string
}

type Versions = {
    current_version: string
    versions: Array<VersionInfo>
}

export function fetchVersions () {

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open('GET', versionBaseURL, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = () => {
            if(xhr.status !== 200){
                reject(`Request failed with status: ${xhr.status}`)
            } else {
                try {
                    const response: Versions[] = JSON.parse(xhr.responseText)
                    resolve(response);
                } catch(error){
                    reject(`Failed to parse response ${error}`);
                }
            }
        }

        xhr.onerror = () => {
            reject('Network Error');
        }
    
        xhr.send();
    
    });
}
