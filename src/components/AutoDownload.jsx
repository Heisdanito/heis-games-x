import {  useParams } from 'react-router-dom'
import { url_endponit } from '../../backend/api/data_endpoit'

export default function AutoDownload() {
  const { game } = useParams()
  const downloadLink = `${url_endponit.downloadLink}`;

  return(
    <>
    <a
        style={{
            width: 900,
            height: 300,
            borderRadius: "50px",
            backgroundColor: "white",
        }} 
        href={downloadLink+game+".torrent"}
        download={game+".torrent"}
    >
        Download
    </a>
    </>

  )


}
