import React, { useState } from "react";
import { TablePagination } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import { fetchVersions } from "../api/Version.ts";

import VersionTable from "../components/version/Table.tsx"
import UploadButton from "../components/version/UploadButton.tsx";
import UpgradeButton from "../components/version/UpgradeButton.tsx";

export default function VersionPage(){

    const [page, setPage] = useState(0);

    /*
        Default retry behavior:
        - React Query automatically retries a failed request 3 times before marking it as failed.
        - It uses exponential backoff, meaning each retry waits progressively longer before retrying.

        what you can do is:
        1. Disable automatically retry, set retry option to false => {retry: false}
        2. Set a custom retry count => {retry: 2}
        3. You can provide a function to determine when to retry based on the error.

        ```
            retry: (failureCount, error) => {
                if (error.response?.status === 404) {
                  return false; // Do not retry for 404 errors
                }
                return failureCount < 3; // Retry up to 3 times
            }
        ```

    */

    /*
        In react-query, the queryFn will be triggered whenever the 
        queryKey changes.  This means that if any part of the queryKey changes, 
        including the state that is part of the queryKey, the queryFn will be
        called again to fetch the data.
    */

    const { data: versions } = useQuery({
        queryFn: fetchVersions,
        queryKey: ['versions', { page }],
        retry: false,
        staleTime: Infinity
    })

    return (
        <div className="flex flex-col space-y-4 w-auto h-auto m-8 p-8 bg-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-4 items-left justify-start">
                    <h2 className="text-4xl">Software Versions</h2>
                    <p  className="text-sm">Change the current version</p>
                </div>
                <div className="flex space-x-3 items-center justify-end">
                    <UploadButton />
                    <UpgradeButton />
                    <button className="bg-white text-black px-4 py-2 rounded"
                            onClick={(e) => {console.log("click")}}>
                        Clear Filters
                    </button>
                </div>
            </div>
            <div className="flex justify-between items-center border-b-4">
                <div className="flex space-x-4">
                    <p>Filter:</p>
                    <input 
                        className="text-sm"
                        placeholder="Write version to filter by..."
                        onInput={(e) => {
                            console.log(e.target.value);
                        }}
                    />
                </div>
                {versions && <TablePagination
                                component="div"
                                count={versions ? versions.total : 0}
                                page={page}
                                onPageChange={(event, newPage: number) => {
                                    try{
                                        setPage(newPage);
                                    }catch(error){
                                        console.log('Failed to page change');
                                    }
                                }}
                                rowsPerPage={5}
                                rowsPerPageOptions={[]}
                />}
            </div>
            <div>
                <VersionTable versions={versions?.versions}/>
            </div>
        </div>
    )

}