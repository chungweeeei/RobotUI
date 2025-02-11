import React from "react"
import { Card, CardContent, LinearProgress, Typography } from '@mui/material';
import { createPortal } from "react-dom";

interface InfoCardProps {
    progress: number;
    message: string;
}

export default function InfoCard ( { message, progress }: InfoCardProps ) {

    return createPortal(
        <div style={{
            position: 'fixed',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            width: '80%',
            maxWidth: '400px',
        }}>
            <Card>
                <CardContent>
                    <Typography variant="body2">
                        {message}
                    </Typography>
                </CardContent>
                <CardContent>
                    <LinearProgress 
                        variant="determinate" 
                        value={progress} 
                    />
                </CardContent>
            </Card>
        </div>,
        document.body
    );
}