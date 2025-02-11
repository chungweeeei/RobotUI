import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { uploadFile } from "../../api/File";
import InfoCard from "./UploadInfoCard";

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default function UploadButton() {
    
    const queryClient = useQueryClient();

    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadInfoMessage, setUploadInfoMessage] = useState<string | null>(null);

    const handleOnFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            await uploadFileAsync(file);
            // Reset the input value to allow selecting the same file again
            event.target.value = '';
        }
    }

    /*
        The difference between useQuery and useMutation is the flow of data.

        useQuery is used to query async data. 
        useMutation is used to mutate it. Or in traditional CRUD

        useQuery: Read (declarative)
        useMutation: Create/Delete/Update (imperative)
    */

    const { mutateAsync: uploadFileAsync } = useMutation({
        mutationFn: async (file: File) => {
            try{
                setUploadInfoMessage(`Currently Uploading ${file.name}`);
                await uploadFile(file, (loaded, total) => {
                    const percentCompleted = Math.ceil((loaded / total) * 100);
                    setUploadProgress(percentCompleted)
                });

                setTimeout(() => {
                    setUploadInfoMessage(null);
                    setUploadProgress(0);
                }, 1000)

            } catch(error){
                console.log(`Failed to upload file ${file.name}`)
            }
        },

        onSuccess: () => {
            // update upgrade archives
            queryClient.invalidateQueries(["upgradeArchives"]);
        }
    })

    return (
        <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
        >
            Upload File
        <VisuallyHiddenInput 
            type="file" 
            onChange={handleOnFileChange}
        />
        {uploadInfoMessage && <InfoCard message={uploadInfoMessage} progress={uploadProgress}/>}
      </Button>
      )
}