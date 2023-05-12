import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { ReservationRoom } from './ReservationRoom'
import { Link, useNavigate } from 'react-router-dom'


export const ReservationRoomTable = () => {
    const navigate = useNavigate()
    const [reservation, setReservation] = useState({})
    const [loading, setLoading] = useState(true)
    const token = localStorage.getItem('token')

    const LogOut = () => {
        localStorage.clear()
        navigate('/')
    }

    const getReservation = async () => {
        try {
            const { data } = await axios('http://localhost:3100/reservationroom/get', {
                headers: {
                    'Authorization': token
                }
            })
            setReservation(data.reservations)
            setLoading(false)
        } catch (err) {
            console.error(err)
        }
    }


    useEffect(() => getReservation, [])


    return (
        <div></div>
    )
}