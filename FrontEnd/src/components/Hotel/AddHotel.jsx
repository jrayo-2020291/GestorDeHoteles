import React from 'react'
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import Swal from 'sweetalert2';
import { useState, useEffect } from "react"

export const AddHotel = () => {
    const navigate = useNavigate()
    const [users, setUsers] = useState([{}])
    const title = 'ADD HOTEL';
    const token = localStorage.getItem(`token`)

    const addHotel = async(e)=>{
        try {
            e.preventDefault()
            let hotel = {
                name: document.getElementById('name').value,
                locationH: document.getElementById('locationH').value,
                qualification: document.getElementById('qualification').value,
                numberRooms: document.getElementById('numberRooms').value,
                manager: document.getElementById('manager').value,
            }
            const { data } = await axios.post('http://localhost:3100/hotel/addHotel', hotel,
            {
                headers: {
                    'Authorization': token
                }
            })
            Swal.fire({
                title: data.message || 'hotel created sucessfully',
                icon: 'success',
                timer: 2000
              })
              if(data.message== 'Hotel already created'){ 
                Swal.fire({
                    title: data.message ,
                      icon: 'warning',
                      timer: 2000
                    })
              }else if(data.message=='User already has an hotel'){
                Swal.fire({
                    title: data.message ,
                      icon: 'warning',
                      timer: 2000
                    })
              }
            navigate('/dashboard/hotel')
        } catch (err) {
            alert(err.response.data.message)
        }
    };

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
                            <input type="text" placeholder="name" id='name'/>
                        </div>
                        <br/>
                        <div>
                            <i className="fa-solid fa-user-clock"></i>
                            <input type="text" placeholder="locationH" id='locationH'/>
                        </div>
                        <br/>
                        <div>
                            <i className="fa-solid fa-id-card"></i>
                            <input type="number" placeholder="qualification" id='qualification'/>
                        </div>
                        <br/>
                        <div>
                            <i className="fa-solid fa-id-card"></i>
                            <input type="number" placeholder="numberRooms" id='numberRooms'/>
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
                        <button onClick={(e)=>  addHotel(e)} type="submit" className="btn btn-primary">Add</button>
                        <Link to='/dashboard/hotel'>
                            <button  type="submit" className="btn btn-primary">Cancel</button>
                        </Link>
                        
                    </form>
                </div>
            </div>
        </>
    )
}
