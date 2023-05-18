import React from 'react'
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import Swal from 'sweetalert2';


export const AddReservationEvent = () => {
    const token = localStorage.getItem('token')
    const [hotel, setHotels] = useState([{}])
    const [events, setEvents] = useState([{}])
    const title = 'ADD RESERVATION'
    const navigate = useNavigate()

    const getHotels = async()=>{
        try{
            const { data } = await axios('http://localhost:3100/hotel/get' ,
            {
                headers: {
                    'Authorization': token
                }
            })
            setHotels(data.hotels)
        }catch(err){
            console.error(err);
        }
    }

    const getEvents = async()=>{
        try{
            const { data } = await axios('http://localhost:3100/events/getEvents' ,
            {
                headers: {
                    'Authorization': token
                }
            })
            setEvents(data.events)
        }catch(err){
            console.error(err);
        }
    }
    const addReservation = async(e)=>{
        try{
            e.preventDefault()
            let reservation = {
                dateEvent: document.getElementById('date').value,
                hoursEvent: document.getElementById('hours').value,
                hotel:document.getElementById('hotel').value,
                event:document.getElementById('event').value
            }
            const { data } = await axios.post('http://localhost:3100/reservationEvent/addReservation', reservation,  {
                headers: {
                    'Authorization': token
                }
            })
            Swal.fire({
                title: data.message || 'Reservation created',
                icon: 'success',
                timer: 2000
              })
              if(data.message== 'Only clients can have a reservation'){ 
                Swal.fire({
                    title: data.message ,
                      icon: 'warning',
                      timer: 2000
                    })
              }
            
              
            navigate('/dashboard/reservationEvent')
        }catch(err){
            alert(err.response.data.message)
        }
    }
    useEffect(()=> getHotels, [])
    useEffect(()=> getEvents, [])

  return (
    <>
    <div className="container">
        <div className="box">
            <h1>Agregar Reservación</h1>
            <form>
                <div>
                    <i className="fa-solid fa-user"></i>
                    <input type="date" placeholder="Fecha" id='date'/>
                </div>
                <br/>
                <div>
                    <i className="fa-solid fa-pencil"></i>
                    <input type="Number" placeholder="Horas" id='hours'/>
                </div>
                <br/>
                <div>
                    <i className="fa-solid fa-user-shield icon side">Evento</i>
                    <select className="form-control" id="event" required>
                    {
                           events.map(({_id, name}, i)=>{
                            return (
                                <option key={i} value={_id}>{name}</option>
                            )
                           }) 
                        }
                    </select>
                </div>
                <br />
                <div>
                    <i className="fa-solid fa-user-shield icon side">Hotel</i>
                    <select className="form-control" id="hotel" required>
                    {
                           hotel.map(({_id, name}, i)=>{
                            return (
                                <option key={i} value={_id}>{name}</option>
                            )
                           }) 
                        }
                    </select>
                </div>
                <br />
                <button onClick={(e)=>  addReservation(e)} type="submit" className="btn btn-primary">Add</button>
                <Link to='/dashboard/reservationEvent'>
                <button type="submit" className="btn btn-primary">Cancel</button>
                </Link>
            </form>
        </div>
    </div>
    </>
  )
}