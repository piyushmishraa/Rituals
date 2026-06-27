import HeatMap from '@uiw/react-heat-map';
import { useContext, useEffect, useState } from 'react';
import { HabitsContext } from '../Components/HabitsContext.jsx';
import '../Components/History.css';

const History = () => {
    const { habitsdata } = useContext(HabitsContext);
    const [heatMapWidth, setHeatMapWidth] = useState(850);

    useEffect(() => {
        const updateWidth = () => {
            const available = window.innerWidth - 64;
            setHeatMapWidth(Math.max(320, Math.min(850, available)));
        };

        updateWidth();
        window.addEventListener('resize', updateWidth);

        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    const getStartDate = () => {
        const d = new Date();
        d.setMonth(d.getMonth() - 6);
        return d;
    };
    return (
        <div className="page">
            <h1 className="page-title">History</h1>
            <p className="page-subtitle">Your habit activity over the last 6 months.</p>

            <div className="heatmap-legend">
                <span>Less</span>
                <span className="legend-swatch" style={{ background: '#EBEDF0' }}></span>
                <span className="legend-swatch" style={{ background: '#D6D6D6' }}></span>
                <span className="legend-swatch" style={{ background: '#8C8C8C' }}></span>
                <span className="legend-swatch" style={{ background: '#1a1a1a' }}></span>
                <span>More</span>
            </div>

            <div className="heatmap-card">
                {habitsdata.length ? habitsdata.map((curr) => (
                    <div className="heatmap-block" key={curr.name}>
                        <div className="heatmap-block-header">
                            <h3>{curr.name}</h3>
                            <span className="heatmap-period">Last 6 months</span>
                        </div>
                        <HeatMap
                            width={heatMapWidth}
                            value={curr.values}
                            weekLabels={['', 'Mon', '', 'Wed', '', 'Fri', '']}
                            startDate={getStartDate()}
                            endDate={new Date()}
                            panelColors={{
                                0: '#EBEDF0',
                                1: '#D6D6D6',
                                2: '#8C8C8C',
                                3: '#404040',
                                4: '#1a1a1a'
                            }}
                        />
                    </div>
                )) : <div className="empty-state">Add a habit to see your history heatmap.</div>}
            </div>
        </div>
    )
}
export default History
