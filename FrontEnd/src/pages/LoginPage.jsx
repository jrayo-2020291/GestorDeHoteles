import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export const LoginPage = () => {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        username: '',
        password: ''
    })

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const login = async (e) => {
        e.preventDefault()
        try {
            const { data } = await axios.post('http://localhost:3100/users/login', form)
            if (data.token) {
                setLoggedIn(true)
                localStorage.setItem('token', data.token)
                localStorage.setItem('role', data.user.role)
                if (data.user.role === "ADMIN") {
                    navigate('/dashboard')
                } else {
                    navigate('/worker')
                }
                window.location.reload()
            }
        } catch (err) {
            console.log(err)
            alert(err.response.data.message)
            throw new Error('Error login failed')
        }
    }
    return (
        <div>Login</div>
    )
}
