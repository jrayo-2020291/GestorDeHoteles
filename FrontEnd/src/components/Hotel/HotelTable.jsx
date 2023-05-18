import { Link, useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Hotel } from './Hotel'
import Swal from 'sweetalert2';

export const HotelTable = () => {
  const role = localStorage.getItem('role')
  const [hotel, setHotel] = useState([{}])
  const [show, setShow] = useState(false)
  const [showUser, setShowUser] = useState(false)
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  const [search, setSearch] = useState({
    name: ''
  })

  const restringir = () => {
    if (role === 'ADMIN') {
      setShow(true)
    }
    if (role === 'CLIENT') {
      setShowUser(true)
    }
  }

  const searching = async () => {
    try {
      const { data } = await axios.post('http://localhost:3100/hotel/getByName', search, {
        headers: {
          'Authorization': token
        }
      })
      if (data.hotels) {
        setHotel(data.hotels)
      } else if (search.name === '') {
        getHotels()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleChange = (e) => {
    setSearch({
      ...search,
      [e.target.name]: e.target.value
    })
    console.log(document.getElementById('calificacion').value)
    searching()
  }

  const getHotels = async () => {
    try {
      const { data } = await axios('http://localhost:3100/hotel/get', {
        headers: {
          'Authorization': token
        }
      })
      setHotel(data.hotels)
      setLoading(false)
    } catch (err) {
      console.error(err)
    }
  };

  const qualifyHotel = async (id) => {
    try {

      const { data } = await axios.put(`http://localhost:3100/hotel/qualification/${id}`, { qualification: document.getElementById('calificacion').value }, {
        headers: {
          'Authorization': token
        }
      })
      getHotels()
    } catch (err) {
      console.error(err);
      alert(err.response.data.message)
    }
  }

  const deleteHotel = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'you are sure?',
        text: 'Delete Hotel',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'YES',
        cancelButtonText: 'CANCEL',
      });
        if (result.isConfirmed) {
          const { data } = await axios.delete(`http://localhost:3100/hotel/delete/${id}`, {
           headers: {
             'Authorization': token
           }
         })
         getHotels()
         if(data.message=== 'Hotel deleted'){ 
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
          Swal.fire('CANCEL', 'The hotel was not deleted', 'error');
        }
      
    } catch (err) {
      console.error(err)
      alert(err.response.data.message)
    }
  }

  useEffect(() => getHotels, [])
  useEffect(() => restringir, [])

  return (
    <>
      {/* <section id="content"> */}
      <main>
        <h1 className="title">Hoteles</h1>
        <ul className="breadcrumbs">
          {
            show ? (
              <li><a href="#">Administrador</a></li>
            ) : (<li><a href="#">Usuario</a></li>)
          }
          <li className="divider">/</li>
          <li><a href="#" className="active">Gestor de Hoteles</a></li>
        </ul>
        <br />
        {
          show ? (
            <>
            <Link to='../addHotel'>
              <i className="fa-solid fa-plus add"></i>
            </Link>
            <br />
            <br />
            </>
          ) : (<></>)
        }
        <form action="#">
          <div className="form-group">
            <input className='barra-busqueda' name='name' onChange={handleChange} type="text" placeholder="Buscar..." />
            <i className="fa-solid fa-magnifying-glass icon"></i>
          </div>
        </form>
        <br />
        <div className="info-data">
          <div className="menu">
            <div className="sub-menu">
            </div>
            <br />
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Ubicación</th>
                  <th>Calificación</th>
                  <th>Habitaciones</th>
                  <th>Manager</th>
                  <th>+ Eventos</th>
                  {
                    show ? (
                      <th>Acciones</th>
                    ) : (<></>)
                  }
                  {
                    showUser ? (
                      <th>Calificar</th>
                    ) : (<></>)
                  }

                </tr>
              </thead>

              <tbody>
                {
                  hotel.map(({ _id, name, locationH, qualification, numberRooms, manager }, index) => {
                    return (
                      <tr key={index}>
                        <Hotel
                          name={name}
                          locationH={locationH}
                          qualification={qualification}
                          numberRooms={numberRooms}
                          manager={manager?.name}
                        ></Hotel>
                        <td>
                          <Link to={`../hotel/event/${_id}`}>
                            <i className="fa-solid fa-clipboard button"></i>
                          </Link>
                        </td>
                        {show ? (
                          <>
                            <td>
                              <Link to={`../updateHotel/${_id}`}>
                                <i className="fa-solid fa-pen button"></i>
                              </Link>
                              <i onClick={() => deleteHotel(_id)} className="fa sharp fa-solid fa-trash button"></i>
                            </td>
                          </>
                        ) : (<></>)
                        }
                        {
                          showUser ? (
                            <td>
                              <input onChange={handleChange} id='calificacion' type="range" min="1" max="5" step="any"></input>
                              <i onClick={() => qualifyHotel(_id)} className="fa sharp fa-solid fa-check button"></i>
                            </td>
                          ) : (<></>)
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
