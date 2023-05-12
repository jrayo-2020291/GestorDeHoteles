import React from 'react'
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import Swal from 'sweetalert2';


export const AddAService = () => {
    const token = localStorage.getItem('token')
    const title = 'ADD SERVICE'
    const navigate = useNavigate()
    const addService = async(e)=>{
        try{
            e.preventDefault()
            let service = {
                name: document.getElementById('name').value,
                cost: document.getElementById('cost').value,
                description: document.getElementById('description').value,
            }
            const { data } = await axios.post('http://localhost:3100/services/addService', service,  {
                headers: {
                    'Authorization': token
                }
            })
            Swal.fire({
                title: data.message || 'Service creates',
                icon: 'success',
                timer: 2000
              })
              if(data.message== 'This service already exist'){ 
                Swal.fire({
                    title: data.message ,
                      icon: 'warning',
                      timer: 2000
                    })
              }
            
              
            navigate('/dashboard/aService')
        }catch(err){
            alert(err.response.data.message)
        }
    }
  return (
    <>
    <div className="container">
        <div className="box">
            <h1>Servicio</h1>
            <form>
                <div>
                    <i className="fa-solid fa-user"></i>
                    <input type="text" placeholder="Nombre" id='name'/>
                </div>
                <br/>
                <div>
                    <i className="fa-solid fa-pencil"></i>
                    <input type="text" placeholder="Descripción" id='description'/>
                </div>
                <br/>
                <div>
                    <i className="fa-solid fa-tag"></i>
                    <input type="number" placeholder="Precio" id='cost'/>
                </div>
                <br/>
                <button onClick={(e)=>  addService(e)} type="submit" className="btn btn-primary">Add</button>
                <Link to='/dashboard/aService'>
                <button type="submit" className="btn btn-primary">Cancel</button>
                </Link>
            </form>
        </div>
    </div>
    </>
  )
}