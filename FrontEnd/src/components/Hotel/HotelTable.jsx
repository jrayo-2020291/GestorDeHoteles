import { Link, useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {Hotel} from './Hotel'

export const HotelTable = () => {
    const [hotel,setHotel] = useState([{}])
    const [loading, setLoading] = useState(true)
    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    const getHotels = async () => {
        try {
          const { data } = await axios('http://localhost:3100/hotel/get', {
            headers: {
              'Authorization': token
            }
          })
          setHotel(data.hotels)
          setLoading(false)
          
        } catch (err) {
          console.error(err)
        }
      };

      useEffect(() => getHotels, [])

    return (
        <>
            <section id="content">
                <main>
                    <h1 className="title">Hoteles</h1>
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
                            <Link to='../addHotel'>
                                <i className="fa-solid fa-plus add"></i>
                            </Link>
                            <br/>
                            <br/>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Ubicación</th>
                                        <th>Calificación</th>
                                        <th>Habitaciones</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                    
                                    <tbody>
                                        {
                                            hotel.map(({_id, name, locationH,qualification,numberRooms},index)=>{
                                                return(
                                                    <tr key={index}>
                                                        <Hotel
                                                            name={name}
                                                            locationH={locationH}
                                                            qualification={qualification}
                                                            numberRooms={numberRooms}
                                                        ></Hotel>
                                                        <td>
                                                            <Link to={`../updateHotel/${_id}`}>
                                                                <i className="fa-solid fa-pen button"></i>
                                                            </Link>
                                                            <i  className="fa-solid fa-trash-can button"></i>   
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
