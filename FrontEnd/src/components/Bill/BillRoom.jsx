import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, Link, useParams } from 'react-router-dom'
import { Room } from '../Room/Room'


export const BillRoom = () => {
    const [reservation, setReservation] = useState([{}])
    const token = localStorage.getItem(`token`)
    const navigate = useNavigate()
    const { id } = useParams()

    const getReservation = async () => {
        try {
            const { data } = await axios(`http://localhost:3100/reservationRoom/getReservation/${id}`, {
                headers: {
                    'Authorization': token
                }
            })
            let array = []
            let room = data.reservation.rooms
            room.forEach(element => {
                array.push(element.room)
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
                    <h1>Habitaciones Contratadas</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Habitaciones reservadas</th>
                                <th>Categoria</th>
                                <th>Capacidad</th>
                                <th>Precio</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                reservation.map(({ _id, noRoom, category, peopleCapacity, price }, index) => {
                                    return (
                                        <tr key={index}>
                                            <Room
                                                noRoom={noRoom}
                                                category={category}
                                                peopleCapacity={peopleCapacity}
                                                price={price}
                                            ></Room>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                    <Link to='../billRoom'>
                        <button type="submit" className="btn btn-primary">Back</button>
                    </Link>
                </div>
            </div>
        </>
    )
}
