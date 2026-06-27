const Pills = ({ name, handleSelect, isActive }) => {
    return (
        <button
            type="button"
            className={`pill ${isActive ? 'pill-active' : ''}`}
            onClick={handleSelect}
        >
            {name}
        </button>
    )
}
export default Pills;
