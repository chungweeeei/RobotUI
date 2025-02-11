import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchUpgradeArchives } from "../../api/File";
import { fetchUpgradeProgress, triggerUpgrade } from "../../api/upgrade";
import { restartSystem } from "../../api/System";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Button from "@mui/material/Button";
import CircularProgress  from "@mui/material/CircularProgress";

interface UpgradeContentProps {
    isUpgrading: boolean
    isRestart: boolean
    upgradeState: string
}

function UpgradeContent( { isUpgrading, isRestart, upgradeState}: UpgradeContentProps){

    if (!isUpgrading && !isRestart){
        return (
            <p>Ready to upgrade the system</p>
        )
    } else if (isUpgrading && !isRestart){
        return (
            <div className="flex flex-col space-y-4 items-center justify-center">
                <CircularProgress />
                <p>Upgrade State {upgradeState}</p>
            </div>
        )
    } else if (!isUpgrading && isRestart){
        return (
            <p>Ready to restart the system</p>
        )
    }
}


export default function UpgradeDialog(){

    const [openDialog, setOpenDialog] = useState(false);

    // {TODO} how do i initail upgrade version after query fetch api
    const [upgradeVersion, setUpgradeVersion] = useState("1.2.11");

    // handle current state
    const [isRestart, setIsRestart] = useState(false);
    const [isUpgrading, setIsUpgrading] = useState(false);
    
    // 
    const queryClient = useQueryClient();

    const { data: archives } = useQuery({
        queryFn: fetchUpgradeArchives,
        queryKey: ["upgradeArchives"],
        retry: false,
        staleTime: Infinity,
    });

    /*
        To ask:
        1. what is the propery way to set a parent state inside a child component?
           - send a callback function into child component
        2. A query function trigger by a state, but how do i properly stop the query by its response data
           - useEffect to handle state change
    */     

    const { data: upgradeState, refetch: refetchUpgradeState } = useQuery({
        queryFn: fetchUpgradeProgress,
        queryKey: ["upgradeProgress", { version: upgradeVersion }],
        enabled: isUpgrading,
        refetchInterval: isUpgrading ? 3000 : false,
    })

    const { mutateAsync: RestartAysnc } = useMutation({
        mutationFn: async () => {
            await restartSystem();
            setIsRestart(false);
        },
        onSuccess: () => {
            // update upgrade archives
            queryClient.invalidateQueries(["versions"]);
        }
    })

    const handleUpgrade = async () => {
        
        try{
            await triggerUpgrade(upgradeVersion);
            setIsUpgrading(true);
            refetchUpgradeState();
        } catch(error){
            console.log(`${error}`)
        }

    }

    // {TODO} is there is a better way to handle this procedure
    useEffect(() => {
        if (upgradeState !== "restart") {
            return;
        }
        setIsUpgrading(false);
        setIsRestart(true);
    }, [upgradeState])

    return (
        <>
            <button className="bg-white text-black px-4 py-2 rounded"
                    onClick={() => {setOpenDialog(true)}}>
                Upgrade
            </button>
            <Dialog onClose={() => {setOpenDialog(false)}} 
                    aria-labelledby="customized-dialog-title" 
                    open={openDialog}
                    closeAfterTransition={false}>
                <DialogTitle id="customized-dialog-title">
                    Upgrad System
                    <IconButton
                      aria-label="close"
                      onClick={() => {setOpenDialog(false)}}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent className='flex flex-col space-y-4 items-center justify-center' 
                               dividers
                >
                    <UpgradeContent isUpgrading={isUpgrading} isRestart={isRestart} upgradeState={upgradeState}/>
                    {(!isUpgrading && !isRestart) && <div className='flex flex-row space-x-4'>
                                                        <p>select upgrade version</p>
                                                        <select className='border'
                                                            onChange={(e) => {setUpgradeVersion(e.target.value)}}>
                                                            {archives?.archives.map((archive, index) => <option key={index} value={archive}>{archive}</option>)}
                                                        </select>
                                                    </div>
                    }
                </DialogContent>
                <DialogActions>
                    {!isRestart ? 
                        <Button autoFocus
                                onClick={handleUpgrade}
                                disabled={isUpgrading}
                        >
                            Upgrade
                        </Button> : 
                        <Button autoFocus
                                onClick={async () => {
                                    try{
                                        await RestartAysnc();
                                        setIsRestart(false);
                                        setOpenDialog(false);
                                    } catch(error) {
                                        console.log(`${error}`);
                                    }
                                }}
                        >
                            Restart
                        </Button>}
                </DialogActions>
            </Dialog>
        </>
    )
}