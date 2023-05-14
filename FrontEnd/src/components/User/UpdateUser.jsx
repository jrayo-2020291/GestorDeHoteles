import React from 'react'
import axios from "axios"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useState, useEffect } from "react"

export const UpdateUser = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [user, setUser] = useState({})
    const token = localStorage.getItem('token')

    const getUser = async () => {
        try {
            const { data } = await axios(`http://localhost:3100/user/getById/${id}`, {
                headers: {
                    'Authorization': token
                }
            })
            setUser(data.existUser)
        } catch (err) {
            console.error(err)
        }
    }

    const updateUser = async (e) => {
        try {
            e.preventDefault()
            let update = {
                name: document.getElementById('inputName').value,
                surname: document.getElementById('inputSurname').value,
                username: document.getElementById('inputUsername').value,
                email: document.getElementById('inputEmail').value,
                phone: document.getElementById('inputPhone').value,
                role: document.getElementById('inputRole').value,
            }
            const { data } = await axios.put(`http://localhost:3100/user/updateAccount/${id}`, update, {
                headers: {
                    'Authorization': token
                }
            })
            alert(data.message)
            navigate('/dashboard/user')
        } catch (err) {
            alert(err.response.data.message)
        }
    }

    useEffect(() => getUser, [])

    return (
        <div className="container">
            <div className="box">
                <h1>Servicio</h1>
                <form>
                    <div>
                        <i className="fa-solid fa-user"></i>
                        <input  type="text"  id='inputName' className="form-control" defaultValue={user.name} required />
                    </div>
                    <br />
                    <div>
                        <i className="fa-solid fa-pencil"></i>
                        <input  type="text"  id='inputSurname' className="form-control" defaultValue={user.surname} required />
                    </div>
                    <br />
                    <div>
                        <i className="fa-solid fa-tag"></i>
                        <input  type="text" id='inputUsername' className="form-control" defaultValue={user.username} required />
                    </div>
                    <br />
                    <div>
                        <i className="fa-solid fa-tag"></i>
                        <input  type="text"  id='inputEmail' className="form-control" defaultValue={user.email} required />
                    </div>
                    <br />
                    <div>
                        <i className="fa-solid fa-tag"></i>
                        <input  type="text"  id='inputPhone' className="form-control" defaultValue={user.phone} required />
                    </div>
                    <br />
                    <div>
                        <i className="fa-solid fa-tag"></i>
                        <input  type="text" id='inputRole' className="form-control" defaultValue={user.role} required />
                    </div>
                    <br />
                    <button onClick={(e) => updateUser(e)} type="submit" className="btn btn-outline-primary">update</button>
                    <Link to='/dashboard/user'>
                        <button type="submit" className="btn btn-outline-primary">Cancel</button>
                    </Link>
                </form>
            </div>
        </div>
    )
}
