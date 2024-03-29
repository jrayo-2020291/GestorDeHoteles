import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, Link, useParams } from 'react-router-dom'
import { Room } from '../Room/Room'
import Swal from 'sweetalert2';


export const AddRoomReservationRoom = () => {
    const [rooms, setRooms] = useState([{}])
    const [reservation, setReservation] = useState([{}])
    const token = localStorage.getItem(`token`)
    const navigate = useNavigate()
    const { id } = useParams()

    const getRooms = async () => {
        try {
            const { data } = await axios(`http://localhost:3100/room/getA/${id}`, {
                headers: {
                    'Authorization': token
                }
            })
            setRooms(data.rooms)
        } catch (err) {
            console.error(err)
        }
    }

    const deleteRoom = async (idRoom) => {
        try {
          let confirmDelete = confirm('Estás seguro de eliminar este evento?')
          if (confirmDelete) {
            const { data } = await axios.put(`http://localhost:3100/reservationRoom/removeRoom/${id}`, { roomId: idRoom }, {
              headers: {
                'Authorization': token
              }
            })
            getReservation();
            getRooms();
            Swal.fire({
              title: data.message || 'Deleting sucessfully',
              icon: 'success',
              timer: 2000
            })
          }
        } catch (err) {
          console.error(err)
          alert(err.response.data.message)
        }
      }

    const getReservation = async () => {
        try {
            const { data } = await axios(`http://localhost:3100/reservationRoom/getReservation/${id}`, {
                headers: {
                    'Authorization': token
                }
            })
            let array = []
            let room = data.reservation.rooms
            room.forEach(element => {
                array.push(element.room)
            })
            setReservation(array)
        } catch (err) {
            Swal.fire({
                title: err.response.data.message,
                icon: 'error',
                timer: 2000
              })
        }
    }

    const updateReservation = async (e) => {
        try {
            e.preventDefault()
            let updatedReservation = {
                room: document.getElementById('inputRoom').value
            }
            const { data } = await axios.put(`http://localhost:3100/reservationRoom/addRoom/${id}`, updatedReservation,
                {
                    headers: {
                        'Authorization': token
                    }
                })
                if(data.message=== 'New room agregated'){ 
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
                  
                    navigate('../reservationRoom')
        } catch (err) {
            Swal.fire({
                title: err.response.data.message,
                icon: 'error',
                timer: 2000
              })
        }
    }

    useEffect(() => getRooms, [])
    useEffect(() => getReservation, [])


    return (
        <>
            <div className="container">
                <div className="box">
                    <h1>Agregar Habitaciones</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Habitaciones reservadas</th>
                                <th>Categoria</th>
                                <th>Capacidad</th>
                                <th>Precio</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                reservation.map(({ _id, noRoom, category, peopleCapacity, price }, index) => {
                                    return (
                                        <tr key={index}>
                                            <Room
                                                noRoom={noRoom}
                                                category={category}
                                                peopleCapacity={peopleCapacity}
                                                price={price}
                                            ></Room>
                                            <td>
                                                <i onClick={() => deleteRoom(_id)} className="fa-solid fa-trash-can button"></i>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                    <form>
                        <div>
                            <i className="fa-solid fa-user-shield icon side">Servicio</i>
                            <select className="form-control" id="inputRoom" required>
                                {
                                    rooms.map(({ _id, noRoom }, i) => {
                                        return (
                                            <option key={i} value={_id}>{noRoom}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <br />
                        <button onClick={(e) => updateReservation(e)} type="submit" className="btn btn-primary">Add</button>
                        <Link to='../reservationRoom'>
                            <button type="submit" className="btn btn-primary">Cancel</button>
                        </Link>

                    </form>
                </div>
            </div>
        </>
    )
}
