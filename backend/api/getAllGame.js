import { url_endponit } from "./data_endpoit";

export default async function getAllGames(){
    //get endpoint url
    const url = url_endponit.search;
    try{
        //response
        const res = await fetch(url , { method: "GET" } );
        //get valie await data from json
        const data = await res.json()
        //return data
        // console.log(data)
        return data;
    }catch(e){
        console.error(e)
    }
    
}