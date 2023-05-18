import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2';

export const Register = () => {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        name: '',
        surname: '',
        username:'',
        password:'',
        email:'',
        phone:''
      })

    const handleChange = (e)=>{
        setForm({
          ...form,
          [e.target.name]: e.target.value
        })
    }

    const registerUser = async(e)=>{
        try{
          e.preventDefault()  
          const { data } = await axios.post('http://localhost:3100/user/registerUser', form)
          Swal.fire({
            title: data.message || 'Account created sucessfully',
            icon: 'success',
            timer: 2000
          })
          if(data.message== 'Account created sucessfully'){ 
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
        }catch(err){
          Swal.fire({
            title: err.response.data.message ,
            icon: 'error',
            timer: 2000
          })
        }
    }
  

  return (
    <>
    <br /><br /><br /><br />
        <div className='container'>
            <div className="box">
                <h1>Registro de Usuarios</h1>
                <form className='m-5 text-center'>
                    <div className='mb-3'>
                        <input onChange={handleChange} placeholder='NAME' name='name' className='form-control' type="text" />
                    </div>
                    <br />
                    <div className='mb-3'>
                        <input onChange={handleChange} placeholder='SURNAME' name='surname' className='form-control' type="text" />
                    </div>
                    <br />
                    <div className='mb-3'>
                        <input onChange={handleChange} placeholder='USERNAME' name='username' className='form-control' type="text" />
                    </div>
                    <br />
                    <div className='mb-3'>
                        <input onChange={handleChange} placeholder='PASSWORD' name='password' className='form-control' type="password" />
                    </div>
                    <br />
                    <div className='mb-3'>
                        <input onChange={handleChange} placeholder='EMAIL' name='email' className='form-control' type="email" />
                    </div>
                    <br />
                    <div className='mb-3'>
                        <input onChange={handleChange} placeholder='PHONE' name='phone' className='form-control' type="text" />
                    </div>
                    <br />
                    <br />
                    <button onClick={(e)=> registerUser(e)}  className='btn '>REGISTRARSE</button>
                    <Link to='/login'>
                        <button  className='btn '>VOLVER</button>
                    </Link>
                    <br />
                </form>
            </div>
        </div>
    </>
  )
}