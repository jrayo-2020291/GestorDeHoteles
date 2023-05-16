import React from 'react'
import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import Swal from 'sweetalert2';


export const UpdateReservationEvent = () => {
  const [reservation, setReservation] = useState({})
  const { id } = useParams();
  const token = localStorage.getItem(`token`)
  const navigate = useNavigate()

  
  const getReservation = async()=>{
    try{
        const { data } = await axios(`http://localhost:3100/reservationEvent/getReservation/${id}` ,{
            headers: {
                'Authorization': token
            }
        })
        setReservation(data.reservation)
    }catch(err){
        console.error(err)
    }
}

const updateReservation = async(e)=>{
    try{
        e.preventDefault()
        let updatedReservation = {
            dateEvent: document.getElementById('date').value,
            hoursEvent: document.getElementById('hours').value,
        }
        const { data } = await axios.put(`http://localhost:3100/reservationEvent/updateReservation/${id}`, updatedReservation , {
            headers: {
                'Authorization': token
            }
        }
            )
        Swal.fire({
            title: data.message || 'Reservation Updated',
            icon: 'success',
            timer: 2000
          });
        navigate('/dashboard/reservationEvent')
    }catch(err){
        console.error(err)
    }
}
useEffect(()=> getReservation, [])
  return (
   
    <div className="container">
        <div className="box">
            <h1>Reservation</h1>
            <form>
                <div>
                    <i className="fa-solid fa-user"></i>
                    <input  type="date" defaultValue={reservation.dateEvent} className="form-control" placeholder='New Name' id="date" required/>
                </div>
                <br/>
                <div>
                    <i className="fa-solid fa-pencil"></i>
                    <input  type="Number" defaultValue={reservation.hoursEvent}className="form-control" id="hours" required/>
                </div>
                <br/>
                <button onClick={(e)=>  updateReservation(e)} type="submit" className="btn btn-outline-primary">Update</button>
                <Link to='/dashboard/reservationEvent'>
                <button type="submit" className="btn btn-outline-primary">Cancel</button>
                </Link>
            </form>
        </div>
    </div>
  )
}
