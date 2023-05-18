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
      const result = await Swal.fire({
        title: 'you are sure?',
        text: 'Delete Reservation Event',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'YES',
        cancelButtonText: 'CANCEL',
      });
        if (result.isConfirmed) {
          const { data } = await axios.delete(`http://localhost:3100/reservationEvent/deleteReservation/${id}`, {
            headers: {
              'Authorization': token
            }
          })
          getReservations()
        if(data.message=== 'Reservation deleted'){ 
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
       
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('CANCEL', 'The Reservation not confirmed', 'error');
        }
    } catch (err) {
      console.error(err)
      Swal.fire({
        title: err.response.data.message ,
        icon: 'error',
        timer: 2000
      })
    }
  }

  const setState = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'you are sure?',
        text: 'You want to make the relevant payment for your current reservation, this will confirm your reservation officially?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'YES',
        cancelButtonText: 'CANCEL',
      });
        if (result.isConfirmed) {
          const { data } = await axios.put(`http://localhost:3100/reservationEvent/setState/${id}`, {
          headers: {
            'Authorization': token
          }
        })
        getReservations()
        if(data.message=== 'Reservation deleted'){ 
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
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('CANCEL', 'The payment was not made', 'error');
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
      <br /><br />
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