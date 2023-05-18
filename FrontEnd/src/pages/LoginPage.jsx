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
    <div className="box">

    <h1>Login</h1>
      <form className='m-5 text-center'>
        <div className='mb-3'>
          <input onChange={handleChange} placeholder='USERNAME' name='username' className='form-control' type="text" />
        </div>
        <br />
        <div className='mb-3'>
          <input onChange={handleChange} placeholder='PASSWORD' name='password' className='form-control' type="password" />
        </div>
        <br />
          <button onClick={(e)=> login(e)} className='btn '>Login</button>
          <br />
          <br />
          
            <p className='text--center'>Not a member?
              <Link to='/register'><a className='link'>Sign up now</a></Link>
            </p>
      </form>
      </div>
    </div>
    </>
  )
}