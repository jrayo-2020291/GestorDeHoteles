import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, Link, useParams } from 'react-router-dom'
import { Aservice } from '../AServices/Aservice'


export const EventService = () => {
    const [reservation, setReservation] = useState([{}])
    const token = localStorage.getItem(`token`)
    const navigate = useNavigate()
    const { id } = useParams()

    const getReservation = async () => {
        try {
            const { data } = await axios(`http://localhost:3100/reservationEvent/getReservation/${id}`, {
                headers: {
                    'Authorization': token
                }
            })
            console.log(data)
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

    useEffect(() => getReservation, [])


    return (
        <>
            <div className="container">
                <div className="box">
                    <h1>Servicios Adicionales Contratados</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Servicios Contratados</th>
                                <th>Descripción</th>
                                <th>Costo</th>
                                <th>Categoria</th>
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
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                    <Link to='../BillEvent'>
                        <button type="submit" className="btn btn-primary">Back</button>
                    </Link>
                </div>
            </div>
        </>
    )
}
