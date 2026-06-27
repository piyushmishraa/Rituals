import { useContext } from 'react';
import { useState, useEffect } from 'react';
import HabitCard from '../Components/HabitCard.jsx';
import { HabitsContext } from '../Components/HabitsContext.jsx';
import { formatDateKey, shiftDateKey } from '../Components/dateUtils.js';
//  const tempArray = [{
//     values: [{ date: '2016/01/11', count: 2 },
//     { date: '2016/01/12', count: 20 },
//     { date: '2016/01/13', count: 10 },
//     ]
// },
//
// {
//     values: [{ date: '2016/01/11', count: 2 },
//     { date: '2016/01/12', count: 20 },
//     { date: '2016/01/13', count: 10 },
//     ]
// },
//
// {
//     values: [{ date: '2016/01/11', count: 2 },
//     { date: '2016/01/12', count: 20 },
//     { date: '2016/01/13', count: 10 },
//     ]
// }];
//

//     [ {name:"", value: [{}, {}] },  {name :"", value: [{}, {}] },  {name :"", values: [{}, {}] }]
const Home = () => {
    const [dt, setDt] = useState('');
    const { habitsdata, addHabit, markHabitDone, deleteHabit } = useContext(HabitsContext);
    const [habitName, setHabitName] = useState("");

    useEffect(() => {
        const date = new Date().toLocaleString();
        setDt(date);
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        const result = addHabit(habitName);
        if (result.ok) {
            setHabitName("");
            return;
        }

        if (result.reason === 'limit') {
            window.alert('No more than 5 habits are allowed.');
        }
    }

    const getTodayKey = () => formatDateKey();

    const isDoneToday = (habit) => {
        const today = getTodayKey();

        return habit.values.some(v => v.date === today);
    }
    const countThisDone = (targetName) => {
        markHabitDone(targetName);
    }
    const deleteThisOne = (targetName) => {
        deleteHabit(targetName);
    }
    const currentStreaklogic = (habitName) => {
        const habitWeWant = habitsdata.filter((habit) => {
            return habit.name === habitName;
        })

        const ogHabit = habitWeWant.length > 0 ? habitWeWant[0] : null;

        if (!ogHabit) {
            return 0;
        }

        const dateData = ogHabit.values;
        const countByDate = {};
        dateData.forEach(entry => {
            const key = entry.date;
            countByDate[key] = entry.count;
        });

        let currentStreak = 0;
        let cursorKey = getTodayKey();

        while (true) {
            const count = countByDate[cursorKey] || 0;

            if (count > 0) {
                currentStreak++;
                cursorKey = shiftDateKey(cursorKey, -1);
            } else {
                if (currentStreak === 0 && cursorKey === getTodayKey()) {
                    cursorKey = shiftDateKey(cursorKey, -1);
                    continue;
                }
                break;
            }
        }
        return currentStreak;
    }
    const today = getTodayKey();
    const todayCompleted = habitsdata.reduce(
        (count, habit) => count + (habit.values.some((entry) => entry.date === today) ? 1 : 0),
        0
    );
    const progressValue = habitsdata.length ? todayCompleted / habitsdata.length : 0;
    return (

        <div className="page">
            <p className="date-label">{dt}</p>
            <h3 className="greeting">Good Morning</h3>

            <div className="progress-card">
                <div className="progress-card-header">
                    <span>Today's progress</span>
                    <span>{todayCompleted}/{habitsdata.length} habits</span>
                </div>
                <progress className="progress-bar" value={progressValue} />
                <p className="progress-percent">
                    {Math.round(progressValue * 100)}% complete
                </p>
            </div>

            <form className="add-habit-form" onSubmit={(e) => { handleSubmit(e) }}>
                <input className="add-habit-input" type="text" placeholder="Add a new habit..." value={habitName} onChange={(e) => setHabitName(e.target.value)} maxLength={50} />
                <button className="add-habit-btn" type="submit">Add habit</button>
            </form>

            <p className="section-label">TODAY</p>

            <div className="habit-list">
                {habitsdata.map((curr) => (
                    <HabitCard key={curr.name} habitName={curr.name} handleDone={() => countThisDone(curr.name)} currentStreak={currentStreaklogic(curr.name)} deleteThisOne={() => deleteThisOne(curr.name)}
                        isDoneToday={isDoneToday(curr)} />
                ))}
            </div>
        </div>
    )
}

export default Home
