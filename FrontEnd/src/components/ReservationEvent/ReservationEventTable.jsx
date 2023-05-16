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
        text: 'Your file has been deleted.',
        icon: 'success'
      }).then(() => {
        getReservations()
      })
    } catch (err) {
      console.error(err)
      alert(err.response.data.message)
    }
  }

  const getReservations = async () => {
    try {
      const { data } = await axios('http://localhost:3100/reservationEvent/get', {
        headers: {
          'Authorization': token
        }
      })
      data.reservations.forEach(element=>{
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
      <section id="content">
        <main>
        <Link to='/../dashboard/addReservationEvent'>
          <i className="fa-solid fa-plus add"></i>
          </Link>
          <br />
          <br />
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Horas</th>
                <th>Costo</th>
                <th>Usuario</th>
                <th>Hotel</th>
                <th>Evento</th>
                <th>Acciones</th>
                <th>Servicios</th>
              </tr>
            </thead>
            <tbody>
              {
                  reservations.map(({ _id, dateEvent, hoursEvent, cost,user,hotel,event}, index) => {
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
                          <i onClick={()=>deleteReservation(_id)}className="fa sharp fa-solid fa-trash button"></i>
                         
                        </td>
                        <td>
                        <Link to={`/../dashboard/addService/${_id}`}>
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
	</section>	
        </>
	
    )
}