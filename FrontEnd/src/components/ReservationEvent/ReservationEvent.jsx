export const ReservationEvent = ({dateEvent, cost, hoursEvent,user,hotel,event,additionalServices})=>{ 
    return (
        <>
            <td>{dateEvent}</td>
            <td>{cost}</td>
            <td>{hoursEvent}</td>
            <td>{user}</td>
            <td>{hotel}</td>
            <td>{event}</td>
        </>
    )
}