import React from 'react'
import axios from "axios"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useState, useEffect} from "react"

export const UpdateReservationRoom = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [users, setUsers] = useState([{}])
    const [hotels, setHotels] = useState([{}])
    const token = localStorage.getItem('token')

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
            let form = {
                dateStart: document.getElementById('inputDateStart').value,
                dateEnd: document.getElementById('inputDateEnd').value,
                user: document.getElementById('inputUser').value,
                hotel: document.getElementById('inputHotel').value
            }
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
    return (
        <div className="container">
        <div className="box">
            <h1>Servicio</h1>
            <form>
                <div>
                    <i className="fa-solid fa-user"></i>
                    <input   type="date"  className="form-control"   id="inputDateStart" required/>
                </div>
                <br/>
                <div>
                    <i className="fa-solid fa-pencil"></i>
                    <input   type="date"  className="form-control"  id="inputDateEnd" required/>
                </div>
                <br/>
                <div>
                    <i className="fa-solid fa-user-shield icon side">User</i>
                    <select  className="form-control" id="inputUser"  required>
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
                    <select  className="form-control" id="inputHotel"  required>
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