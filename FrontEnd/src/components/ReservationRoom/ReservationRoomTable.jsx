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
          const { data } = await axios.put(`http://localhost:3100/reservationRoom/setState/${id}`, {
          headers: {
            'Authorization': token
          }
        })
        getReservation()
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
      //
      
    } catch (err) {
      console.error(err)
    }
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
      console.log(data)
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
      const result = await Swal.fire({
        title: 'you are sure?',
        text: 'Delete Reservation',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'YES',
        cancelButtonText: 'CANCEL',
      });
        if (result.isConfirmed) {
          const { data } = await axios.delete(`http://localhost:3100/reservationRoom/deleteReservation/${id}`, {
          headers: {
            'Authorization': token
          }
        })
        getReservation()
        console.log(data.message)
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
          Swal.fire('CANCEL', 'The Reservation was not deleted', 'error');
        }
      //
    } catch (err) {
      console.error(err)
      alert(err.response.data.message)
    }
  }


  useEffect(() => getReservation, [])
  useEffect(() => getHotels, [])

  return (
    <>
      {/* <section id="content"> */}
      <main>
        <h1 className="title">Reservación de Habitación</h1>
        <ul className="breadcrumbs">
          <li><a href="#">Usuarios</a></li>
          <li className="divider">/</li>
          <li><a href="#" className="active">Gestor de Hoteles</a></li>
        </ul>
        <br />
        <Link to='../addReservationRoom'>
          <i className="fa-solid fa-plus add"></i>
        </Link>
        <br />
        <br />
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
            <button className='button' onClick={(e) => getReservationByHotel(e)}>Buscar</button>
          </div>
        </form>
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
                  <th>Acciones</th>
                  <th>+ Habitaciones/Servicios</th>
                  <th>Facturar</th>
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
                        </td>
                        <td>
                          <Link to={`../addServiceReservationRoom/${_id}`}>
                            <i className='fa-solid fa-clipboard button'></i>
                          </Link>
                          <Link to={`../addRoomReservationRoom/${_id}`}>
                            <i className='fa-solid fa-clipboard button'></i>
                          </Link>
                        </td>
                        <td>
                          <i onClick={()=> setState(_id)} className='fa-solid fa-clipboard button'></i>
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
        </div>
      </main>
      {/* </section> */}
    </>
  )
}