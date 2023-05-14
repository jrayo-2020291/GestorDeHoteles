import React from 'react'
import axios from "axios"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useState } from "react"

export const AddUser = () => {
    const navigate = useNavigate()
    const token = localStorage.getItem('token')
    const [form, setForm] = useState({
        name: '',
        surname: '',
        username: '',
        email: '',
        phone: '',
        role: ''
    })

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const addUser = async (e) => {
        try {
            e.preventDefault()
            const { data } = await axios.post('http://localhost:3100/user/addAccount', form, {
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

    return (
        <div className="container">
        <div className="box">
            <h1>Servicio</h1>
            <form>
                <div>
                    <i className="fa-solid fa-user"></i>
                    <input  onChange={handleChange} type="text" name='name' className="form-control" placeholder='name'  required/>
                </div>
                <br/>
                <div>
                    <i className="fa-solid fa-pencil"></i>
                    <input  onChange={handleChange} type="text" name='surname'  className="form-control"  placeholder='surname' required/>
                </div>
                <br/>
                <div>
                    <i className="fa-solid fa-tag"></i>
                    <input  onChange={handleChange} type="text" name='username'  className="form-control"  placeholder='username' required/>
                </div>
                <br/>
                <div>
                    <i className="fa-solid fa-tag"></i>
                    <input  onChange={handleChange} type="text" name='email'  className="form-control"  placeholder='email' required/>
                </div>
                <br/>
                <div>
                    <i className="fa-solid fa-tag"></i>
                    <input  onChange={handleChange} type="text" name='phone'  className="form-control"  placeholder='phone' required/>
                </div>
                <br/>
                <div>
                    <i className="fa-solid fa-tag"></i>
                    <input  onChange={handleChange} type="text" name='role'  className="form-control"  placeholder='role' required/>
                </div>
                <br/>
                <button onClick={(e)=>  addUser(e)} type="submit" className="btn btn-outline-primary">Add</button>
                <Link to='/dashboard/user'>
                <button type="submit" className="btn btn-outline-primary">Cancel</button>
                </Link>
            </form>
        </div>
    </div>
    )
}
