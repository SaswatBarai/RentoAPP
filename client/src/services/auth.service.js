
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL 

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});


api.interceptors.request.use(
    (config) =>{
        const token = localStorage.getItem("accessToken");
        if(!token){
            console.error("Token not found");
        }
        else{
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) =>{
        return Promise.reject(error);
    }
);


const useFetch = (url,options={}) =>{
    const {
        method = "GET",
        body = null,
        params = null,
    } =  options;

    const [data,setData] =  useState(null);
    const[loading ,setLoading] = useState(false);
    const [error,setError] = useState(null);

    useEffect(()=>{
        const fetchData = async (url)=>{
           try {
             setLoading(true);
             const configs = {
                 method,
                 url,
             }
             if(body){
                 configs.data =  body;
             }
             if(params){
                 configs.params = params;
             }
 
             const response = await api(configs); 
             setLoading(false);
             setData(response.data);
           } catch (err) {
            setError(err );
            setLoading(false)
           }
           finally{
            setLoading(false);
           }
        }

        fetchData();
    },[url,body, method, params])

    return [data,loading,error];
}

