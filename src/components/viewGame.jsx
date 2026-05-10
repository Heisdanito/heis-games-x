import React, { useEffect, useState } from 'react'
import ReadyGameCardData from './ReagyGameComponent'
import { useParams } from 'react-router-dom'
import getViewGmae from '../../backend/api/getViewGmae'
import { url_endponit } from '../../backend/api/data_endpoit'

export default function ViewGame() {

  const { data } = useParams()
  const [loading , setLoading] = useState(true);
  const [details , setDetails] = useState(null);
  

  useEffect(() => {
      const fetchData = async () => {
        try{
          const url = url_endponit.viewGame;

          const response = await getViewGmae(data)
          setDetails(response) 
        }catch(e){
          console.error(e)
        }finally{
          setLoading(false)
        }
      }

    fetchData();
  },[details]
  );

  if(loading == false ){
    return (
      <>
      <ReadyGameCardData 
        name={details.title}
        category={details.type}
        img={details.img}
        description={details.description}
        id={details.id}
        file={details.torrent}
    />
      </>
      
    )
  }
}
