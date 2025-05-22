
import { useDispatch } from "react-redux"
import React from 'react'
import { setNav } from "@/state/slices/hideNavSlice";
import { useEffect } from "react";

function HomePage() {

  const dispatch = useDispatch();
  
  useEffect(()=>{
         dispatch(setNav({hide:false}))
     })

  return (
    <div
   
    >HomePage</div>
  )
}

export default HomePage