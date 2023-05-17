import React from 'react'
import axios from "axios"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import Swal from 'sweetalert2';

export const UpdateRoom = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [room, setRoom] = useState({})
    const [hotels, setHotels] = useState([{}])
    const token = localStorage.getItem('token')

    const getRoom = async () => {
        try {
            const { data } = await axios(`http://localhost:3100/room/get/${id}`, {
                headers: {
                    'Authorization': token
                }
            })
            setRoom(data.room)
        } catch (err) {
            console.error(err)
        }
    }

    const getHotel = async()=>{
        try{
            const { data } = await axios(`http://localhost:3100/hotel/get/` ,{
                headers: {
                    'Authorization': token
                }
            })
            console.log(data)
            setHotels(data.hotels)
        }catch(err){
            console.error(err)
        }
    }

    const updateRoom = async (e) => {
        try {
            e.preventDefault()
            let update = {
                noRoom: document.getElementById('inputNoRoom').value,
                category: document.getElementById('inputCategory').value,
                capacity: document.getElementById('inputCapacity').value,
                price: document.getElementById('inputPrice').value,
                hotel: document.getElementById('inputHotel').value
            }
            const { data } = await axios.put(`http://localhost:3100/room/update/${id}`, update, {
                headers: {
                    'Authorization': token
                }
            })
            Swal.fire({
                title: 'Updated!',
                text: 'Room updated Succesfully.',
                icon: 'success'
              }),            navigate('/dashboard/room')
        } catch (err) {
            alert(err.response.data.message)
        }
    }

    useEffect(() => getRoom, [])
    useEffect(()=> getHotel, [])

    return (
        <div className="container">
            <div className="box">
                <h1>Actualizar Habitación</h1>
                <form>
                    <div>
                        <i className="fa-solid fa-user"></i>
                        <input  type="text"  id='inputNoRoom' className="form-control" defaultValue={room.noRoom} required />
                    </div>
                    <br />
                    <div>
                        <i className="fa-solid fa-pencil"></i>
                        <input  type="text"  id='inputCategory' className="form-control" defaultValue={room.category} required />
                    </div>
                    <br />
                    <div>
                        <i className="fa-solid fa-tag"></i>
                        <input  type="number" id='inputCapacity' className="form-control" defaultValue={room.peopleCapacity} required />
                    </div>
                    <br />
                    <div>
                        <i className="fa-solid fa-tag"></i>
                        <input  type="text"  id='inputPrice' className="form-control" defaultValue={room.price} required />
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
                    <button onClick={(e) => updateRoom(e)} type="submit" className="btn btn-outline-primary">update</button>
                    <Link to='/dashboard/room'>
                        <button type="submit" className="btn btn-outline-primary">Cancel</button>
                    </Link>
                </form>
            </div>
        </div>
    )
}
