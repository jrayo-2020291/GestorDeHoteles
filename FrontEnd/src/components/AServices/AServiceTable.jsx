import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { Aservice } from './Aservice'
import Swal from 'sweetalert2';

export const AServiceTable = () => {
  const navigate = useNavigate()
  const [services, setServices] = useState([{}])
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem('token')
  const [show, setShow] = useState(false)
  const role = localStorage.getItem('role')

  const restringir = () => {
    if (role === 'ADMIN' || role === 'MANAGER') {
      setShow(true)
    }
  }

  const deleteService = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'you are sure?',
        text: 'Delete Servicio aditional',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'YES',
        cancelButtonText: 'CANCEL',
      });
        if (result.isConfirmed) {
         
          const { data } = await axios.delete(`http://localhost:3100/services/delete/${id}`, {
        headers: {
          'Authorization': token
        }
      })
      if(data.message=== 'Service deleted'){ 
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
    
     getServices()
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('CANCEL', 'The service aditional was not deleted', 'error');
        }
        //
      
      
    } catch (err) {
      console.error(err)
      alert(err.response.data.message)
    }
  }

  const getServices = async () => {
    try {
      const { data } = await axios('http://localhost:3100/services/getServices', {
        headers: {
          'Authorization': token
        }
      })
      setServices(data.services)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => getServices, [])
  useEffect(() => restringir, [])
  return (
    <>
      {/* <section id="content"> */}
      <br /><br />
      <main>
      <h1 className="title">Servicios Adicionales</h1>
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
              <Link to='/../dashboard/addAService'>
                <i className="fa-solid fa-plus add"></i>
              </Link>
              <br />
              <br />
            </>
          ) : (<></>)
        }
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Costo</th>
              <th>Category</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {
              services.map(({ _id, name, description, cost, category }, index) => {
                return (
                  <tr key={index}>
                    <Aservice
                      name={name}
                      description={description}
                      cost={cost}
                      category={category}
                    ></Aservice>

                    {
                      show ? (
                        <>
                          <td>
                            <Link to={`/../dashboard/updateAService/${_id}`}>
                              <i className="fa-solid fa-pen-to-square button"></i>
                            </Link>
                            <i onClick={() => deleteService(_id)} className="fa sharp fa-solid fa-trash button"></i>
                          </td>
                        </>
                      ) : (<></>)
                    }
                  </tr>
                )
              })
            }
          </tbody>
        </table>

      </main>
      {/* </section> */}
    </>

  )
}