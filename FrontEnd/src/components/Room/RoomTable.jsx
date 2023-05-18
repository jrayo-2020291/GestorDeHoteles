import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Room } from './Room'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2';


export const RoomTable = () => {
  const role = localStorage.getItem('role')
  const [show, setShow] = useState(false)
  const navigate = useNavigate()
  const [room, setRoom] = useState([{}])
  const token = localStorage.getItem('token')
  const [hotels, setHotels] = useState([{}])

  const restringir = () => {
    if (role === 'ADMIN' || role === 'MANAGER') {
      setShow(true)
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

  const getByHotel = async (e) => {
    try {
      e.preventDefault()
      let form = {
        hotel: document.getElementById('inputHotel').value
      }
      if (form.hotel === 'ALL') {
        return getRoom()

      }
      const { data } = await axios.post(`http://localhost:3100/room/getByHotel`, form, {
        headers: {
          'Authorization': token
        }
      })
      if (data.rooms) {
        setRoom(data.rooms)
      }

    } catch (err) {
      console.error(err)
    }
  }

  const LogOut = () => {
    localStorage.clear()
    navigate('/')
  }

  const deleteRoom = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'you are sure?',
        text: 'Delete Room',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'YES',
        cancelButtonText: 'CANCEL',
      });
      
        if (result.isConfirmed) {
          const { data } = await axios.delete(`http://localhost:3100/room/delete/${id}`, {
          headers: {
            'Authorization': token
          }
        })
        getRoom()
        if(data.message=== 'Room deleted'){ 
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
          Swal.fire('CANCEL', 'The Room was not deleted', 'error');
        }
      //
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
  useEffect(() => getHotels, [])

  return (
    <>
      {/* <section id="content"> */}
      <br /><br />
      <main>
        <h1 className="title">Habitaciones</h1>
        <ul className="breadcrumbs">
          {
            show ? (
              <li><a href="#">Administrador</a></li>
            ) : (<li><a href="#">User</a></li>)
          }
          <li className="divider">/</li>
          <li><a href="#" className="active">Gestor de Hoteles</a></li>
        </ul>
        <br />
        {
          show ? (
            <>
              <br />
              <Link to='../addRoom'>
                <i className="fa-solid fa-plus add"></i>
              </Link>
              <br />
              <br />
            </>
          ) : (<></>)
        }
        <div className="info-data">
          <div className="menu">
            <div className="sub-menu">
            </div>
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
                <button className='button' onClick={(e) => getByHotel(e)}>Buscar</button>
              </div>
            </form>
            <br />
            <table>
              <thead>
                <tr>
                  <th>No.Habitación</th>
                  <th>Category</th>
                  <th>Capacidad</th>
                  <th>precio</th>
                  <th>Disponibilidad</th>
                  <th>Hotel</th>
                  {
                    show ? (
                      <th>Acciones</th>
                    ):(<></>)
                  }
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
          </div>
        </div>
      </main>
      {/* </section> */}
    </>
  )
}
