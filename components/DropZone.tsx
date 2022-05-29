import React, { Dispatch, useReducer, useRef, useState } from "react";
import FilePreview, { File } from "./FilePreview";
import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileCsv } from '@fortawesome/free-solid-svg-icons'
import axios, { AxiosError } from "axios";

interface DropZoneProps {
  data: any
  dispatch: Dispatch<any>
}

export interface ResultFileUpload {
  percentage: number;
  status: number;
  err: string;
  fileName?: string;
}

const DropZone: React.FC<DropZoneProps> = (props) => {

  const { data, dispatch } = props
  const [file, setFile] = useState(false);
  const datas: File[] = [{ fileName: "test" }]
  const inputFile = useRef<HTMLInputElement>(null)
  const [resultFileArr, setResultFileArr] = useState<ResultFileUpload[]>([])

  console.log("_DropZone_data = ", data)

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

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // get files from event on the dataTransfer object as an array
    let files = e.dataTransfer.files;

    // ensure a file or files are dropped
    if (files && files.length > 0) {
      await prepareUpload(files)
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // get files from event on the input element as an array
    let files = e.target.files;

    // ensure a file or files are selected
    if (files && files.length > 0) {
      await prepareUpload(files)
    }
  };

  const prepareUpload = async (files: FileList) => {

    // loop over existing files
    let existingFiles: any[] = []
    data.fileList.map((f: any) => {
      Array.from(f).map((ff: any) => {
        existingFiles.push(ff.name)
      })
    });
    // check if file already exists, if so, don't add to fileList
    // this is to prevent duplicates
    let arrFile = Array.from(files).filter((f) => !existingFiles.includes(f.name));

    if (arrFile.length > 0) {
      let list = new DataTransfer();
      arrFile.map((f) => {
        list.items.add(f)
      })

      files = list.files

      // dispatch action to add selected file or files to fileList
      dispatch({ type: "ADD_FILE_TO_LIST", files });

      // reset inDropZone to false
      dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: false });

      arrFile.map(async (f, i) => {
        await uploadFile(f, i)
      })
    }
  }

  const uploadFile = async (file: globalThis.File, i: number) => {
    try {
      //console.log("_uploadfile_file", file);

      let formData = new FormData();
      formData.append("files", file);

      const option = {
        onUploadProgress: (progressEvent: ProgressEvent) => {
          const { loaded, total } = progressEvent
          let percent = Math.floor((loaded * 100) / total)
          //console.log(`${loaded}kb of ${total}kb | ${percent}%`);

          if (resultFileArr[i]) {
            let pArr = resultFileArr
            pArr[i] = { err: "", percentage: percent, status: 200 }
            setResultFileArr(pArr)
            //console.log("_uploadFile_have_pArr",pArr);

          } else {
            let pArr = resultFileArr
            let rsFile: ResultFileUpload = {
              err: "",
              percentage: percent,
              status: 200
            }
            pArr.push(rsFile)
            setResultFileArr(pArr)
            //console.log("_uploadFile_dont_have_pArr",pArr);
          }
        }
      }

      const response = await axios.post("http://localhost:4500/upload", formData, { headers: { "Content-Type": "multipart/form-data" }, onUploadProgress: option.onUploadProgress })
      //console.log(response);

      if (response.status === 200) {
        let pArr = resultFileArr
        pArr[i].fileName = response.data.file_name as string
        setResultFileArr(pArr)
        //console.log("_uploadFile_have_pArr",pArr);
      }

    } catch (error: any) {
      console.log("_uploadFile is error = ", error);
      if (resultFileArr[i]) {
        let pArr = resultFileArr
        pArr[i] = {
          err: error?.response.data as string,
          percentage: 0,
          status: 500
        }
        setResultFileArr(pArr)
        //console.log("_uploadFile_have_pArr",pArr);
      } else {
        let pArr = resultFileArr
        let rsFile: ResultFileUpload = {
          err: error?.response.data as string,
          percentage: 0,
          status: 500
        }
        pArr.push(rsFile)
        setResultFileArr(pArr)
      }
    }
  }

  console.log("result arr =", resultFileArr);

  return (
    <>
      <div
        onDragEnter={(e) => {
          handleDragEnter(e)
        }}
        onDragOver={(e) => {
          handleDragOver(e)
        }}
        onDragLeave={(e) => {
          handleDragLeave(e)
        }}
        onDrop={(e) => {
          handleDrop(e)
        }}
        style={{ backgroundColor: "#f6f7fd" }}
        className='my-5 rounded-2xl border-4 border-slate-300 border-dashed p-5 content-center jusify-center text-center'>
        <div className="w-1/12 content-center mx-auto">
          <FontAwesomeIcon className="fa-lg" style={{ fontSize: 10 }} icon={faFileCsv} color={"#5153fe"} />
        </div>
        <div className="my-5">
          <p className="text-center text-slate-600 text-3xl">Drag your .csv file here to start uploading.</p>
        </div>
        <div className="my-5">
          <label style={{ color: "#a0abc2" }} className="text-3xl">
            <label className="line-through">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </label>
            <label className="mx-2">{" "}OR{" "}</label>
            <label className="line-through">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </label>
          </label>
        </div>
        <input
          ref={inputFile}
          id="fileSelect"
          type="file"
          onChange={(e) => {
            handleFileSelect(e)
          }}
          multiple
          style={{ display: "none" }} />
        <button type="button" className="bg-indigo-500 rounded-md h-12 w-40 text-white text-xl" onClick={onButtonClick}>Browse File</button>
      </div>
      {/* Pass the selectect or dropped files as props */}
      <FilePreview data={data} resultFileArr={resultFileArr} />
    </>)
}

export default DropZone;