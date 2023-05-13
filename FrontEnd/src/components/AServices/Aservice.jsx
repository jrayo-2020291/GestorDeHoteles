export const Aservice = ({name, description, cost,category})=>{ 
    return (
        <>
            <td>{name}</td>
            <td>{description}</td>
            <td>{cost}</td>
            <td>{category}</td>
        </>
    )
}