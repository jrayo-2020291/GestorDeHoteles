import React from 'react'
import axios from "axios"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useState, useEffect} from "react"

export const AddReservationRoom = () => {
    const navigate = useNavigate()
    const [users, setUsers] = useState({})
    const [hotels, setHotels] = useState({})
    const [form, setForm] = useState({
        dateStart: '',
        dateEnd: '',
        cost: '',
        user: '',
        hotel: '',
        room: ''
    })

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const getUsers = async () => {
        try {
            const { data } = await axios(`http://localhost:3100/user/get`, {
                headers: {
                    'Authorization': token
                }
            })
            setUsers(data.users)
        } catch (err) {
            console.error(err)
        }
    }
    
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

    const addReservationRoom = async (e) => {
        try {
            e.preventDefault()
            const { data } = await axios.post('http://localhost:3100/reservationroom/add', form)
            alert(data.message)
            navigate('/dashboard/reservationRoom')
        } catch (err) {
            alert(err.response.data.message)
        }
    }

    useEffect(() =>getUsers(), [])
    useEffect(() =>getHotels(), [])
    return (
        <div></div>
    )
}