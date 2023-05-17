import React from 'react'
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import Swal from 'sweetalert2';

export const AddEvent = () => {
    const navigate = useNavigate()
    const title = 'ADD EVENT';
    const token = localStorage.getItem(`token`)

    const addEvent = async(e)=>{
        try {
            e.preventDefault()
            let event = {
                name: document.getElementById('name').value,
                description: document.getElementById('description').value,
                costPerHour: document.getElementById('costPerHour').value
            }
            const { data } = await axios.post('http://localhost:3100/events/addEvent', event,
            {
                headers: {
                    'Authorization': token
                }
            })
            Swal.fire({
                title: data.message || 'New Event Created',
                icon: 'success',
                timer: 2000
              })
              if(data.message== 'This event already exist'){ 
                Swal.fire({
                    title: data.message ,
                      icon: 'warning',
                      timer: 2000
                    })
              }
            navigate('/dashboard/event')
        } catch (err) {
            alert(err.response.data.message)
        }
    }

    return (
        <>
            <div className="container">
                <div className="box">
                    <h1>Agregar Evento</h1>
                    <form>
                        <div>
                            <i className="fa-solid fa-user"></i>
                            <input type="text" placeholder="name" id='name'/>
                        </div>
                        <br/>
                        <div>
                            <i className="fa-solid fa-user-clock"></i>
                            <input type="text" placeholder="description" id='description'/>
                        </div>
                        <br/>
                        <div>
                            <i className="fa-solid fa-id-card"></i>
                            <input type="number" placeholder="costPerHour" id='costPerHour'/>
                        </div>
                        <br/>
                        <button onClick={(e)=>  addEvent(e)} type="submit" className="btn btn-primary">Add</button>
                        <Link to='/dashboard/event'>
                            <button  type="submit" className="btn btn-primary">Cancel</button>
                        </Link>
                        
                    </form>
                </div>
            </div>
            </>
    )
}
