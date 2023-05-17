import React, { useEffect } from 'react'
import axios from "axios"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useState } from "react"
import Swal from 'sweetalert2';

export const AddRoom = () => {
    const navigate = useNavigate()
    const token = localStorage.getItem('token')
    const [hotels, setHotels] = useState([{}])
    const [form, setForm] = useState({
        noRoom: '',
        category: '',
        peopleCapacity: '',
        price: '',
        hotel: ''
    })

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const getHotel = async () => {
        try {
            const { data } = await axios(`http://localhost:3100/hotel/get/`, {
                headers: {
                    'Authorization': token
                }
            })
            console.log(data)
            setHotels(data.hotels)
        } catch (err) {
            console.error(err)
        }
    }

    const addUser = async (e) => {
        try {
            e.preventDefault()
            console.log(form)
            const { data } = await axios.post('http://localhost:3100/room/add', form, {
                headers: {
                    'Authorization': token
                }
            })
            Swal.fire({
                title: 'Added!',
                text: 'Room added Succesfully.',
                icon: 'success'
            }),
                navigate('/dashboard/Room')
        } catch (err) {
            alert(err.response.data.message)
        }
    }

    useEffect(() => getHotel, [])

    return (
        <div className="container">
            <div className="box">
                <h1>Agregar Habitación</h1>
                <form>
                    <div>
                        <i className="fa-solid fa-user"></i>
                        <input onChange={handleChange} type="text" name='noRoom' className="form-control" placeholder='noRoom' required />
                    </div>
                    <br />
                    <div>
                        <i className="fa-solid fa-pencil"></i>
                        <input onChange={handleChange} type="text" name='category' className="form-control" placeholder='category' required />
                    </div>
                    <br />
                    <div>
                        <i className="fa-solid fa-tag"></i>
                        <input onChange={handleChange} type="number" name='peopleCapacity' className="form-control" placeholder='capacity' required />
                    </div>
                    <br />
                    <div>
                        <i className="fa-solid fa-tag"></i>
                        <input onChange={handleChange} type="number" name='price' className="form-control" placeholder='price' required />
                    </div>
                    <br />
                    <div>
                        <i className="fa-solid fa-user-shield icon side">Hotel</i>
                        <select onChange={handleChange} className="form-control" name="hotel" required>
                            {
                                hotels.map(({ _id, name }, i) => {
                                    return (
                                        <option key={i} value={_id}>{name}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <br />
                    <button onClick={(e) => addUser(e)} type="submit" className="btn btn-outline-primary">Add</button>
                    <Link to='/dashboard/room'>
                        <button type="submit" className="btn btn-outline-primary">Cancel</button>
                    </Link>
                </form>
            </div>
        </div>
    )
}
