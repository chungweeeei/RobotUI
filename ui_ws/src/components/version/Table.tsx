import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { VersionInfo } from "../../entities/Version"

interface VersionTableProps {
    versions: VersionInfo[];
}


export default function VersionTable({ versions }: VersionTableProps) {

    return (
        <TableContainer>
            <Table aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <TableCell>Version</TableCell>
                        <TableCell align="center">Upgrade from</TableCell>
                        <TableCell align="center">State</TableCell>
                        <TableCell align="center">Start time</TableCell>
                        <TableCell align="center">Finished</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {versions?.map( ( version ) => (
                        <TableRow key={version.version}>
                            <TableCell component="th" scope="row">{version.version}</TableCell>
                            <TableCell align="center">{version.upgrade_from}</TableCell>
                            <TableCell align="center">{version.state}</TableCell>
                            <TableCell align="center">{version.started_at}</TableCell>
                            <TableCell align="center">{version.finished_at}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )

}