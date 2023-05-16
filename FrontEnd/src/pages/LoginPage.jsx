import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2';



export const LoginPage = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: '',
    password: ''
  })

  const handleChange = (e)=>{
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const login = async(e)=>{
    try{
      e.preventDefault()  
      const { data } = await axios.post('http://localhost:3100/user/login', form)
      if(data.token){
       localStorage.setItem('token', data.token)
       localStorage.setItem('role', data.user.role)
        Swal.fire({
          title: data.message || 'Login successfully',
          icon: 'success',
          timer: 2000
        })
        navigate('/dashboard')
        window.location.reload()
        
      }
    }catch(err){
      console.log(err)
      Swal.fire('Error with login', err.response.data.message, 'error')
      throw new Error('Error login failed')
    }
  }

  return (
    <>
    <div className='container'>
    <h2 className='text-center'>Log In</h2>
      <form className='m-5 text-center'>
        <div className='mb-3'>
          <label className='form-label' htmlFor="">Username</label>
          <input onChange={handleChange} name='username' className='form-control' type="text" />
        </div>
        <div className='mb-3'>
          <label className='form-label' htmlFor="">Password</label>
          <input onChange={handleChange} name='password' className='form-control' type="password" />
        </div>
          <button onClick={(e)=> login(e)} className='btn btn-success'>Login</button>
      </form>
    </div>
    </>
  )
}