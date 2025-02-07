import React, { useState, useEffect} from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';


import { triggerUpgrade, fetchUpgradeProgress, restartSystem, fetchUpgradeArchives } from '../api/upgrade';

function generateDialogActions(upgrading: boolean, restart: boolean, upgradeState: string){

    if (!upgrading && !restart){
        return (
            <p>Ready to upgrade the system</p> 
        )
    } else if (upgrading && !restart){
        return (
            <div>
                <CircularProgress />
                <p>{upgradeState}</p>
            </div>
        )
    } else if (!upgrading && restart){
        return (
            <p>Press to restart the system</p>
        )
    }
}


export default function InstallationDialog() {

    const [open, setOpen] = useState(false);

    const [archives, setArchives] = useState([]);
    const [version, setVersion] = useState("1.2.11")

    const [restart, setRestart] = useState(false);
    const [upgradeState, setUpgradeState] = useState("default");
    const [upgrading, setUpgrading] = useState(false);
    const [intervalId, setIntervalId] = useState(null);

    const handleOpen = () => {

        fetchUpgradeArchives()
        .then((resolveValue) => {
            (resolveValue.archives) ? setVersion(resolveValue.archives[0]) : setVersion("");
            setArchives(resolveValue.archives);
            setOpen(true);
        })
        .catch((rejectValue) => {
            setOpen(true);
        })
        
    };
    
    const handleClose = () => {
      setOpen(false);
    };

    const handleUpgrade = () => {

        if(!version){
            alert("No upgrade version file be selected");
            return;
        }

        console.log(`upgrade to version ${version}`);
        // post upgrade 
        triggerUpgrade(version)
        .then((resolveValue) => {
            // Start interval to check upgrade progress
            setUpgrading(true);
            const id = setInterval(() => {
                fetchUpgradeProgress(version)
                .then((state) => {
                    setUpgradeState(state);
                    if (state === "restart"){
                        setUpgrading(false);
                        setRestart(true);
                        clearInterval(id);
                    }
                })
                .catch((error) => {
                    console.log(`Error cheking upgrade status: ${error}`);
                    clearInterval(id);
                })
            }, 1000);
            setIntervalId(id);
        })
        .catch((rejectValue) => {
            console.log(`rejectValue: ${rejectValue}`);
        })
    }

    const handleRestart = () => {

        restartSystem()
        .then((state) => {
            setRestart(false);
            setOpen(false);
        })
        .catch((error) => {
            setRestart(false);   
            setOpen(false);
        })
    }

    const handleOnSelect = (event) => {
        setVersion(event.target.value);
    } 

    useEffect(() => {
        return () => {
          if (intervalId) {
            clearInterval(intervalId);
          }
        };
    }, [intervalId]);


    // need to understand aria-hidden=true 
    // https://stackoverflow.com/questions/79006592/aria-hidden-warning-on-closing-mui-dialogue
    // the button in InstallationDialog css size should align with other buttons

    return (
        <>
          <button className="bg-white text-black px-4 py-2 rounded"
                  onClick={handleOpen}
            >
                Upgrade
          </button>
          <Dialog onClose={handleClose} 
                  aria-labelledby="customized-dialog-title" 
                  open={open}
                  closeAfterTransition={false}>
            <DialogTitle id="customized-dialog-title">
              Upgrad System
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent className='flex flex-col space-y-4 items-center justify-center' 
                           dividers
                >
                {generateDialogActions(upgrading, restart, upgradeState)}
                {(!upgrading && !restart) ? <div className='flex flex-row space-x-4'>
                                                <p>select upgrade version</p>
                                                <select className='border'
                                                        onChange={handleOnSelect}>
                                                    {archives.map((archive, index) => <option key={index} value={archive}>{archive}</option>)}
                                                </select>
                                            </div> 
                                          : <></>
                }
            </DialogContent>
            <DialogActions>
              {!restart ? <Button autoFocus 
                                  onClick={handleUpgrade}
                                  disabled={upgrading}
                          >
                            Upgrade
                          </Button> 
                        : <Button autoFocus 
                                   onClick={handleRestart}
                          >
                            Restart
                          </Button>}
            </DialogActions>
         </Dialog>
        </>
      );
}