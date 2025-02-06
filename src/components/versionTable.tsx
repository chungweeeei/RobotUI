import React, { version } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));


function generateTableBody(versions, filter){
    
    if(!versions) {
      return ( 
        <TableBody></TableBody> 
      )
    }

    if(!filter) {
      return (
        <TableBody>
          {versions.items.map((version) => (
              <StyledTableRow key={version.version}>
                <StyledTableCell component="th" scope="row">{version.version}</StyledTableCell>
                <StyledTableCell align="center">{version.upgrade_from}</StyledTableCell>
                <StyledTableCell align="center">{version.state}</StyledTableCell>
                <StyledTableCell align="center">{version.started_at}</StyledTableCell>
                <StyledTableCell align="center">{version.finished_at}</StyledTableCell>
              </StyledTableRow>
            ))}
        </TableBody>
      )
    }

    const filterVersions = versions.items.filter((version) => version.version.includes(filter));

    return (
      <TableBody>
        {filterVersions.map((version) => (
            <StyledTableRow key={version.version}>
              <StyledTableCell component="th" scope="row">{version.version}</StyledTableCell>
              <StyledTableCell align="center">{version.upgrade_from}</StyledTableCell>
              <StyledTableCell align="center">{version.state}</StyledTableCell>
              <StyledTableCell align="center">{version.started_at}</StyledTableCell>
              <StyledTableCell align="center">{version.finished_at}</StyledTableCell>
            </StyledTableRow>
          ))}
      </TableBody>
    )  
}

export default function VersionsTable(props) {

  return (
      <TableContainer component={Paper}>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Version</StyledTableCell>
              <StyledTableCell align="center">Upgrade from</StyledTableCell>
              <StyledTableCell align="center">State</StyledTableCell>
              <StyledTableCell align="center">Start time</StyledTableCell>
              <StyledTableCell align="center">Finished</StyledTableCell>
            </TableRow>
          </TableHead>
          {generateTableBody(props.versions, props.filter)}
        </Table>
      </TableContainer>
  );
}
