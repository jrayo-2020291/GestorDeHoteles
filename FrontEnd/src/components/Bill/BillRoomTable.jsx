import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { ReservationRoom } from '../ReservationRoom/ReservationRoom'
import { Link, useNavigate } from 'react-router-dom'



export const BillRoomTable = () => {
  const navigate = useNavigate()
  const [reservation, setReservation] = useState([{}])
  const token = localStorage.getItem('token')
  const date = new Date().toDateString()

  const LogOut = () => {
    localStorage.clear()
    navigate('/')
  }

  const report = async (e) => {
    try {
      e.preventDefault()
      const { data } = await axios('http://localhost:3100/reservationRoom/createReport')
      console.log(data)
    } catch (err) {
      console.error(err)
    }
  }


  const getReservation = async () => {
    try {
      const { data } = await axios('http://localhost:3100/reservationRoom/getReservationGeneral2', {
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


  useEffect(() => getReservation, [])

  return (
    <>
      {/* <section id="content"> */}
      <br /><br />
      <main>
        <h1 className="title">Facturas por Hospedaje</h1>
        <ul className="breadcrumbs">
          <li><a href="#">Usuarios</a></li>
          <li className="divider">/</li>
          <li><a href="#" className="active">Gestor de Hoteles</a></li>
        </ul>
        <br />
        <br />
        <div className="info-data">
          <div className="menu">
            <div className="sub-menu">
            </div>
            <table>
              <thead>
                <tr>
                  <th>dateStart</th>
                  <th>dateEnd</th>
                  <th>cost</th>
                  <th>user</th>
                  <th>hotel</th>
                  <th>+ Habitaciones/Servicios</th>
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
                          <Link to={`../billRoomRooms/${_id}`}>
                            <i className='fa-solid fa-clipboard button'></i>
                          </Link>
                          <Link to={`../billRoomServices/${_id}`}>
                            <i className='fa-solid fa-clipboard button'></i>
                          </Link>
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
            <br />
            <button className='button' onClick={(e) => report(e)}>Generar reporte</button>
            <a href="http://localhost:3100/src/" download={`Report Reservations Rooms-${date}.pdf`}>
              Descargar
            </a>
          </div>
        </div>
      </main>
      {/* </section> */}
    </>
  )
}