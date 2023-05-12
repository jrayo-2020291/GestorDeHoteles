import React from 'react'
import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import Swal from 'sweetalert2';


export const UpdateAService = () => {
  const [service, setService] = useState({})
  const { id } = useParams();
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  
  const getService = async()=>{
    try{
        const { data } = await axios(`http://localhost:3100/services/get/${id}` ,{
            headers: {
                'Authorization': token
            }
        })
        console.log(data)
        setService(data.service)
    }catch(err){
        console.error(err)
    }
}

const updateService = async(e)=>{
    try{
        e.preventDefault()
        let updatedService = {
            name: document.getElementById('inputName').value,
            description: document.getElementById('inputDescription').value,
            cost: document.getElementById('inputCost').value,
        }
        const { data } = await axios.put(`http://localhost:3100/services/update/${id}`, updatedService,{
            headers: {
                'Authorization': token
            }
        })
        Swal.fire({
            title: data.message || 'Service updated',
            icon: 'success',
            timer: 2000
          })
          if(data.message== 'This Service already exists'){ 
            Swal.fire({
                title: data.message ,
                  icon: 'warning',
                  timer: 2000
                })
          }
       navigate('/dashboard/aService')
    }catch(err){
        console.error(err)
    }
}
useEffect(()=> getService, [])
  return (
   
    <div className="container">
        <div className="box">
            <h1>Servicio</h1>
            <form>
                <div>
                    <i className="fa-solid fa-user"></i>
                    <input  type="text" defaultValue={service.name} className="form-control" placeholder='New Name' id="inputName" required/>
                </div>
                <br/>
                <div>
                    <i className="fa-solid fa-pencil"></i>
                    <input  type="text" defaultValue={service.description}className="form-control" id="inputDescription" required/>
                </div>
                <br/>
                <div>
                    <i className="fa-solid fa-tag"></i>
                    <input  type="number"defaultValue={service.cost} className="form-control" id="inputCost" required/>
                </div>
                <br/>
                <button onClick={(e)=>  updateService(e)} type="submit" className="btn btn-outline-primary">Update</button>
                <Link to='/dashboard/A_Services'>
                <button type="submit" className="btn btn-outline-primary">Cancel</button>
                </Link>
            </form>
        </div>
    </div>
  )
}