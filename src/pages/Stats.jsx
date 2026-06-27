import { useContext } from 'react';
import Pills from '../Components/Pills.jsx';
import { HabitsContext } from '../Components/HabitsContext.jsx';
import { useState } from 'react';
import StatsData from '../Components/StatsData.jsx';
const Stats = () => {
    const { habitsdata } = useContext(HabitsContext);
    const [currentlySelected, setCurrentlySelected] = useState('');
    const handleSelect = (habitname) => {
        setCurrentlySelected(habitname);
    }


    return (
        <div className="page">
            <h1 className="page-title">Stats</h1>
            <p className="page-subtitle">Track your performance over time.</p>
            <p className="section-label">SELECT HABIT</p>
            <div className="pills-row">
                {habitsdata.map((habit) => (
                    <Pills key={habit.name} name={habit.name} handleSelect={() => handleSelect(habit.name)} isActive={currentlySelected === habit.name} />
                ))}
            </div>
            {currentlySelected ? <StatsData habitName={currentlySelected} /> : <div className="empty-state">Select a habit to view its stats.</div>}
        </div>
    )
}

export default Stats
