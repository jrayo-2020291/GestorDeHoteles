import React from 'react'
import axios from "axios"
import { Link, useNavigate, useParams } from "react-router-dom"
import Swal from 'sweetalert2'

export const AddUser = () => {
    const navigate = useNavigate()
    const token = localStorage.getItem('token')

    const addUser = async (e) => {
        try {
            e.preventDefault()
            let form = {
                name: document.getElementById('inputName').value,
                surname: document.getElementById('inputSurname').value,
                username: document.getElementById('inputUsername').value,
                password: document.getElementById('inputPassword').value,
                email: document.getElementById('inputEmail').value,
                phone: document.getElementById('inputPhone').value,
                role: document.getElementById('inputRole').value
            }
            console.log(form)
            const { data } = await axios.post('http://localhost:3100/user/addAccount', form, {
                headers: {
                    'Authorization': token
                }
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
            navigate('/dashboard/user')
        } catch (err) {
            Swal.fire({
                title: err.response.data.message ,
                icon: 'error',
                timer: 2000
              })
            
        }
    }
    

    return (
        <>
        <br /><br /><br /><br /><br /><br />
            <div className="container" >
                <div className="box">
                    <h1>Agregar Usuario</h1>
                    <form>
                        <div>
                            <i className="fa-solid fa-user"></i>
                            <input  type="text" id='inputName' className="form-control" placeholder='name' required />
                        </div>
                        <br />
                        <div>
                            <i className="fa-solid fa-pencil"></i>
                            <input  type="text" id='inputSurname' className="form-control" placeholder='surname' required />
                        </div>
                        <br />
                        <div>
                            <i className="fa-solid fa-tag"></i>
                            <input  type="text" id='inputUsername' className="form-control" placeholder='username' required />
                        </div>
                        <br />
                        <div>
                            <i className="fa-solid fa-pencil"></i>
                            <input  type="text" id='inputPassword' className="form-control" placeholder='password' required />
                        </div>
                        <br />
                        <div>
                            <i className="fa-solid fa-tag"></i>
                            <input  type="text" id='inputEmail' className="form-control" placeholder='email' required />
                        </div>
                        <br />
                        <div>
                            <i className="fa-solid fa-tag"></i>
                            <input  type="text" id='inputPhone' className="form-control" placeholder='phone' required />
                        </div>
                        <br />
                        <div>
                            <i className="fa-solid fa-tag">Role</i>
                            <select  id="inputRole">
                                <option value="CLIENT">Cliente</option>
                                <option value="ADMIN">Administrador</option>
                                <option value="MANAGER">Manager</option>
                            </select>
                        </div>
                        <br />
                        <button onClick={(e) => addUser(e)} type="submit" className="btn btn-outline-primary">Add</button>
                        <Link to='/dashboard/user'>
                            <button type="submit" className="btn btn-outline-primary">Cancel</button>
                        </Link>
                    </form>
                </div>
            </div>
        </>
    )
}
