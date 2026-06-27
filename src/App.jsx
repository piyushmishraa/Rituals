import { Routes, Route, NavLink } from 'react-router';
import Home from "./pages/Home.jsx";
import History from "./pages/History.jsx";
import Stats from "./pages/Stats.jsx";
import HabitsProvider from './Components/Habits.jsx';


import './App.css'

function App() {


    return (
        <>
            <HabitsProvider>
                <nav className="navbar">
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/history">History</NavLink>
                    <NavLink to="/stats">Stats</NavLink>
                </nav>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/stats" element={<Stats />} />
                </Routes>
            </HabitsProvider>

        </>
    )
}

export default App
