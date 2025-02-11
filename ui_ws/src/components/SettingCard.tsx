import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TextField } from "@mui/material";

import { SystemSettings, MoveSettings } from "../entities/settings";
import { setSystemSettings, setMoveSettings } from "../api/Settings"

interface SettingsProps {
    topic: string
    settings: SystemSettings | MoveSettings
}

export default function SettingCard( { topic, settings }: SettingsProps){

    const queryClient = useQueryClient();

    const [parameters, setParameters] = useState(settings);

    /*
        react-queryClient use queryKey to determine which action should do after mutation
    */

    const { mutateAsync: setSystemSettingsMutation } = useMutation({
        mutationFn: setSystemSettings,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["settings"]});
        }
    })

    const { mutateAsync: setMoveSettingsMutation } = useMutation({
        mutationFn: setMoveSettings,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["settings"]});
        }
    })

    const handleOnChange = (event) => {
        
        const targetId = event.target.id;
        const value = event.target.value;

        setParameters((prevParameters) => ({
            ...prevParameters,
            [targetId]: value
        }))
    }

    const handleOnClick = async (event) => {

        const targetId = event.target.id;

        switch (targetId) {

            case "system":
                try {
                    await setSystemSettingsMutation({ parameters });
                } catch (error){
                    console.log("Failed to set system settings");
                }
                break;
            
            case "move":
                try {
                    await setMoveSettingsMutation({ parameters });
                } catch (error){
                    console.log("Failed to set move settings");
                }
                break

        }

    }

    return (
        <div key={topic}>
            <p>{topic}</p>
            {Object.entries(settings).map(([key, value]) => (
                <div key={key} className="flex flex-row space-x-4">
                    <p>{key}</p>
                    <p>{value}</p>
                    <TextField id={key} 
                               label={key} variant="outlined" 
                               defaultValue={value}
                               onChange={handleOnChange}
                    />
                </div>
            ))}
            <button id={topic} onClick={handleOnClick}>Settings</button>
        </div>
    )
}