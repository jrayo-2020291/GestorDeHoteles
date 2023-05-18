import React from 'react'
import axios from "axios"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useState, useEffect} from "react"
import Swal from 'sweetalert2';


export const AddReservationRoom = () => {
    const navigate = useNavigate()
    const [hotels, setHotels] = useState([{}])
    const token = localStorage.getItem('token')

    
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
            let form = {
                dateStart: document.getElementById('inputDateStart').value,
                dateEnd: document.getElementById('inputDateEnd').value,
                hotel: document.getElementById('inputHotel').value,
            }
            const { data } = await axios.post('http://localhost:3100/reservationRoom/add', form, {
                headers: {
                    'Authorization': token
                }
            })
            if(data.message== 'New Resevation created'){ 
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
            navigate('/dashboard/reservationRoom')
        } catch (err) {
            Swal.fire({
                title: err.response.data.message ,
                icon: 'error',
                timer: 2000
              })
        }
    }

    useEffect(() =>getHotels, [])
    return (
        <div className="container">
        <div className="box">
            <h1>Agregar Reservación</h1>
            <form>
                <div>
                    <i className="fa-solid fa-user">Start-Date</i>
                    <input   type="date"  className="form-control"  id="inputDateStart"  required/>
                </div>
                <br/>
                <div>
                    <i className="fa-solid fa-pencil">End-Date</i>
                    <input   type="date"   className="form-control" id="inputDateEnd"  required/>
                </div>
                <br/>
                <div>
                    <i className="fa-solid fa-user-shield icon side">Hotels</i>
                    <select  className="form-control" id="inputHotel" name='hotel' required>
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
                <button onClick={(e)=>  addReservationRoom(e)} type="submit" className="btn btn-outline-primary">Add</button>
                <Link to='/dashboard/reservationRoom'>
                <button type="submit" className="btn btn-outline-primary">Cancel</button>
                </Link>
            </form>
        </div>
    </div>
    )
}