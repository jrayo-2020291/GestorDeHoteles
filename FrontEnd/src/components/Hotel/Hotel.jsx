import React from 'react'

export const Hotel = (name, locationH,qualification,numberRooms) => {
    return (
        <>
            <td>{name}</td>
            <td>{locationH}</td>
            <td>{qualification}</td>
            <td>{numberRooms}</td>
        </>
    )
}
