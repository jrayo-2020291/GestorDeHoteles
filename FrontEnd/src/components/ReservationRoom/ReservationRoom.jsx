export const ReservationRoom = ({dateStart, dateEnd, cost, user, hotel, room, additionalServices /* state*/}) => {
    return (
        <>
            <td>{dateStart}</td>
            <td>{dateEnd}</td>
            <td>{cost}</td>
            <td>{user}</td>
            <td>{hotel}</td>
            <td>{room}</td>
            <td>{additionalServices}</td>
        </>
    )
}
