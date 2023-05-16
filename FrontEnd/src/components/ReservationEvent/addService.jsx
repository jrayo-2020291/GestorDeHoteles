import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, Link, useParams } from 'react-router-dom'
import { Aservice } from '../AServices/Aservice'

export const AddService = () => {
    const [services, setServices] = useState([{}])
    const [reservation, setReservations] = useState([{}])
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    const { id } = useParams()

    const getServices = async () => {
      try {
        const { data } = await axios('http://localhost:3100/services/getServices', {
          headers: {
            'Authorization': token
          }
        })
        setServices(data.services)
        console.log(services)
      } catch (err) {
        console.error(err)
      }
    }
    const getReservation = async () => {
        try {
            const { data } = await axios.get(`http://localhost:3100/reservationEvent/getReservation/${id}`, {
                headers: {
                    'Authorization': token
                }
            })
            let array = []
            let services = data.reservation.additionalServices
            services.forEach(element=>{
                array.push(element.services)
            })
            console.log(array)
            setReservations(array)
        } catch (err) {
            console.error(err)
        }
    }
    const UpdateReservation = async (e) => {
        try {
            e.preventDefault()
            let updatedReservatiom = {
                services: document.getElementById('inputService').value
            }
            const { data } = await axios.put(`http://localhost:3100/reservationEvent/addService/${id}`, updatedReservatiom,
                {
                    headers: {
                        'Authorization': token
                    }
                })
            alert(`${data.message}`)
            navigate('/dashboard/Lease')
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => getServices, [])
    useEffect(() => getReservation, [])
   
    return (
        <>
            <div className="container">
                <div className="box">
                    <h1>Arrendamiento</h1>
                    <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Precio</th>
                </tr>
              </thead>
              <tbody>
                {
                  services.map(({ _id, name, description, cost}, index) => {
                    return (
                      <tr key={index}>
                        <Aservice
                          name={name}
                          description={description}
                          cost={cost}
                        ></Aservice>
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
                        <button onClick={(e) => UpdateReservation(e)} type="submit" className="btn btn-primary">Add</button>
                        <Link to='/dashboard/Lease'>
                            <button type="submit" className="btn btn-primary">Cancel</button>
                        </Link>

                    </form>
                </div>
            </div>
        </>
    )
}
