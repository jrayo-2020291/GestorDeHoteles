import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { ReservationRoom } from './ReservationRoom'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2';


export const ReservationRoomTable = () => {
  const navigate = useNavigate()
  const [reservation, setReservation] = useState([{}])
  const token = localStorage.getItem('token')
  const [hotels, setHotels] = useState([{}])

  const LogOut = () => {
    localStorage.clear()
    navigate('/')
  }

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
    } catch (err) {
      console.error(err)
    }
  }

  const getReservationByHotel = async (e) => {
    try {
      e.preventDefault()
      let form = {
        id: document.getElementById('inputHotel').value
      }
      if (form.id === 'ALL') {
        return getReservation()

      }
      console.log(form.id)
      const { data } = await axios.post(`http://localhost:3100/reservationRoom/getByHotel`, form, {
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
      if (data) {
        setReservation(data.reservations)
      }
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
        Swal.fire({
          title: 'Deleted!',
          text: 'Your Reservation has been deleted.',
          icon: 'success'
        }).then(() => {
          getReservation()
        })
      }
    } catch (err) {
      console.error(err)
      alert(err.response.data.message)
    }
  }


  useEffect(() => getReservation, [])
  useEffect(() => getHotels, [])

  return (
    <>
      <section id="content">
        <br />
        <Link to='../addReservationRoom'>
          <i className="fa-solid fa-plus add"></i>
        </Link>
        <main>
          <form action="#">
            <div className="form-group">
              <i className="fa-solid fa-user-shield icon side">Hotels</i>
              <select className="form-control" id="inputHotel" required>
                {
                  hotels.map(({ _id, name }, i) => {
                    return (
                      <option key={i} value={_id}>{name}</option>
                    )
                  })
                }
                <option value="ALL">Todos</option>
              </select>
              <button onClick={(e) => getReservationByHotel(e)}>Buscar</button>
            </div>
          </form>
          <br />
          <br />
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