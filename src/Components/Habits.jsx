import { useEffect, useState } from 'react';
import { HabitsContext } from './HabitsContext.jsx';
import { formatDateKey, normalizeDateKey } from './dateUtils.js';

const STORAGE_KEY = 'ritual-habits';

const isValidEntry = (entry) =>
    entry &&
    normalizeDateKey(entry.date) &&
    typeof entry.count === 'number';

const normalizeHabits = (rawHabits) => {
    if (!Array.isArray(rawHabits)) {
        return [];
    }

    const seenNames = new Set();

    return rawHabits
        .filter((habit) => habit && typeof habit.name === 'string')
        .map((habit) => ({
            name: habit.name.trim(),
            values: Array.isArray(habit.values)
                ? habit.values
                    .map((entry) => ({
                        date: normalizeDateKey(entry?.date),
                        count: entry?.count > 0 ? 4 : 0
                    }))
                    .filter(isValidEntry)
                : []
        }))
        .filter((habit) => habit.name.length > 0)
        .filter((habit) => {
            const key = habit.name.toLowerCase();
            if (seenNames.has(key)) {
                return false;
            }

            seenNames.add(key);
            return true;
        });
};

const loadStoredHabits = () => {
    if (typeof window === 'undefined') {
        return [];
    }

    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            return [];
        }

        return normalizeHabits(JSON.parse(stored));
    } catch {
        return [];
    }
};

const HabitsProvider = ({ children }) => {
    const [habitsdata, setHabitsdata] = useState(() => loadStoredHabits());

    useEffect(() => {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(habitsdata));
        } catch {
            // Ignore storage failures so the app still works in restricted browsers.
        }
    }, [habitsdata]);

    const addHabit = (rawName) => {
        const name = rawName.trim();
        if (!name) {
            return { ok: false, reason: 'empty' };
        }

        const lowerName = name.toLowerCase();
        const alreadyExists = habitsdata.some((habit) => habit.name.toLowerCase() === lowerName);
        if (alreadyExists) {
            return { ok: false, reason: 'duplicate' };
        }

        if (habitsdata.length >= 5) {
            return { ok: false, reason: 'limit' };
        }

        setHabitsdata((prev) => [...prev, { name, values: [] }]);
        return { ok: true };
    };

    const markHabitDone = (targetName) => {
        const today = formatDateKey();

        setHabitsdata((prevData) =>
            prevData.map((habit) => {
                if (habit.name !== targetName) {
                    return habit;
                }

                const alreadyMarkedToday = habit.values.some((entry) => entry.date === today);
                if (alreadyMarkedToday) {
                    return habit;
                }

                return {
                    ...habit,
                    values: [...habit.values, { date: today, count: 4 }]
                };
            })
        );
    };

    const deleteHabit = (targetName) => {
        setHabitsdata((prevData) => prevData.filter((habit) => habit.name !== targetName));
    };

    return (
        <HabitsContext.Provider
            value={{
                habitsdata,
                setHabitsdata,
                addHabit,
                markHabitDone,
                deleteHabit
            }}
        >
            {children}
        </HabitsContext.Provider>
    )
}

export default HabitsProvider;
