import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { ReservationEvent } from '../ReservationEvent/ReservationEvent';
import Swal from 'sweetalert2';

export const BillEventTable = () => {
  const navigate = useNavigate()
  const [reservations, setReservations] = useState([{}])
  const token = localStorage.getItem('token')

  const getReservations = async () => {
    try {
      const { data } = await axios('http://localhost:3100/reservationEvent/getReservationsGeneral2', {
        headers: {
          'Authorization': token
        }
      })
      console.log(data)
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
      <main>
      <h1 className="title">Facturas por Eventos</h1>
          <ul className="breadcrumbs">
            <li><a href="#">User</a></li>
            <li className="divider">/</li>
            <li><a href="#" className="active">Gestor de Hoteles</a></li>
          </ul>
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
              <th>Servicios</th>
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
                      <Link to={`/../dashboard/billEventServices/${_id}`}>
                        <i className="fa-solid fa-plus-circle button"></i>
                      </Link>
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