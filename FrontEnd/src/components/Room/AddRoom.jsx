import React, { useEffect } from 'react'
import axios from "axios"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useState } from "react"
import Swal from 'sweetalert2';

export const AddRoom = () => {
    const navigate = useNavigate()
    const token = localStorage.getItem('token')
    const [hotels, setHotels] = useState([{}])

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
            let form = {
                noRoom: document.getElementById('inputNoRoom').value,
                category: document.getElementById('inputCategory').value,
                peopleCapacity: document.getElementById('inputPeopleCapacity').value,
                price: document.getElementById('inputPrice').value,
                hotel: document.getElementById('inputHotel').value
            }
            console.log(form)
            const { data } = await axios.post('http://localhost:3100/room/add', form, {
                headers: {
                    'Authorization': token
                }
            })
            if (data.message == 'Room adding to hotel sucessfully') {
                Swal.fire({
                    title: data.message,
                    icon: 'success',
                    timer: 2000
                })
            } else {
                Swal.fire({
                    title: data.message,
                    icon: 'warning',
                    timer: 2000
                })
            }
            navigate('/dashboard/Room')
        } catch (err) {
            Swal.fire({
                title: err.response.data.message,
                icon: 'error',
                timer: 2000
            })
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
                        <input type="text" id='inputNoRoom' className="form-control" placeholder='noRoom' required />
                    </div>
                    <br />
                    <div>
                    <i className="fa-solid fa-list-alt"></i>

                            <select id="inputCategory">
                                <option value="ROOM">SWITE</option>
                                <option value="EVENT">DELUXE</option>
                            </select>
                        </div>
                    <br />
                    <div>
                        <i className="fa-solid fa-tag"></i>
                        <input type="number" id='inputPeopleCapacity' className="form-control" placeholder='capacity' required />
                    </div>
                    <br />
                    <div>
                        <i className="fa-solid fa-tag"></i>
                        <input type="number" id='inputPrice' className="form-control" placeholder='price' required />
                    </div>
                    <br />
                    <div>
                        <i className="fa-solid fa-user-shield icon side">Hotel</i>
                        <select className="form-control" id="inputHotel" required>
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
