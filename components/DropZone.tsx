import React, { Dispatch, useReducer, useRef, useState } from "react";
import FilePreview,{File} from "./FilePreview";
import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileCsv } from '@fortawesome/free-solid-svg-icons'

interface DropZoneProps{
    data:any
    dispatch: Dispatch<any>
}

const DropZone: React.FC<DropZoneProps> = (props) =>{

    const { data, dispatch } = props
    const [file, setFile] = useState(false);
    const datas:File[] = [{fileName:"test"}] 
    const inputFile = useRef<HTMLInputElement>(null) 

    const onButtonClick = () => {
        // `current` points to the mounted file input element
       inputFile?.current?.click();
      };

      const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: true });
      };

      const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    
        // set dropEffect to copy i.e copy of the source item
        e.dataTransfer.dropEffect = "copy";
        dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: true });
      };

      const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    
        dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: false });
      };

      const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    
        // get files from event on the dataTransfer object as an array
        let files = e.dataTransfer.files;

        console.log("_dropzone_handledrop files = ", files);
        
    
        // ensure a file or files are dropped
        if (files && files.length > 0) {
          // loop over existing files
          const existingFiles = data.fileList.map((f:any) => f.name);
          // check if file already exists, if so, don't add to fileList
          // this is to prevent duplicates
          let arrFile = Array.from(files).filter((f) => !existingFiles.includes(f.name));

          let list = new DataTransfer();
          arrFile.map((f)=>{
              list.items.add(f)
          })

          files = list.files
    
          // dispatch action to add droped file or files to fileList
          dispatch({ type: "ADD_FILE_TO_LIST", files });
          // reset inDropZone to false
          dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: false });
        }
      };
    

    return (<>
   <div 
        onDragEnter={(e)=>{
            handleDragEnter(e)
        }} 
        onDragOver={(e)=>{
            handleDragOver(e)
        }}
        onDragLeave={(e)=>{
            handleDragLeave(e)
        }}
        onDrop={(e)=>{
            handleDrop(e)
        }}
        style={{backgroundColor:"#f6f7fd"}} 
        className='my-5 rounded-2xl border-4 border-slate-300 border-dashed p-5 content-center jusify-center text-center'>
       <div className="w-1/12 content-center mx-auto">
           <FontAwesomeIcon className="fa-lg" style={{fontSize:10}} icon={faFileCsv} color={"#5153fe"}/>
        </div>
        <div className="my-5">
            <p className="text-center text-slate-600 text-3xl">Drag your .csv file here to start uploading.</p>
        </div>
        <div className="my-5">
            <label style={{ color:"#a0abc2" }} className="text-3xl">
                <label className="line-through">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </label>
                <label className="mx-2">{" "}OR{" "}</label>
                <label className="line-through">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </label>
            </label>
        </div>
        <input ref={inputFile} id="fileSelect" type="file" multiple style={{ display:"none" }} />
        <button type="button" className="bg-indigo-500 rounded-md h-12 w-40 text-white text-xl" onClick={onButtonClick}>Browse File</button>
    </div>
    {/* Pass the selectect or dropped files as props */}
    <FilePreview fileData={datas} />
  </>)
}

export default DropZone;