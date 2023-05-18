import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Event } from './Event'
import Swal from 'sweetalert2';

export const EventTable = () => {

    const [event, setEvent] = useState([{}])
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    const [hotels, setHotels] = useState([{}])
    const role = localStorage.getItem('role')
    const [show, setShow] = useState(false)

    const getHotels = async () => {
        try {
            const { data } = await axios(`http://localhost:3100/hotel/get`, {
                headers: {
                    'Authorization': token
                }
            })
            setHotels(data.hotels)
        } catch (err) {
            console.error(err)
        }
    }

    const getByHotel = async (e) => {
        try {
            e.preventDefault()
            let hotel = document.getElementById('inputHotel').value
            if (hotel === 'ALL') {
                return getEvents()

            }
            const { data } = await axios(`http://localhost:3100/hotel/getById/${hotel}`, {
                headers: {
                    'Authorization': token
                }
            })
            if (data) {
                setEvent(data.events)
            }

        } catch (err) {
            console.error(err)
        }
    }

    const restringir = () => {
        if (role === 'ADMIN') {
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
            setEvent(data.events)
        } catch (err) {
            console.error(err)
        }
    };

    const deleteEvent = async (id) => {
        try {
            const result = await Swal.fire({
                title: 'you are sure?',
                text: 'Delete Event',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'YES',
                cancelButtonText: 'CANCEL',
              });
                if (result.isConfirmed) {
                    const { data } = await axios.delete(`http://localhost:3100/events/delete/${id}`, {
                        headers: {
                            'Authorization': token
                        }
                    })
                    getEvents()
                if(data.message=== 'Event deleted'){ 
                  Swal.fire({
                      title: data.message ,
                        icon: 'success',
                        timer: 2000
                  })
              }else{
                Swal.fire({
                    title: data.message ,
                      icon: 'warning',
                      timer: 2000
                })
            }
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    Swal.fire('CANCEL', 'The event was not deleted', 'error');
                  }
        } catch (err) {
            console.error(err)
            alert(err.response.data.message)
        }
    }
    useEffect(() => getEvents, [])
    useEffect(() => getHotels, [])
    useEffect(() => restringir, [])

    return (

        <>
            {/* <section id="content"> */}
            <main>
                <h1 className="title">Eventos</h1>
                <ul className="breadcrumbs">
                    {
                        show ? (
                            <li><a href="#">Administrador</a></li>
                        ) : (<li><a href="#">User</a></li>)
                    }
                    <li className="divider">/</li>
                    <li><a href="#" className="active">Gestor de Hoteles</a></li>
                </ul>
                <br />
                <div className="info-data">
                    <div className="menu">
                        <div className="sub-menu">
                        </div>
                        <br />
                        {
                            show ? (
                                <Link to='../addEvent'>
                                    <i className="fa-solid fa-plus add"></i>
                                </Link>
                            ) : (<></>)
                        }
                        <br />
                        <br />
                        <form action="#">
                            <div className="form-group">
                                <i className="fa-solid fa-user-shield icon side">Hotels</i>
                                <select className="form-control" id="inputHotel" required>
                                    {
                                        hotels.map(({ _id, name }, i) => {
                                            return (
                                                <option key={i} value={_id}>{name}</option>
                                            )
                                        })
                                    }
                                    <option value="ALL">Todos</option>
                                </select>
                                <button className='button' onClick={(e) => getByHotel(e)}>Buscar</button>
                            </div>
                        </form>
                        <br />
                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Descripción</th>
                                    <th>Costo por hora</th>
                                    {
                                        show ? (
                                            <th>Acciones</th>
                                        ) : (<></>)
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    event.map(({ _id, name, description, costPerHour }, index) => {
                                        return (
                                            <tr key={index}>
                                                <Event
                                                    name={name}
                                                    description={description}
                                                    costPerHour={costPerHour}
                                                ></Event>
                                                {
                                                    show ? (
                                                        <td>
                                                            <Link to={`../updateEvent/${_id}`}>
                                                                <i className="fa-solid fa-pen button"></i>
                                                            </Link>
                                                            <i onClick={() => deleteEvent(_id)} className="fa-solid fa-trash-can button"></i>
                                                        </td>
                                                    ) : (<></>)
                                                }
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
            {/* </section> */}
        </>
    )
}