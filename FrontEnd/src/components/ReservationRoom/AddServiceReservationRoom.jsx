import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, Link, useParams } from 'react-router-dom'
import { Aservice } from '../AServices/Aservice'
import Swal from 'sweetalert2';


export const AddServiceReservationRoom = () => {
    const [services, setServices] = useState([{}])
    const [reservation, setReservation] = useState([{}])
    const token = localStorage.getItem(`token`)
    const navigate = useNavigate()
    const { id } = useParams()

    const getServices = async (e) => {
        try {
            let form = {
                category: 'ROOM'
            }
            const { data } = await axios.post(`http://localhost:3100/services/getCategory`, form, {
                headers: {
                    'Authorization': token
                }
            })
            setServices(data.services)
        } catch (err) {
            console.error(err)
        }
    }

    const deleteService = async (idService) => {
        try {
          let confirmDelete = confirm('Estás seguro de eliminar este evento?')
          if (confirmDelete) {
            const { data } = await axios.put(`http://localhost:3100/reservationRoom/removeService/${id}`, { service: idService }, {
              headers: {
                'Authorization': token
              }
            })
            getReservation();
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

    const getReservation = async () => {
        try {
            const { data } = await axios(`http://localhost:3100/reservationRoom/getReservation/${id}`, {
                headers: {
                    'Authorization': token
                }
            })
            let array = []
            let service = data.reservation.additionalServices
            service.forEach(element => {
                array.push(element.service)
            })
            setReservation(array)
        } catch (err) {
            console.error(err)
        }
    }

    const updateReservation = async (e) => {
        try {
            e.preventDefault()
            let updatedReservation = {
                service: document.getElementById('inputService').value
            }
            const { data } = await axios.put(`http://localhost:3100/reservationRoom/addService/${id}`, updatedReservation,
                {
                    headers: {
                        'Authorization': token
                    }
                })
            Swal.fire({
                title: data.message || 'Service Added',
                icon: 'success',
                timer: 2000
            })
            if (data.message == 'Service already contrated') {
                Swal.fire({
                    title: data.message,
                    icon: 'success',
                    timer: 2000
                  })
                  
                  getReservation();
        }} catch (err) {
            console.error(err)
        }
    }

    useEffect(() => getServices, [])
    useEffect(() => getReservation, [])


    return (
        <>
            <div className="container">
                <div className="box">
                    <h1>Agregar Servicios Adicionales</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Servicios Contratados</th>
                                <th>Descripción</th>
                                <th>Costo</th>
                                <th>Categoria</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                reservation.map(({ _id, name, description, cost, category }, index) => {
                                    return (
                                        <tr key={index}>
                                            <Aservice
                                                name={name}
                                                description={description}
                                                cost={cost}
                                                category={category}
                                            ></Aservice>
                                            <td>
                                                <i onClick={() => deleteService(_id)} className="fa-solid fa-trash-can button"></i>
                                            </td>
                                        </tr>
                                    )
                                })
                            }

                        </tbody>
                    </table>
                    <form>
                        <div>
                            <i className="fa-solid fa-user-shield icon side">Servicio</i>
                            <select className="form-control" id="inputService" required>
                                {
                                    services.map(({ _id, name }, i) => {
                                        return (
                                            <option key={i} value={_id}>{name}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <br />
                        <button onClick={(e) => updateReservation(e)} type="submit" className="btn btn-primary">Add</button>
                        <Link to='../reservationRoom'>
                            <button type="submit" className="btn btn-primary">Cancel</button>
                        </Link>

                    </form>
                </div>
            </div>
        </>
    )
}
