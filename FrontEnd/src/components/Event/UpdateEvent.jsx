import React from 'react'
import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import Swal from 'sweetalert2';

export const UpdateEvent = () => {
    const [event, setEvent] = useState([{}])
    const {id} = useParams();
    const token = localStorage.getItem(`token`)
    const navigate = useNavigate();

    const getEvent = async ()=>{
        try {
            const {data} = await axios(`http://localhost:3100/events/get/${id}`,{
                headers: {
                    'Authorization': token
                }
            })
            setEvent(data.event)
        } catch (err) {
            console.error(err)
        }
    }

    const updateEvent = async(e)=>{
        try {
            e.preventDefault()
            let updateEvent = {
                name:document.getElementById('name').value,
                description: document.getElementById('description').value,
                costPerHour: document.getElementById('costPerHour').value
            }
            const { data } = await axios.put(`http://localhost:3100/events/update/${id}`, updateEvent , {
              headers: {
                  'Authorization': token
              }
            });
            Swal.fire({
                title: data.message || 'Event updated',
                icon: 'success',
                timer: 2000
              })
            navigate('/dashboard/event')
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(()=> getEvent , [])


    return (
        <>
            <div className="container">
                <div className="box">
                    <h1>Evento</h1>
                    <form>
                        <div>
                            <i className="fa-solid fa-user"></i>
                            <input defaultValue={event.name} type="text" placeholder="name" className="form-control" id="name" required/>
                        </div>
                        <br/>
                        <div>
                            <i className="fa-solid fa-user-clock"></i>
                            <input defaultValue={event.description} type="text" placeholder="description" className="form-control" id="description" required/>
                        </div>
                        <br/>
                        <div>
                            <i className="fa-solid fa-id-card"></i>
                            <input defaultValue={event.costPerHour} type="number" placeholder="costPerHour" className="form-control" id="costPerHour" required/>
                        </div>
                        <br/>
                        <button onClick={(e)=>  updateEvent(e)} type="submit" className="btn btn-outline-primary">Update</button>
                        <Link to='/dashboard/event'>
                            <button  type="submit" className="btn btn-outline-primary">Cancel</button>
                        </Link>
                        
                    </form>
                </div>
            </div>
        </>
    )
}
