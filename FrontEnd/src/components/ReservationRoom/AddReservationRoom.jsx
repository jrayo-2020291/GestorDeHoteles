import React from 'react'
import axios from "axios"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useState, useEffect} from "react"

export const AddReservationRoom = () => {
    const navigate = useNavigate()
    const [users, setUsers] = useState([{}])
    const [hotels, setHotels] = useState([{}])
    const [rooms, setRooms] = useState([{}])
    const token = localStorage.getItem('token')
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

    const getRooms = async () => {
        try {
            const { data } = await axios(`http://localhost:3100/room/get`, {
                headers: {
                    'Authorization': token
                }
            })
            setRooms(data.rooms)
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
            const { data } = await axios.post('http://localhost:3100/reservationroom/add', form, {
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
    useEffect(() =>getRooms, [])
    return (
        <div className="container">
        <div className="box">
            <h1>Servicio</h1>
            <form>
                <div>
                    <i className="fa-solid fa-user"></i>
                    <input  onChange={handleChange} type="date" name='dateStart' className="form-control"  id="inputdateStart" required/>
                </div>
                <br/>
                <div>
                    <i className="fa-solid fa-pencil"></i>
                    <input  onChange={handleChange} type="date" name='dateEnd'  className="form-control" id="inputdateEnd" required/>
                </div>
                <br/>
                <div>
                    <i className="fa-solid fa-tag"></i>
                    <input  onChange={handleChange} type="number" name='cost'  className="form-control" id="inputCost" required/>
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
                <div>
                    <i className="fa-solid fa-user-shield icon side">Room</i>
                    <select onChange={handleChange} className="form-control" id="inputRoom" name='room' required>
                    {
                           rooms.map(({_id, noRoom}, i)=>{
                            return (
                                <option key={i} value={_id}>{noRoom}</option>
                            )
                           }) 
                        }
                    </select>
                </div>
                <button onClick={(e)=>  addReservationRoom(e)} type="submit" className="btn btn-outline-primary">Add</button>
                <Link to='/dashboard/reservationRoom'>
                <button type="submit" className="btn btn-outline-primary">Cancel</button>
                </Link>
            </form>
        </div>
    </div>
    )
}