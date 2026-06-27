import { useContext } from 'react';
import { HabitsContext } from '../Components/HabitsContext.jsx';
import { formatDateKey, parseDateKey, shiftDateKey } from './dateUtils.js';
import './StatsData.css';

const StatsData = ({ habitName }) => {
    const { habitsdata } = useContext(HabitsContext);
    const habitWeWant = habitsdata.filter((habit) => {
        return habit.name === habitName;
    })
    const ogHabit = habitWeWant.length > 0 ? habitWeWant[0] : null;
    if (!ogHabit) {
        return <h3>No habit found</h3>;
    }
    const dateData = ogHabit.values;
    if (!dateData || dateData.length === 0) {
        return <h3>No data available</h3>;
    }

    // completion rate logic (unchanged)
    const startingDateString = dateData[0].date;
    const lastDateString = dateData[dateData.length - 1].date;
    const startingDt = parseDateKey(startingDateString);
    const lastDt = parseDateKey(lastDateString);
    const totalDays = Math.max(
        Math.round((lastDt - startingDt) / (1000 * 60 * 60 * 24)) + 1,
        1
    );
    const entryFilled = dateData.length;
    const completionRate = (entryFilled / totalDays) * 100;

    // current streak logic (unchanged)
    const countByDate = {};
    dateData.forEach(entry => {
        const key = entry.date;
        countByDate[key] = entry.count;
    });
    let currentStreak = 0;
    let cursorKey = formatDateKey();
    while (true) {
        const count = countByDate[cursorKey] || 0;
        if (count > 0) {
            currentStreak++;
            cursorKey = shiftDateKey(cursorKey, -1);
        } else {
            if (currentStreak === 0 && cursorKey === formatDateKey()) {
                cursorKey = shiftDateKey(cursorKey, -1);
                continue;
            }
            break;
        }
    }

    // best streak logic (unchanged)
    const sortedDates = [...dateData]
        .filter(e => e.count > 0)
        .map(e => parseDateKey(e.date))
        .sort((a, b) => a - b);
    let bestStreak = sortedDates.length > 0 ? 1 : 0;
    let runningStreak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
        const diffDays = Math.round((sortedDates[i] - sortedDates[i - 1]) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
            runningStreak++;
            bestStreak = Math.max(bestStreak, runningStreak);
        } else if (diffDays > 1) {
            runningStreak = 1;
        }
    }

    // ===== NEW: last 7 days data for bar chart =====
    const last7Days = [];
    const dayCursor = parseDateKey(formatDateKey());
    for (let i = 6; i >= 0; i--) {
        const d = new Date(dayCursor);
        d.setDate(dayCursor.getDate() - i);
        const key = formatDateKey(d);
        const completed = (countByDate[key] || 0) > 0;
        last7Days.push({
            label: d.toLocaleDateString('en-US', { weekday: 'short' }),
            completed,
            isToday: i === 0
        });
    }
    // ===== END NEW =====

    return (
        <div className="stats-content">
            <div className="stats-cards">
                <div className="stat-card">
                    <p className="stat-label">Completion rate</p>
                    <h2 className="stat-value">{completionRate.toFixed(0)}%</h2>
                    <p className="stat-sub">overall</p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">Current streak</p>
                    <h2 className="stat-value">{currentStreak}d</h2>
                    <p className="stat-sub">days in a row</p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">Best streak</p>
                    <h2 className="stat-value">{bestStreak}d</h2>
                    <p className="stat-sub">all time</p>
                </div>
            </div>

            <div className="bar-chart-card">
                <div className="bar-chart-header">
                    <h3>Last 7 days</h3>
                    <span className="bar-chart-sub">Habit completed per day</span>
                </div>
                <div className="bar-chart">
                    {last7Days.map((day, idx) => (
                        <div className="bar-col" key={idx}>
                            <div className={`bar ${day.completed ? 'bar-filled' : ''}`}></div>
                            <span className={`bar-label ${day.isToday ? 'bar-label-today' : ''}`}>{day.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <p className="showing-for">Showing data for: {habitName}</p>
        </div>
    )
}
export default StatsData;
