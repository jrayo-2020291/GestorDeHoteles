import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { ReservationRoom } from './ReservationRoom'
import { Link, useNavigate } from 'react-router-dom'


export const ReservationRoomTable = () => {
  const navigate = useNavigate()
  const [reservation, setReservation] = useState([{}])
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem('token')

  const LogOut = () => {
    localStorage.clear()
    navigate('/')
  }

  const getReservation = async () => {
    try {
      const { data } = await axios('http://localhost:3100/reservationRoom/getReservationGeneral', {
        headers: {
          'Authorization': token
        }
      })
      data.reservations.forEach(element => {
        let date1 = new Date(element.dateStart)
        let date2 = new Date(element.dateEnd)
        element.dateStart = date1.toLocaleDateString()
        element.dateEnd = date2.toLocaleDateString()
      })
      setReservation(data.reservations)
      setLoading(false)
    } catch (err) {
      console.error(err)
    }
  }

  const deleteReservationRoom = async (id) => {
    try {
      let confirmDelete = confirm('¿Estás seguro de eliminar este usuario?')
      if (confirmDelete) {
        const { data } = await axios.delete(`http://localhost:3100/reservationRoom/deleteReservation/${id}`, {
          headers: {
            'Authorization': token
          }
        })
        getReservation()
      }
    } catch (err) {
      console.error(err)
      alert(err.response.data.message)
    }
  }


  useEffect(() => getReservation, [])


  return (
    <>
      <section id="content">
        <br />
        <Link to='../addReservationRoom'>
          <i className="fa-solid fa-plus add"></i>
        </Link>
        <main>
          <table>
            <thead>
              <tr>
                <th>dateStart</th>
                <th>dateEnd</th>
                <th>cost</th>
                <th>user</th>
                <th>hotel</th>
              </tr>
            </thead>
            <tbody>
              {
                reservation.map(({ _id, dateStart, dateEnd, cost, user, hotel }, index) => {
                  return (
                    <tr key={index}>
                      <ReservationRoom
                        dateStart={dateStart}
                        dateEnd={dateEnd}
                        cost={cost}
                        user={user?.name}
                        hotel={hotel?.name}
                      ></ReservationRoom>
                      <td>
                        <Link to={`../updateReservationRoom/${_id}`}>
                          <i className="fa-solid fa-pen-to-square button"></i>
                        </Link>
                        <i onClick={() => deleteReservationRoom(_id)} className="fa sharp fa-solid fa-trash button"></i>
                        <Link to={`../addServiceReservationRoom/${_id}`}>
                          <i className='fa-solid fa-clipboard button'></i>
                        </Link>
                        <Link to={`../addRoomReservationRoom/${_id}`}>
                          <i className='fa-solid fa-clipboard button'></i>
                        </Link>
                      </td>
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