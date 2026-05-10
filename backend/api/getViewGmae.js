import { url_endponit } from "./data_endpoit";

export default async  function getViewGmae(id){
    //api endpoint 
    const url = url_endponit.viewGame;
    //data to passed
    const dataRequest = { id: id }
    //respose
    const res = await fetch(
        url,
        {       
        headers: {
            'Content-Type': 'application/json',
                    },            
            method: "POST", body: JSON.stringify(dataRequest)
        }, 
    );
    //data after query
    const data = await res.json();
    //return value
    return data;
    
}