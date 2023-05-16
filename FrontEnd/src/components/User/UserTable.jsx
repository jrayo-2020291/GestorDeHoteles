import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { User } from './User'
import { Link, useNavigate } from 'react-router-dom'


export const UserTable = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState([{}])
  const token = localStorage.getItem('token')
  const [show, setShow] = useState(false)

  const restringir = () => {
    if (role === 'ADMIN' || role === 'MANAGER') {
      setShow(true)
    }
  }

  const LogOut = () => {
    localStorage.clear()
    navigate('/')
  }

  const deleteUser = async (id) => {
    try {
      let confirmDelete = confirm('¿Estás seguro de eliminar este usuario?')
      if (confirmDelete) {
        const { data } = await axios.delete(`http://localhost:3100/user/delete/${id}`, {
          headers: {
            'Authorization': token
          }
        })
        getUser()
      }
    } catch (err) {
      console.error(err)
      alert(err.response.data.message)
    }
  }

  const getUser = async () => {
    try {
      const { data } = await axios('http://localhost:3100/user/get', {
        headers: {
          'Authorization': token
        }
      })
      setUser(data.users)
    } catch (err) {
      console.error(err)
    }
  }


  useEffect(() => getUser, [])
  useEffect(() => restringir, [])

  return (
    <>
      <section id="content">
        {
          show ? (
            <>
              <br />
              <Link to='../addUser'>
                <i className="fa-solid fa-plus add"></i>
              </Link>
              <br />
              <br />
            </>
          ) : (<></>)
        }
        <main>
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>usuario</th>
                <th>email</th>
                <th>phone</th>
                <th>role</th>
              </tr>
            </thead>
            <tbody>
              {
                user.map(({ _id, name, surname, username, email, phone, role }, index) => {
                  return (
                    <tr key={index}>
                      <User
                        name={name}
                        surname={surname}
                        username={username}
                        email={email}
                        phone={phone}
                        role={role}
                      ></User>
                      {
                        show ? (
                          <>
                            <td>
                              <Link to={`../updateUser/${_id}`}>
                                <i className="fa-solid fa-pen-to-square button"></i>
                              </Link>
                              <i onClick={() => deleteUser(_id)} className="fa sharp fa-solid fa-trash button"></i>
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
      </section>
    </>
  )
}