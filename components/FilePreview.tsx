import React, { useState } from "react";
import { ResultFileUpload } from "./DropZone";

export interface File {
  fileName: string
}

interface FilePreviewProps {
  data: any
  resultFileArr: ResultFileUpload[]
}

const FilePreview: React.FC<FilePreviewProps> = (props) => {
  const { data, resultFileArr } = props
  const [result, setResult] = useState<ResultFileUpload[]>(resultFileArr)
  console.log("_FilePreview_data = ", data);

  let renderData: any[] = []
  let i = 0;
  data.fileList.map((f: any) => {
    Array.from(f).map((ff: any) => {
      console.log("_FilePreview_ff = ", ff)
      let percentage = 0
      let fileName = ""

      console.log("_FilePreview_result = ", result);


      if (result && result[i]) {
        percentage = result[i].percentage
        fileName = result[i].fileName || ""
      }

      renderData.push(
        // <li key={ff.name} >
        //   {/* display the filename and type */}
        //   <div key={ff.name}>
        //     {ff.name} {percentage} {fileName}
        //   </div>
        // </li>
        <>
        <div className="max-w bg-red-100">
          <div className="rounded-lg bg-red-100">
          <div key={ff.name}>
             {ff.name} {percentage} {fileName}
           </div>
          </div>
        </div>
       
        </>
        
      );
      i++;
    });
  })

  console.log(renderData);
  return (
    <div >
      <div >
        <ol>
          {renderData}
        </ol>
      </div>
    </div>
  )
}

export default FilePreview;