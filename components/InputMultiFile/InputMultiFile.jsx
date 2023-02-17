import React, { useEffect, useId } from 'react'
import { FaTimes } from 'react-icons/fa'
import { HiPlus } from 'react-icons/hi'
import displayToast from '~/utils/displayToast'
import getIconFileType from '~/utils/getIconFileType'

export default function InputMultiFile({handleChange = () => {}, maxFiles = 5, initialFiles}) {
  const [files, setFiles] = React.useState([])
  const inputId = useId()
  const inputFileRef = React.useRef(null)
  const filesRef = React.useRef(null)
  const handleAddFile = (e) => {
    const fileList = e.target.files
    if(fileList.length === 0) return
    let fileNew = [...files]
    for(let i = 0; i < fileList.length; i++) {
      if(fileNew.length < maxFiles) {
        let isExist = false
        for(let j = 0; j < fileNew.length; j++) {
          if(fileNew[j].name === fileList[i].name && fileNew[j].size === fileList[i].size && fileNew[j].type === fileList[i].type) {
            isExist = true
            displayToast("warning", "Bạn đã chọn file này rồi")
            break;
          }
        }
        if(isExist) continue
        fileNew.push(fileList[i])
      }else {
        displayToast("warning", "Bạn chỉ được chọn tối đa 5 file")
        break;
      }
    }

    setFiles(fileNew)
    filesRef.current = fileNew
    changeFileFunc()
  }
  const handleClickLabel = () => {
    if(files.length >= maxFiles) {
      displayToast("warning", "Bạn chỉ được chọn tối đa 5 file")
    }
    inputFileRef.current.value = null
  }
  const handleDeleteFile = (index) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)
    filesRef.current = newFiles
    changeFileFunc()
  }
  const changeFileFunc = () => {
    handleChange(filesRef.current)
  }


  useEffect(()=> {
    if(initialFiles) {
      setFiles(initialFiles)
    }
  }, [initialFiles])

  // console.log("Files: ", initialFiles)


  return (
    <>
    <div className="inputFile__wrapper">
      
      <input type="file" hidden id={inputId} onChange={(e) => handleAddFile(e)} multiple={true} ref={inputFileRef}/>
      <div className="inputFile__preview">
        {files.map((file, index) => {
          let fileSize = Math.floor(file.size / 1024)
          let fileName = ""
          if(file.name) {
            fileName = file.name.length > 30 ? file.name.slice(0, 30) + '...' : file.name
          }else {
            fileName = file.file_name
          }
          let fileType = file.type.split('/')[1]
          let FileIcon = getIconFileType(fileType)


          return (
            <div key={index} className="inputFile__preview-item">
              <div className="inputFile__preview-item__delete" onClick={()=>handleDeleteFile(index)}>
                <FaTimes></FaTimes>
              </div>
              <div className="inputFile__preview-item__icon">
                <FileIcon />
              </div>
              <div className="inputFile__preview-item__wrap">
                <div className="inputFile__preview-item__name">
                  {fileName}
                </div>
                <div className="inputFile__preview-item__size">
                  {fileSize > 1024 ? `${Math.floor(fileSize / 1024)} MB` : `${fileSize} KB`}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      {files.length < maxFiles && 
        <label htmlFor={inputId} className="inputFile__label" onClick={handleClickLabel}>
          Thêm file <span><HiPlus></HiPlus></span>
        </label>
      }
    </div>
    </>
  )
}
