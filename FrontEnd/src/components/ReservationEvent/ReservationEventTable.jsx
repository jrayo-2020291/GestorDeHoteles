import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { ReservationEvent } from './ReservationEvent';
import Swal from 'sweetalert2';

export const ReservationEventTable = () => {
  const navigate = useNavigate()
  const [reservations, setReservations] = useState([{}])
  const token = localStorage.getItem('token')

  const deleteReservation = async (id) => {
    try {
      const { data } = await axios.delete(`http://localhost:3100/reservationEvent/deleteReservation/${id}`, {
        headers: {
          'Authorization': token
        }
      })
      Swal.fire({
        title: 'Deleted!',
        text: 'Your Reservation has been deleted.',
        icon: 'success'
      }).then(() => {
        getReservations()
      })
    } catch (err) {
      console.error(err)
      alert(err.response.data.message)
    }
  }

  const setState = async (id) => {
    try {

      let confirmDelete = confirm('Desea efectuar el pago pertinente por reservación actual? (esto concretara su reservación oficialmente)')
      if (confirmDelete) {
        const { data } = await axios.put(`http://localhost:3100/reservationEvent/setState/${id}`, {
          headers: {
            'Authorization': token
          }
        })
        alert(data.message)
        getReservations()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const getReservations = async () => {
    try {
      const { data } = await axios('http://localhost:3100/reservationEvent/getReservationsGeneral', {
        headers: {
          'Authorization': token
        }
      })
      data.reservations.forEach(element => {
        let date = new Date(element.dateEvent)
        element.dateEvent = date.toLocaleDateString()
      })
      setReservations(data.reservations)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => getReservations, [])
  return (
    <>
      {/* <section id="content"> */}
      <br />
      <br />
      <br />
      <br />
      <main>
        <h1 className="title">Reservación de Eventos</h1>
        <ul className="breadcrumbs">
          <li><a href="#">User</a></li>
          <li className="divider">/</li>
          <li><a href="#" className="active">Gestor de Hoteles</a></li>
        </ul>
        <br />
        <Link to='/../dashboard/addReservationEvent'>
          <i className="fa-solid fa-plus add"></i>
        </Link>
        <br />
        <br />
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Costo</th>
              <th>Horas</th>
              <th>Usuario</th>
              <th>Hotel</th>
              <th>Evento</th>
              <th>Acciones</th>
              <th>+ Servicios</th>
              <th>Facturar</th>
            </tr>
          </thead>
          <tbody>
            {
              reservations.map(({ _id, dateEvent, hoursEvent, cost, user, hotel, event }, index) => {
                return (
                  <tr key={index}>
                    <ReservationEvent
                      dateEvent={dateEvent}
                      cost={cost}
                      hoursEvent={hoursEvent}
                      user={user?.name}
                      hotel={hotel?.name}
                      event={event?.name}
                    ></ReservationEvent>
                    <td>
                      <Link to={`/../dashboard/updateReservationEvent/${_id}`}>
                        <i className="fa-solid fa-pen-to-square button"></i>
                      </Link>
                      <i onClick={() => deleteReservation(_id)} className="fa sharp fa-solid fa-trash button"></i>

                    </td>
                    <td>
                      <Link to={`/../dashboard/addService/${_id}`}>
                        <i className="fa-solid fa-plus-circle button"></i>
                      </Link>
                    </td>
                    <td>
                      <i onClick={() => setState(_id)} className='fa-solid fa-clipboard button'></i>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>

      </main>
      {/* </section>	 */}
    </>

  )
}