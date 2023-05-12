import React from 'react'
import { Link } from 'react-router-dom'

export const EventTable = () => {
    return (

        <>
            <section id="content">
                <main>
                    <h1 className="title">Eventos</h1>
                        <ul className="breadcrumbs">
                            <li><a href="#">Administrador</a></li>
                            <li className="divider">/</li>
                            <li><a href="#" className="active">Gestor de Hoteles</a></li>
                        </ul>
                    <br/> 
                    <div className="info-data">
                        <div className="menu">
                            <div className="sub-menu">
                            </div>
                            <br/>
                            <Link to ='../addEvent'>
                                <i className="fa-solid fa-plus add"></i>
                            </Link>
                            <br/>
                            <br/>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Descripción</th>
                                        <th>Costo por hora</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                    <tbody>
                                        <tr>
                                            <td>Mirador</td>
                                            <td>Vistas espectaculares de todo el valle</td>
                                            <td>350</td>
                                            <td>
                                                <Link to='../updateEvent/:id'>
                                                    <i className="fa-solid fa-pen button"></i>
                                                </Link>
                                                    <i className="fa-solid fa-trash-can button"></i>   
                                            </td>
                                        </tr>
                                    </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </section>
        </>
    )
}
