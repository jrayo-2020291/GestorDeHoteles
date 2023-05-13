import React from 'react'
import axios from "axios"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useState, useEffect} from "react"

export const UpdateReservationRoom = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [users, setUsers] = useState([{}])
    const [hotels, setHotels] = useState([{}])
    const [reservation, setReservation] = useState([{}])
    const token = localStorage.getItem('token')
    const [form, setForm] = useState({
        dateStart: '',
        dateEnd: '',
        cost: '',
    })

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const getReservation = async () => {
        try {
            const { data } = await axios(`http://localhost:3100/reservationRoom/getReservation/${id}`, {
                headers: {
                    'Authorization': token
                }
            })
            setReservation(data.reservation)
        } catch (err) {
            console.error(err)
        }
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

    const updateReservationRoom = async (e) => {
        try {
            e.preventDefault()
            setForm({
                user: document.getElementById('inputUser'),
                hotel: document.getElementById('inputHotel')
            })
            const { data } = await axios.put(`http://localhost:3100/reservationRoom/updateReservation/${id}`, form, {
                headers: {
                    'Authorization': token
                }
            })
            alert(data.message)
            navigate('/dashboard/reservationRoom')
        } catch (err) {
            alert(err.response.data.message)
        }
    }

    useEffect(() =>getUsers, [])
    useEffect(() =>getHotels, [])
    useEffect(() =>getReservation, [])
    return (
        <div className="container">
        <div className="box">
            <h1>Servicio</h1>
            <form>
                <div>
                    <i className="fa-solid fa-user"></i>
                    <input  onChange={handleChange} type="date" name='dateStart' defaultValue={reservation.dateStart} className="form-control"  id="inputdateStart" required/>
                </div>
                <br/>
                <div>
                    <i className="fa-solid fa-pencil"></i>
                    <input  onChange={handleChange} type="date" name='dateEnd' defaultValue={reservation.dateEnd} className="form-control" id="inputdateEnd" required/>
                </div>
                <br/>
                <div>
                    <i className="fa-solid fa-tag"></i>
                    <input  onChange={handleChange} type="number" name='cost' defaultValue={reservation.cost} className="form-control" id="inputCost" required/>
                </div>
                <br/>
                <div>
                    <i className="fa-solid fa-user-shield icon side">User</i>
                    <select onChange={handleChange} className="form-control" id="inputUser" name='user' required>
                    {
                           users.map(({_id, name }, i)=>{
                            return (
                                <option key={i} value={_id}>{name}</option>
                            )
                           }) 
                        }
                    </select>
                </div>
                <br />
                <div>
                    <i className="fa-solid fa-user-shield icon side">Hotels</i>
                    <select onChange={handleChange} className="form-control" id="inputHotels" name='hotel' required>
                    {
                           hotels.map(({_id, name }, i)=>{
                            return (
                                <option key={i} value={_id}>{name}</option>
                            )
                           }) 
                        }
                    </select>
                </div>
                <br />
                <button onClick={(e)=>  updateReservationRoom(e)} type="submit" className="btn btn-outline-primary">Update</button>
                <Link to='/dashboard/reservationRoom'>
                <button type="submit" className="btn btn-outline-primary">Cancel</button>
                </Link>
            </form>
        </div>
    </div>
    )
}