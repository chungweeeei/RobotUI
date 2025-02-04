import fs from 'fs';
import xmlHttpRequest from 'xmlhttprequest';

export type uploadFile = {
    fileId: string,
    fileContent: File
};

export type uploadedBytes = {
    uploaded_byte: number
}

const fileBaseURL = "http://172.27.0.4:3000/v1/file";
const uploadURL = `${fileBaseURL}/upload`;
const fetchUploadProgressURL= `${fileBaseURL}/upload/progress`;

export class uploader{
    private _file: uploadFile;
    private _onProgress: CallableFunction;

    constructor (file: uploadFile){
        this._file = file;
    }

    set onProgress(onProgress: CallableFunction){
        this._onProgress = onProgress;
    }

    async fetchUploadedProgress(): Promise<uploadedBytes>{
        return new Promise((resolve, reject) => {

            const xhr = new XMLHttpRequest();
            xhr.open('GET', `${fetchUploadProgressURL}?file_id=${this._file.fileId}`, true);

            xhr.onload = () => {
                if(xhr.status !== 200){
                    reject(`Request failed with status: ${xhr.status}`)
                } else {
                    try {
                        const response: uploadedBytes[] = JSON.parse(xhr.responseText)
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

    upload(){
        
        return new Promise((resolve, reject) => {

            this.fetchUploadedProgress()
            .then((resolveValue) => {

                const progress = resolveValue.uploaded_byte;
    
                const xhr = new XMLHttpRequest();
                xhr.open('POST', uploadURL, true);
                
                xhr.setRequestHeader('x-file-id', this._file.fileId);
                xhr.setRequestHeader('x-file-name', this._file.fileContent.name);
                xhr.setRequestHeader('x-start-byte', progress);
                xhr.setRequestHeader('Content-Type', 'application/octet-stream');

                xhr.upload.onprogress = (event) => {
                    this._onProgress(progress + event.loaded, progress + event.total);
                }
        
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
        
                xhr.send(this._file.fileContent.slice(progress));

            })
        })
    }
}