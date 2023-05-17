import { elements } from 'chart.js';
import React from 'react'

export const Hotel = ({name, locationH,qualification,numberRooms,manager}) => {
    return (
        <>
            <td>{name}</td>
            <td>{locationH}</td>
            <td>
                <div className="  button">
                    {(() => {
                        let elements =[] 
                        for (let i = 0; i < qualification; i++) {
                            elements.push(<div className="  fa-solid fa-star "></div>);
                        }
                        return elements;
                    })()}
                </div>
            </td>
            <td>{numberRooms}</td>
            <td>{manager}</td>
        </>
    )
}
