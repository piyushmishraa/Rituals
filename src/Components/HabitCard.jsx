import './HabitCard.css';
const HabitCard = ({ habitName, handleDone, currentStreak, deleteThisOne, isDoneToday }) => {
    return (
        <div className="habit-card">
            <button type="button" className={`check-circle ${isDoneToday ? 'done' : ''}`} onClick={handleDone} aria-label={`Mark ${habitName} done`}>
                {isDoneToday && '✓'}
            </button>
            <div className="habit-content">
                <h3 className="habit-name">{habitName}</h3>
            </div>
            <span className="habit-streak">⏱ {currentStreak} day streak</span>
            <button type="button" className="delete-btn" onClick={deleteThisOne}>Delete</button>
        </div>
    )
}
export default HabitCard;



