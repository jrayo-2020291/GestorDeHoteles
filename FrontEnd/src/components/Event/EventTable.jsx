import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {Event} from './Event'

export const EventTable = () => {

    const [event,setEvent] = useState({})
    const [loading, setLoading] = useState(true)
    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    const LogOut = ()=>{
		localStorage.clear()
		navigate('/')
	}

    const getEvents = async () => {
        try {
          const { data } = await axios('http://localhost:3100/events/getEvents', {
            headers: {
              'Authorization': token
            }
          })
          console.log(data)
          setEvent(data.events)
          setLoading(false)
          console.log(data)
        } catch (err) {
          console.error(err)
        }
      }

      useEffect(() => getEvents, [])

     

    return (

        <>
            <section id="content">
                <main>
                    <h1 className="title">Eventos</h1>
                        <ul className="breadcrumbs">
                            <li><a href="#">Administrador</a></li>
                            <li className="divider">/</li>
                            <li><a href="#" className="active">Gestor de Hoteles</a></li>
                        </ul>
                    <br/> 
                    <div className="info-data">
                        <div className="menu">
                            <div className="sub-menu">
                            </div>
                            <br/>
                            <Link to ='../addEvent'>
                                <i className="fa-solid fa-plus add"></i>
                            </Link>
                            <br/>
                            <br/>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Descripción</th>
                                        <th>Costo por hora</th>
                                        <th>Acciones</th>
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
                                                        <td>
                                                            <Link to={`../updateEvent/${_id}`}>
                                                                <i className="fa-solid fa-pen button"></i>
                                                            </Link>
                                                            <i className="fa-solid fa-trash-can button"></i>   
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </section>
        </>
    )
}
