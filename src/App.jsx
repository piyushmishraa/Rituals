import { useState } from 'react'
import { Routes, Route } from 'react-router';
import Home from "./pages/Home.jsx";
import History from "./pages/History.jsx";
import Stats from "./pages/Stats.jsx";


import './App.css'

function App() {


    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/history" element={<History />} />
                <Route path="/stats" element={<Stats />} />
            </Routes>
        </>
    )
}

export default App
