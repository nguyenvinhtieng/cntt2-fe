import { AiFillFilePdf } from "react-icons/ai"
import { FaFileAlt, FaFileArchive, FaFileExcel, FaFilePowerpoint, FaFileWord, FaRegFileImage } from "react-icons/fa"
import { FiFileText } from "react-icons/fi";
import { ImFileMusic, ImFileVideo } from "react-icons/im";
import { RiHtml5Fill } from "react-icons/ri";
function getIconFileType(fileType) {
  const fileIcon = FaFileAlt
  switch (fileType) {
    case "pdf":
      return AiFillFilePdf;
    case "doc", "docx":
      return FaFileWord;
    case "txt":
      return FiFileText;
    case "png", "jpg", "jpeg", "gif", "svg":
      return FaRegFileImage;
    case "xls", "xlsx":
      return FaFileExcel;
    case "ppt", "pptx":
      return FaFilePowerpoint;
    case "zip", "rar", "7z":
      return FaFileArchive;
    case "html", "htm":
      return RiHtml5Fill;
    case "mp3", "wav", "ogg":
      return ImFileMusic;
    case "mp4", "avi", "mov", "wmv":
      return ImFileVideo;
    default:
      return fileIcon;
  }
}

export default getIconFileType