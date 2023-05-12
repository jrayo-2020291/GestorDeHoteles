import React, { useEffect, useState } from 'react'
import axios from 'axios'
import imgLoading from '../../assets/Loading.gif'
import { User } from './User'
import { Link, useNavigate } from 'react-router-dom'


export const ReservationRoomTable = () => {
    const navigate = useNavigate()
    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(true)
    const token = localStorage.getItem('token')

    const LogOut = () => {
        localStorage.clear()
        navigate('/')
    }

    const getUser = async () => {
        try {
            const { data } = await axios('http://localhost:3100/user/get', {
                headers: {
                    'Authorization': token
                }
            })
            setUser(data.users)
            setLoading(false)
        } catch (err) {
            console.error(err)
        }
    }


    useEffect(() => getUser, [])
    if (loading) {
        return (
            <img src={imgLoading} alt='Loading...' />
        )
    }

    return (
        <div></div>
    )
}