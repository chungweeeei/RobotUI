import React, { useEffect, useState, useRef} from "react";
import { TablePagination } from "@mui/material";

import InputFileUpload from "../components/uploadFile";
import VersionsTable from "../components/versionTable";
import { fetchVersions } from "../api/fetchversion";

function VersionPage() {
    
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [versions, setVersions] = useState()
    const [filterText, setFilterText] = useState("");
    const inputRef = useRef(null);

    useEffect(() => {
        fetchVersions(page, rowsPerPage)
        .then((resolveValue) => {
            setVersions(resolveValue);
        })
        .catch((rejectValue) => {
            console.log(`rejectValue: ${rejectValue}`)
        })
    }, [page]);

    const handleChangePage = (event, newPage: number) => {
        setPage(newPage);
    }

    const handleOnInput = (event) => {
        setFilterText(event.target.value);
    }

    const handleOnClick = (event) => {
        setFilterText("");
        if (inputRef.current){
            inputRef.current.value = "";
        }
    }

    return (
        <div className="flex flex-col space-y-4 w-auto h-auto m-8 p-8 bg-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-4 items-left justify-start">
                    <p className="text-4xl">Software versions</p>
                    <p className="text-sm">Change the current version</p>
                </div>
                <div className="flex space-x-3 items-center justify-end">
                    {/* <button className="bg-blue-500 text-white px-4 py-2 rounded">Upload File</button> */}
                    <InputFileUpload />
                    <button className="bg-white text-gray-300 px-4 py-2 rounded"
                            onClick={handleOnClick}>
                        Clear Filters
                    </button>
                </div>
            </div>
            <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                    <p>Filter:</p>
                    <input
                        ref={inputRef}
                        className="text-sm"
                        placeholder="Write version to filter by..."
                        onInput={handleOnInput}/>
                </div>
                <TablePagination
                  component="div"
                  count={versions ? versions.total : 0}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  rowsPerPageOptions={[]}
                />
            </div>
            <div>
                <VersionsTable versions={versions} filter={filterText}/>
            </div>
        </div>
    )
}

export default VersionPage;