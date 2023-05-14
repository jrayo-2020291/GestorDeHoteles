export const Room = ({noRoom, category, peopleCapacity, price, availability, hotel }) => {
    return (
        <>
        <td>{noRoom}</td>
        <td>{category}</td>
        <td>{peopleCapacity}</td>
        <td>{price}</td>
        <td>{availability}</td>
        <td>{hotel}</td>
        </>
    )
}
