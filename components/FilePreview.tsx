import React from "react";

export interface File {
    fileName: string
}

interface FilePreviewProps {
    fileData: File[]
}

const FilePreview: React.FC<FilePreviewProps>=(props)=>{
    const {fileData} = props
    return (
        <div >
      <div >
        {/* loop over the fileData */}
        {fileData.map((f) => {
          return (
            <>
              <ol>
                <li key={f.fileName} >
                  {/* display the filename and type */}
                  <div key={f.fileName}>
                    {f.fileName}
                  </div>
                </li>
              </ol>
            </>
          );
        })}
      </div>
    </div>
    )
}

export default FilePreview;