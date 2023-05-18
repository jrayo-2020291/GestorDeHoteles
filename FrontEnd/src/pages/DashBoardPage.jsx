import React from 'react'
import { Outlet } from 'react-router-dom'
import Logo from '../assets/manager.png'
import { Link } from 'react-router-dom'

export const DashBoardPage = () => {

    return (
        <>
            <div className="wrapper">
                <nav>
                    <input type="checkbox" id="show-search" />
                    <input type="checkbox" id="show-menu" />
                    <label htmlFor="show-menu" className="menu-icon"><i className="fas fa-bars"></i></label>
                    <div className="content">
                        <div className="logo"><a ></a><img src={Logo} className="store" /></div>
                        <ul className="links">
                            <Link to='user'>
                                <li><a >Usuarios</a></li>
                            </Link>
                            <Link to='aService'>
                                <li><a >Servicios</a></li>
                            </Link>
                            <Link to='event'>
                                <li><a >Eventos</a></li>
                            </Link>
                            <Link to='hotel'>
                                <li>
                                    <a className="desktop-link">Hoteles</a>
                                    <ul>
                                        <li><a >Grafica global</a></li>
                                    </ul>
                                </li>
                            </Link>
                            <Link to='room'>
                                <li><a >Habitaciones</a></li>
                            </Link>
                            <li>
                                <a className="desktop-link">Reservaciones</a>
                                <ul>
                                    <Link to='reservationRoom'>
                                        <li><a >Habitaciones</a></li>
                                    </Link>
                                    <Link to='reservationEvent'>
                                        <li><a >Eventos</a></li>
                                    </Link>
                                </ul>
                            </li>
                            <li>
                                <a className="desktop-link">Facturas</a>
                                <ul>
                                    <Link to='billRoom'>
                                        <li><a >Habitaciones</a></li>
                                    </Link>
                                    <Link to='billEvent'>
                                        <li><a >Eventos</a></li>
                                    </Link>

                                </ul>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
            <Outlet></Outlet>
        </>
    )
}
