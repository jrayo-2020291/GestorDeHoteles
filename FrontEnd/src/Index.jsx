import React, { createContext, useState, useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import { AServiceTable } from './components/AServices/AServiceTable.jsx'
import { AddAService } from './components/AServices/AddAService.jsx'
import { UpdateAService } from './components/AServices/UpdateAService.jsx'
import { EventTable } from './components/Event/EventTable.jsx'
import { AddEvent } from './components/Event/AddEvent.jsx'
import { UpdateEvent } from './components/Event/UpdateEvent.jsx'
import { HotelTable } from './components/Hotel/HotelTable.jsx'
import { AddHotel } from './components/Hotel/AddHotel.jsx'
import { UpdateHotel } from './components/Hotel/UpdateHotel.jsx'
import { ReservationEventTable } from './components/ReservationEvent/ReservationEventTable.jsx'
import { AddReservationEvent } from './components/ReservationEvent/AddReservationEvent.jsx'
import { UpdateReservationEvent } from './components/ReservationEvent/UpdateReservationEvent.jsx'
import { ReservationRoomTable } from './components/ReservationRoom/ReservationRoomTable.jsx'
import { AddReservationRoom } from './components/ReservationRoom/AddReservationRoom.jsx'
import { UpdateReservationRoom } from './components/ReservationRoom/UpdateReservationRoom.jsx'
import { RoomTable } from './components/Room/RoomTable.jsx'
import { AddRoom } from './components/Room/AddRoom.jsx'
import { UpdateRoom } from './components/Room/UpdateRoom.jsx'
import { UserTable } from './components/User/UserTable.jsx'
import { AddUser } from './components/User/AddUser.jsx'
import { UpdateUser } from './components/User/UpdateUser.jsx'
import { NotFoundPage } from './pages/NotFoundPage.jsx'
import { LoginPage } from './pages/LoginPage.jsx'
import { HomePage } from './pages/HomePage.jsx'
import { DashBoardPage } from './pages/DashBoardPage.jsx'

export const AuthContext = createContext();

export const Index = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [dataUser, setDataUser] = useState({
      name: '',
      username: '',
      role: ''
    })


    useEffect(()=>{
        let token = localStorage.getItem('token')
        if(token) setLoggedIn(true)
        // const LoadExternalScript = ()=>{
        // const externalScript = document.createElement("script");
        // externalScript.id = "external";
        // externalScript.async = true;
        // externalScript.type ="text/javascript";
        // externalScript.setAttribute("crossorigin","anonymous")
        // document.body.appendChild(externalScript);
        // externalScript.src= '/src/main.js';
        // }
        // LoadExternalScript();
        // return()=>{
        // let externalScript = document.getElementById('external');
        // document.body.removeChild(externalScript)
        // }
    }, []);

    const routes = createBrowserRouter([
        {
            path: '/',
            element: <App></App>,
            errorElement: <NotFoundPage></NotFoundPage>,
            children: [
                {
                    path: '/',
                    element: <HomePage></HomePage>
                },
                {
                    path: '/login',
                    element: <LoginPage></LoginPage>
                },
                {
                    path: '/dashboard',
                    element: <DashBoardPage></DashBoardPage>,
                    children: [
                        {
                            path: 'aService',
                            element: <AServiceTable></AServiceTable>
                        },
                        {
                            path: 'addAService',
                            element: <AddAService></AddAService>
                        },
                        {
                            path: 'updateAService/:id',
                            element: <UpdateAService></UpdateAService>
                        },
                        {
                            path: 'event',
                            element: <EventTable></EventTable>
                        },
                        {
                            path: 'addEvent',
                            element: <AddEvent></AddEvent>
                        },
                        {
                            path: 'updateEvent/:id',
                            element: <UpdateEvent></UpdateEvent>
                        },
                        {
                            path: 'hotel',
                            element: <HotelTable></HotelTable>
                        },
                        {
                            path: 'addHotel',
                            element: <AddHotel></AddHotel>
                        },
                        {
                            path: 'updateHotel/:id',
                            element: <UpdateHotel></UpdateHotel>
                        },
                        {
                            path: 'reservationRoom',
                            element: <ReservationRoomTable></ReservationRoomTable>
                        },
                        {
                            path: 'addReservationRoom',
                            element: <AddReservationRoom></AddReservationRoom>
                        },
                        {
                            path: 'updateReservationRoom/:id',
                            element: <UpdateReservationRoom></UpdateReservationRoom>
                        },
                        {
                            path: 'reservationEvent',
                            element: <ReservationEventTable></ReservationEventTable>
                        },
                        {
                            path: 'addReservationEvent',
                            element: <AddReservationEvent></AddReservationEvent>
                        },
                        {
                            path: 'updateReservationEvent/:id',
                            element: <UpdateReservationEvent></UpdateReservationEvent>
                        },
                        {
                            path: 'room',
                            element: <RoomTable></RoomTable>
                        },
                        {
                            path: 'addRoom',
                            element: <AddRoom></AddRoom>
                        },
                        {
                            path: 'updateRoom/:id',
                            element: <UpdateRoom></UpdateRoom>
                        },
                        {
                            path: 'user',
                            element: <UserTable></UserTable>
                        },
                        {
                            path: 'addUser',
                            element: <AddUser></AddUser>
                        },
                        {
                            path: 'updateUser/:id',
                            element: <UpdateUser></UpdateUser>
                        },
                    ]
                }
            ]
        }
    ])
    return (
        <AuthContext.Provider value={{}}>
            <RouterProvider router={routes} />
        </AuthContext.Provider>
    )
}
