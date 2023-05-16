export const ReservationEvent = ({date, cost, hours,user,hotel,event,additionalServices})=>{ 
    return (
        <>
            <td>{date}</td>
            <td>{cost}</td>
            <td>{hours}</td>
            <td>{user}</td>
            <td>{hotel}</td>
            <td>{event}</td>
            <td>{additionalServices}</td>
        </>
    )
}