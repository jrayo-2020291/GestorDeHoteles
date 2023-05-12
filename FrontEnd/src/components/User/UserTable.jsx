import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { User } from './User'
import { Link, useNavigate } from 'react-router-dom'


export const UserTable = () => {
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

    return (
        <div></div>
    )
}