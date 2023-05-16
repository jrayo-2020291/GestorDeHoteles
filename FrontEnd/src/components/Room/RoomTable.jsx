import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Room } from './Room'
import { Link, useNavigate } from 'react-router-dom'


export const RoomTable = () => {
  const role = localStorage.getItem('role')
  const [show, setShow] = useState(false)
  const navigate = useNavigate()
  const [room, setRoom] = useState([{}])
  const token = localStorage.getItem('token')

  const restringir = () => {
    if (role === 'ADMIN' || role === 'MANAGER') {
      setShow(true)
    }
  }

  const LogOut = () => {
    localStorage.clear()
    navigate('/')
  }

  const deleteRoom = async (id) => {
    try {
      let confirmDelete = confirm('¿Estás seguro de eliminar este usuario?')
      if (confirmDelete) {
        const { data } = await axios.delete(`http://localhost:3100/room/delete/${id}`, {
          headers: {
            'Authorization': token
          }
        })
        getRoom()
      }
    } catch (err) {
      console.error(err)
      alert(err.response.data.message)
    }
  }

  const getRoom = async () => {
    try {
      const { data } = await axios('http://localhost:3100/room/get', {
        headers: {
          'Authorization': token
        }
      })
      setRoom(data.rooms)
    } catch (err) {
      console.error(err)
    }
  }
  useEffect(() => getRoom, [])
  useEffect(() => restringir, [])

  return (
    <>
      <section id="content">
        {
          show ? (
            <>
            <br />
            <Link to='../addReservationRoom'>
              <i className="fa-solid fa-plus add"></i>
            </Link>
            </>
          ) : (<></>)
        }
        <main>
          <table>
            <thead>
              <tr>
                <th>No.Habitación</th>
                <th>Category</th>
                <th>Capacidad</th>
                <th>precio</th>
                <th>Disponibilidad</th>
                <th>Hotel</th>
              </tr>
            </thead>
            <tbody>
              {
                room.map(({ _id, noRoom, category, peopleCapacity, price, availability, hotel }, index) => {
                  return (
                    <tr key={index}>
                      <Room
                        noRoom={noRoom}
                        category={category}
                        peopleCapacity={peopleCapacity}
                        price={price}
                        availability={availability}
                        hotel={hotel?.name}
                      ></Room>
                      {
                        show ? (
                          <td>
                            <Link to={`../updateRoom/${_id}`}>
                              <i className="fa-solid fa-pen-to-square button"></i>
                            </Link>
                            <i onClick={() => deleteRoom(_id)} className="fa sharp fa-solid fa-trash button"></i>
                          </td>
                        ) : (<td></td>)
                      }


                    </tr>
                  )
                })
              }
            </tbody>
          </table>

        </main>
      </section>
    </>
  )
}
