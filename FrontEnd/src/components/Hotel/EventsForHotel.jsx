import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, Link, useParams } from 'react-router-dom'
import { Event } from '../Event/Event';
import Swal from 'sweetalert2';

export const EventForHotel = () => {
    const [events,setEvents] = useState([{}])
    const [event,setEvent] = useState([{}])
    const role = localStorage.getItem('role')
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(true)
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    const {id} = useParams();

    const restringir = () => {
        if (role === 'ADMIN' ) {
          setShow(true)
        }
    }

    const getEvents = async () => {
        try {
          const { data } = await axios('http://localhost:3100/events/getEvents', {
            headers: {
              'Authorization': token
            }
          })
          setEvents(data.events)
          setLoading(false)
        } catch (err) {
          console.error(err)
        }
      };

    const getEventsForHotel = async () => {
        try {
          const { data } = await axios(`http://localhost:3100/hotel/getById/${id}`, {
            headers: {
              'Authorization': token
            }
          })
          setEvent(data.events)
          setLoading(false)
        } catch (err) {
          console.error(err)
        }
    };

    const deleteEvent = async (idEvent) => {
        try {
          let confirmDelete = confirm('Estás seguro de eliminar este evento?')
          if (confirmDelete) {
            const { data } = await axios.put(`http://localhost:3100/hotel/deleteEvent/${id}`, {event:idEvent},{
              headers: {
                  'Authorization': token
              }
          })
            getEventsForHotel();
            Swal.fire({
                title: data.message || 'Deleting sucessfully',
                icon: 'success',
                timer: 2000
              })
          }
        } catch (err) {
          console.error(err)
          alert(err.response.data.message)
        }
    }
    
    const addEvent = async(e) => {
        try {
            e.preventDefault()
            let event = {
                event: document.getElementById('event').value
            }
            const { data } = await axios.put(`http://localhost:3100/hotel/addEvent/${id}`, event,{
                headers: {
                    'Authorization': token
                }
            })
            Swal.fire({
                title: data.message || 'Adding event sucessfully',
                icon: 'success',
                timer: 2000
              })
              getEventsForHotel()
            getEvents()
        } catch (err) {
          console.error(err)
          alert(err.response.data.message)
        }
    }

    useEffect(() => getEventsForHotel, [])
    useEffect(() => getEvents, [])
    useEffect(() => restringir, [])

    return(
        <>
            {/* <section id="content"> */}
            <br /><br /><br /><br />
                <main>
                    <h1 className="title">Agregar evento</h1>
                        <ul className="breadcrumbs">
                            {
                                show ?(
                                    <li><a href="#">Administrador</a></li>
                                ):(<></>)
                            }
                            <li className="divider">/</li>
                            <li><a href="#" className="active">Gestor de Hoteles</a></li>
                        </ul>
                    <br/> 
                    <div className="info-data">
                        <div className="menu">
                            <div className="sub-menu">
                            </div>
                            <br/>
                            <br/>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Descripción</th>
                                        <th>Costo por hora</th>
                                        {
                                            show ? (
                                                <th>Acciones</th>
                                            ):(<></>)
                                        }
                                    </tr>
                                </thead>
                                    <tbody>
                                        { 
                                            event.map(({_id, name, description,costPerHour},index)=>{
                                                return(
                                                    <tr key={index}>
                                                        <Event
                                                            name={name}
                                                            description={description}
                                                            costPerHour={costPerHour}
                                                        ></Event>
                                                        {
                                                            show ? (
                                                                <td>
                                                                    <i onClick={()=>deleteEvent(_id)} className="fa-solid fa-trash-can button"></i>   
                                                                </td>
                                                            ):(<></>)
                                                        }
                                                    </tr>
                                                    
                                                )
                                            })
                                        }
                                    </tbody>
                            </table>
                            <br />
                            <br />
                            <br />
                            <form>
                                {
                                    show ? (
                                        <>
                                            <div>
                                                <i className="fa-solid fa-user-shield icon side">Eventos</i>
                                                <select className="form-control" id="event" required>
                                                    {
                                                        events.map(({ _id, name }, i) => {
                                                            return (
                                                                <option key={i} value={_id}>{name}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                            <br />
                                            <button onClick={(e) => addEvent(e)} type="submit" className="btn btn-primary">Add</button>
                                        </>
                                    ):(<></>)
                                }
                                <Link to='/dashboard/hotel'>
                                    <button  type="submit" className="btn btn-primary">Volver</button>
                                </Link>
                            </form>
                        </div>
                    </div>
                </main>
            {/* </section> */}
        </>
    )
}