export const ReservationRoom = ({dateStart, dateEnd, cost, user, hotel /* state*/}) => {
    return (
        <>
            <td>{dateStart}</td>
            <td>{dateEnd}</td>
            <td>{cost}</td>
            <td>{user}</td>
            <td>{hotel}</td>
        </>
    )
}
