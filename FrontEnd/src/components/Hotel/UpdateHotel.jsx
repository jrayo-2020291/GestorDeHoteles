import React from 'react'
import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import Swal from 'sweetalert2';

export const UpdateHotel = () => {

    const [hotel, setHotel] = useState([{}])
    const [users, setUsers] = useState([{}])
    const {id} = useParams();
    const token = localStorage.getItem(`token`)
    const navigate = useNavigate();

    const updateHotel = async(e)=>{
        try {
            e.preventDefault()
            let updateHotel = {
                name: document.getElementById('name').value,
                locationH: document.getElementById('locationH').value,
                numberRooms: document.getElementById('numberRooms').value,
                manager: document.getElementById('manager').value
            }
            const { data } = await axios.put(`http://localhost:3100/hotel/update/${id}`, updateHotel , {
              headers: {
                  'Authorization': token
              }
            });
            Swal.fire({
                title: data.message || 'Hotel updated',
                icon: 'success',
                timer: 2000
              })
            navigate('/dashboard/hotel')
        } catch (err) {
            console.error(err)
        }
    }

    const getUsers = async () => {
        try {
            const { data } = await axios('http://localhost:3100/user/getManager',
                {
                    headers: {
                        'Authorization': token
                    }
                })
            setUsers(data)
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => getUsers, [])

    return (
        <>
            <div className="container">
                <div className="box">
                    <h1>Hotel</h1>
                    <form>
                        <div>
                            <i className="fa-solid fa-user"></i>
                            <input defaultValue={hotel.name} type="text" placeholder="name" className="form-control" id="name" required/>
                        </div>
                        <br/>
                        <div>
                            <i className="fa-solid fa-user-clock"></i>
                            <input defaultValue={hotel.locationH} type="text" placeholder="locationH" className="form-control" id="locationH" required/>
                        </div>
                        <br/>
                        <div>
                            <i className="fa-solid fa-id-card"></i>
                            <input defaultValue={hotel.costPerHour} type="number" placeholder="numberRooms" className="form-control" id="numberRooms" required/>
                        </div>
                        <br/>
                        <div>
                            <i className="fa-solid fa-user-shield icon side">Manager</i>
                            <select className="form-control" id="manager" required>
                                {
                                    users.map(({ _id, name }, i) => {
                                        return (
                                            <option key={i} value={_id}>{name}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <br/>
                        <button onClick={(e)=>  updateHotel(e)} type="submit" className="btn btn-outline-primary">Update</button>
                        <Link to='/dashboard/hotel'>
                            <button  type="submit" className="btn btn-outline-primary">Cancel</button>
                        </Link>
                        
                    </form>
                </div>
            </div>
        </>
    )
}
