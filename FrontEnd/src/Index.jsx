import React, { createContext, useState, useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import { AddService } from './components/ReservationEvent/AddService.jsx'
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
import {EventForHotel} from './components/Hotel/EventsForHotel.jsx'
import { AddRoomReservationRoom } from './components/ReservationRoom/AddRoomReservationRoom.jsx'
import { AddServiceReservationRoom } from './components/ReservationRoom/AddServiceReservationRoom.jsx'
import { BillEventTable } from './components/Bill/BillEventTable.jsx'
import { BillRoomTable } from './components/Bill/BillRoomTable.jsx'
import { BillRoom } from './components/Bill/BillRoom.jsx' 
import { BillService } from './components/Bill/BillService.jsx'
import { EventService } from './components/Bill/EventService.jsx'
import { GraphTopHotels } from './components/Hotel/GraphTopHotels.jsx'
import {Register} from './pages/Register.jsx'

export const AuthContext = createContext();

export const Index = () => {
    const [loggedIn, setLoggedIn] = useState(false)

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
                    path: '/register',
                    element: <Register></Register>
                },
                {
                    path: '/dashboard',
                    element: loggedIn ? <DashBoardPage></DashBoardPage> : <LoginPage></LoginPage>,
                    children: [
                        {
                            path: 'aService',
                            element: loggedIn ? <AServiceTable></AServiceTable> : <LoginPage></LoginPage>
                        },
                        {
                            path: 'addAService',
                            element: loggedIn ? <AddAService></AddAService> : <LoginPage></LoginPage>
                        },
                        {
                            path: 'updateAService/:id',
                            element: loggedIn ? <UpdateAService></UpdateAService> : <LoginPage></LoginPage>
                        },
                        {
                            path: 'event',
                            element: loggedIn ? <EventTable></EventTable> :<LoginPage></LoginPage>
                        },
                        {
                            path: 'addEvent',
                            element: loggedIn ? <AddEvent></AddEvent> : <LoginPage></LoginPage>
                        },
                        {
                            path: 'updateEvent/:id',
                            element: loggedIn ? <UpdateEvent></UpdateEvent>: <LoginPage></LoginPage>
                        },
                        {
                            path: 'hotel',
                            element: loggedIn ? <HotelTable></HotelTable> : <LoginPage></LoginPage>
                        },
                        {
                            path: 'graphTopHotels',
                            element: loggedIn ? <GraphTopHotels></GraphTopHotels> : <LoginPage></LoginPage>
                        },
                        {
                            path: 'addHotel',
                            element: loggedIn ? <AddHotel></AddHotel> : <LoginPage></LoginPage> 
                        },
                        {
                            path: 'updateHotel/:id',
                            element: loggedIn ? <UpdateHotel></UpdateHotel> : <LoginPage></LoginPage>
                        },
                        {
                            path: 'hotel/event/:id',
                            element: loggedIn ? <EventForHotel></EventForHotel> : <LoginPage></LoginPage>
                        },
                        {
                            path: 'reservationRoom',
                            element: loggedIn ? <ReservationRoomTable></ReservationRoomTable> : <LoginPage></LoginPage>
                        },
                        {
                            path: 'addReservationRoom',
                            element: loggedIn ? <AddReservationRoom></AddReservationRoom> : <LoginPage></LoginPage>
                        },
                        {
                            path: 'updateReservationRoom/:id',
                            element: loggedIn ? <UpdateReservationRoom></UpdateReservationRoom> : <LoginPage></LoginPage>
                        },
                        {
                            path: 'addServiceReservationRoom/:id',
                            element: loggedIn ? <AddServiceReservationRoom></AddServiceReservationRoom> : <LoginPage></LoginPage>
                        },
                        {
                            path: 'addRoomReservationRoom/:id',
                            element: loggedIn ? <AddRoomReservationRoom></AddRoomReservationRoom> : <LoginPage></LoginPage>
                        },
                        {
                            path: 'reservationEvent',
                            element: loggedIn ? <ReservationEventTable></ReservationEventTable> : <LoginPage></LoginPage>
                        },
                        {
                            path: 'addReservationEvent',
                            element: loggedIn ? <AddReservationEvent></AddReservationEvent> : <LoginPage></LoginPage>
                        },
                        {
                            path: 'addService/:id',
                            element:<AddService></AddService>
                        },
                        {
                            path: 'updateReservationEvent/:id',
                            element: loggedIn ? <UpdateReservationEvent></UpdateReservationEvent> : <LoginPage></LoginPage>
                        },
                        {
                            path: 'room',
                            element: loggedIn ? <RoomTable></RoomTable> : <LoginPage></LoginPage>
                        },
                        {
                            path: 'addRoom',
                            element: loggedIn ? <AddRoom></AddRoom> : <LoginPage></LoginPage>
                        },
                        {
                            path: 'updateRoom/:id',
                            element: loggedIn ? <UpdateRoom></UpdateRoom> : <LoginPage></LoginPage>
                        },
                        {
                            path: 'user',
                            element: loggedIn ? <UserTable></UserTable> : <LoginPage></LoginPage>
                        },
                        {
                            path: 'addUser',
                            element: loggedIn ? <AddUser></AddUser> : <LoginPage></LoginPage>
                        },
                        {
                            path: 'updateUser/:id',
                            element: loggedIn ? <UpdateUser></UpdateUser> : <LoginPage></LoginPage>
                        },
                        {
                            path: 'billEvent',
                            element: loggedIn ? <BillEventTable></BillEventTable> : <LoginPage></LoginPage>
                        },
                        {
                            path: 'billRoom',
                            element: loggedIn ? <BillRoomTable></BillRoomTable> : <LoginPage></LoginPage>
                        },
                        {
                            path: 'billRoomRooms/:id',
                            element: loggedIn ? <BillRoom></BillRoom> : <LoginPage></LoginPage>
                        },
                        {
                            path: 'billRoomServices/:id',
                            element: loggedIn ? <BillService></BillService> : <LoginPage></LoginPage>
                        },
                        {
                            path: 'billEventServices/:id',
                            element: loggedIn ? <EventService></EventService> : <LoginPage></LoginPage>
                        },
                    ]
                }
            ]
        }
    ])
    return (
        <AuthContext.Provider value={{loggedIn, setLoggedIn}}>
            <RouterProvider router={routes} />
        </AuthContext.Provider>
    )
}
