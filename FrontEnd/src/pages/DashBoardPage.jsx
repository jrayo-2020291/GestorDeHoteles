import React from 'react'
import { Outlet } from 'react-router-dom'
import Logo from '../assets/manager.png'
import { Link } from 'react-router-dom'

export const DashBoardPage = () => {

    return (
        <>
            <main>
                <header>
                    <nav>
                        <ul>
                            <Link to='user'>
                                <li><a href="#">Usuarios</a></li>
                            </Link>
                            <Link to='aService'>
                                <li><a href="#">Servicios</a></li>
                            </Link>
                            <Link to='event'>
                                <li><a href="#">Eventos</a></li>
                            </Link>
                            <Link to='hotel'>
                                <li><a href="#">Hoteles</a>
                                    <ul class="submenu">
                                        <Link to='graphTopHotels'>
                                            <li><a href="#">Grafica global</a></li>
                                        </Link>
                                    </ul>
                                </li>
                            </Link>
                            <Link to='room'>
                                <li><a href="#">Habitaciones</a></li>
                            </Link>
                            <li><a href="#">Reservaciones</a>
                                <ul class="submenu">
                                    <Link to='reservationRoom'>
                                        <li><a href="#">Habitaciones</a></li>
                                    </Link>
                                    <Link to='reservationEvent'>
                                        <li><a href="#">Eventos</a></li>
                                    </Link>

                                </ul>
                            </li>
                            <li><a href="#">Facturas</a>
                                <ul class="submenu">
                                    <Link to='billRoom'>
                                        <li><a href="#">Habitaciones</a></li>
                                    </Link>
                                    <Link to='billEvent'>
                                        <li><a href="#">Eventos</a></li>
                                    </Link>
                                </ul>
                            </li>
                        </ul>
                    </nav>
                </header>
            </main>
            <Outlet></Outlet>
        </>
    )
}
