import React from 'react'
import { Outlet } from 'react-router-dom'

export const DashBoardPage = () => {
    return (
        <>
        <div>DashBoardPage</div>
        <Outlet></Outlet>
        </>
    )
}