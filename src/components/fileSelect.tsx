import React, { useState } from "react";

function FileSelect() {

    const [selectedFile, setSelectedFile] = useState();

    const handleChange = (event: any) => {
        setSelectedFile(event.target.files[0]);
    }

    return (
        <div>
            <form>
                <input
                    type="file"
                    onChange={handleChange}
                />
                <input 
                    type="submit"
                />
            </form>
            {selectedFile && (
                  <div>
                    <p>Selected file: {selectedFile.name}</p>
                  </div>
            )}
        </div>
    )
}

export default FileSelect