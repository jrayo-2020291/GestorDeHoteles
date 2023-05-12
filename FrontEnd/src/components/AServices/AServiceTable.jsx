import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { Aservice } from './Aservice'

export const AServiceTable = () => {
    const navigate = useNavigate()
    const [services, setServices] = useState({})
    const [loading, setLoading] = useState(true)
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
    
    
      useEffect(() => getServices, [])
    return (
        <> 
        <section id="content">
		<main>
				<table>
						<thead>
							<tr>
								<th>Nombre</th>
								<th>Descripción</th>
								<th>Costo</th>
								<th>Acciones</th>
							</tr>
						</thead>
							<tbody>
              {/* { 
                  services.map(({ _id, name, description, price}, index) => {
                    return (
                      <tr key={index}>
                        <Aservice
                          name={name}
                          description={description}
                          price={price}
                        ></Aservice>
                        <td>
                          <Link to={`/../updateA_Service/${_id}`}>
                            <i className="fa-solid fa-pen-to-square button"></i>
                          </Link>
                        </td>
                      </tr>
                    )
                  })
                } */}
							</tbody>
						</table>
				  
		</main>
	</section>	
        </>
	
    )
}
