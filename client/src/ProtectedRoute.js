import React, { useEffect } from 'react'
import {useNavigate} from 'react-router-dom'

const ProtectedRoute = ({Component}) => {
    const navigate = useNavigate();
    useEffect(() => {
      const currentUser = localStorage.getItem("authToken");
      if(!currentUser){
          navigate("/signin")
      }
    }, [])
    
  return (
    <><Component/></>
  )
}

export default ProtectedRoute