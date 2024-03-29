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
            if(data.message== 'Hotel updated'){ 
                Swal.fire({
                    title: data.message ,
                      icon: 'success',
                      timer: 2000
                })
            }else{
                Swal.fire({
                    title: data.message ,
                      icon: 'warning',
                      timer: 2000
                })
            }
            navigate('/dashboard/hotel')
        } catch (err) {
            Swal.fire({
                title: err.response.data.message ,
                icon: 'error',
                timer: 2000
              })
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

    const getHotel = async ()=>{
        try {
            const {data} = await axios(`http://localhost:3100/hotel/getById/${id}`,{
                headers: {
                    'Authorization': token
                }
            })
            setHotel(data)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => getUsers, [])
    useEffect(() => getHotel, [])

    return (
        <>
        <br />
            <div className="container">
                <div className="box">
                    <h1>Actualizar Hotel</h1>
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
                            <input defaultValue={hotel.numberRooms} type="number" placeholder="numberRooms" className="form-control" id="numberRooms" required/>
                        </div>
                        <br/>
                        <div>
                            <i className="fa-solid fa-user-shield icon side">Manager</i>
                            <select defaultValue='' className="form-control" id="manager" required>
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