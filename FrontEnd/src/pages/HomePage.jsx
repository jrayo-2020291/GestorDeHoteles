import React from 'react'
import { Link } from 'react-router-dom'
import img1 from '../assets/manager.png'
import img2 from '../assets/travel.png'

export const HomePage = () => {
    return (
        <>
            <main>
                <div className="big-wrapper light">
                    <header>
                        <div className="cont">
                            <div className="logo">
                                <img src={img1} />
                                <h3>Hoteleria Johnson</h3>
                            </div>

                            <div className="links">
                                <ul>
                                    <li><a href="#">Nosotros</a></li>
                                    <li><a href="#">Ubicación</a></li>
                                    <Link to='/login'>
                                    <li><a href="#" className="btn">Inicia Sesión</a></li>
                                    </Link>                                    
                                </ul>
                            </div>

                        </div>
                        <div className="overlay"></div>
                    </header>
                    <div className="showcase-area">
                        <div className="cont">
                            <div className="left">
                                <div className="big-title">
                                    <h1>¿Cuándo te gustaría alojarse?</h1>
                                </div>
                                <p className="text">
                                    Dedicados a la industria de la hospitalidad  desde hace más de 27 años, con una larga trayectoria y experiencia que nos permite brindarte la mejor asesoría en confort y servicio.
                                </p>
                                <div className="cta">
                                    <a href="#" className="btn">Saber mas</a>
                                </div>
                            </div>
                            <div className="right">
                                <img src={img2} className="person" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
