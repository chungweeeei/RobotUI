import xmlHttpRequest from 'xmlhttprequest';

const upgradeBaseURL = "http://172.27.0.4:3000/v1/versions/upgrade";
const systemBaseURL = "http://172.27.0.4:3000/v1/system";
const fileBaseURL = "http://172.27.0.4:3000/v1/file";


export function triggerUpgrade(version: string) {

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open('POST', `${upgradeBaseURL}/${version}`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = () => {
            if(xhr.status !== 200){
                reject(`Request failed with status: ${xhr.status}`)
            } else {
                try {
                    const response = JSON.parse(xhr.responseText)
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

export function fetchUpgradeProgress(version: string) {

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open('GET', `${upgradeBaseURL}/${version}/progress`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = () => {
            if(xhr.status !== 200){
                reject(`Request failed with status: ${xhr.status}`)
            } else {
                try {
                    const response = JSON.parse(xhr.responseText)
                    resolve(response.state);
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

export function restartSystem() {
    
    return new Promise((resolve, reject) => {
        
        const xhr = new XMLHttpRequest();

        xhr.open('POST', `${systemBaseURL}/restart`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = () => {
            if(xhr.status !== 200){
                reject(`Request failed with status: ${xhr.status}`)
            } else {
                try {
                    const response = JSON.parse(xhr.responseText)
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

    })
    
}

export function fetchUpgradeArchives() {
    
    return new Promise((resolve, reject) => {
        
        const xhr = new XMLHttpRequest();

        xhr.open('GET', `${fileBaseURL}/upgrade/archives`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = () => {
            if(xhr.status !== 200){
                reject(`Request failed with status: ${xhr.status}`)
            } else {
                try {
                    const response = JSON.parse(xhr.responseText)
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

    })
    
}