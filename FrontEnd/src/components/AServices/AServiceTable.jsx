import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { Aservice } from './Aservice'
import Swal from 'sweetalert2';

export const AServiceTable = () => {
    const navigate = useNavigate()
    const [services, setServices] = useState([{}])
    const token = localStorage.getItem('token')
  
    
      const getServices = async () => {
        try {
          const {data} = await axios('http://localhost:3100/services/getServices', {
            headers: {
              'Authorization': token
            }
          })
          console.log(data)
          setServices(data.services)
        } catch (err) {
          console.error(err)
        }
      }
      /* const { data } = await axios.delete(`http://localhost:2651/account/delete/${id}`, {
         headers: {
             'Authorization': token
         }
     })*/
    
     const deleteService = async (id) => {
      try {
        
        const { data } = await axios.delete(`http://localhost:3100/services/delete/${id}`, {
          headers: {
            'Authorization': token
          }
        })
        Swal.fire({
          title: 'Deleted!',
          text: 'Your file has been deleted.',
          icon: 'success'
        }).then(() => {
          getServices()
        })
      } catch (err) {
        console.error(err)
        alert(err.response.data.message)
      }
    }
    
      useEffect(() => getServices, [])
    return (
        <> 
        <section id="content">
		<main>
    <Link to='/../dashboard/addAService'>
            <i className="fa-solid fa-plus add"></i>
            </Link>
            <br/>
            <br/>

				<table>
						<thead>
							<tr>
								<th>Nombre</th>
								<th>Descripción</th>
								<th>Costo</th>
								<th>Categoria</th>
								<th>Acciones</th>
							</tr>
						</thead>
							<tbody>
              { 
                  services.map(({ _id, name, description, cost,category}, index) => {
                    return (
                      <tr key={index}>
                        <Aservice
                          name={name}
                          description={description}
                          cost={cost}
                          category={category}
                        ></Aservice>
                        <td>
                          <Link to={`/../dashboard/updateAService/${_id}`}>
                            <i className="fa-solid fa-pen-to-square button"></i>
                          </Link>
                          <i onClick={()=>deleteService(_id)}className="fa sharp fa-solid fa-trash button"></i>
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