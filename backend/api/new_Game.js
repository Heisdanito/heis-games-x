 import { url_endponit } from "./data_endpoit";

export default async function getNewGame(dataPushed){
    //declaring api endpoint
    const url = url_endponit.newBanner;

    //fetching from database
    try{
        const res  = await fetch( url , { method: "GET" });
        const data = await res.json();

        //send data as a value using return keyword
        return data;
    }catch(e){
        console.error(e)
    }

}

