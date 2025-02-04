import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

import { uploadFile, uploader} from "../api/uploadFile";

function UploadingIndicator(props){

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      <Button
        loading
        loadingPosition="start"
        startIcon={<CloudUploadIcon />}
        variant="outlined"
      >
        {props.context}
      </Button>
      <Box sx={{width: '100%', position: "absolute", bottom: 0}}>
        <LinearProgress 
          variant="determinate" 
          value={props.progress} 
          sx = {{ height: 5}}
        />
      </Box>
    </Box>
  )
}

function InputFileUpload() {

  const [context, setContext] = React.useState("")
  const [progress, setProgress] = React.useState(0)
  const [uploading, setUploading] = React.useState(false);

  // {TODO} when button onChange => need to popout a info card for showing
  // uploading information

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {

      setUploading(true);

      const file: uploadFile = {
        fileId: event.target.files[0].name,
        fileContent: event.target.files[0]
      };

      // create an instance for uploader
      const loader = new uploader(file);
      loader.onProgress = (loaded: number, total: number) => {
        setContext(`Uploading File`)

        const percentage = Math.ceil((loaded / total) * 100);
        setProgress(percentage);
      }

      // do upload
      loader.upload()
      .then((resolveValue) => {
        setUploading(false);
        console.log(`Upload Success: ${resolveValue}`)
      })
      .catch((rejectValue) => {
        setUploading(false);
        console.log(`Upload Failed: ${rejectValue}`)
      })
  }

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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      {uploading ? (
        <UploadingIndicator context={context} progress={progress} />
      ) : (
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
            multiple
            onChange={handleChange}
          />
        </Button>
      )}
    </Box>
  );
}

export default InputFileUpload;