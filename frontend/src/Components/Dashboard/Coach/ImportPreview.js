import React, { useState } from 'react';
import { Line, Pie, Doughnut } from 'react-chartjs-2';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'chart.js/auto';
import 'react-calendar/dist/Calendar.css';
import 'leaflet/dist/leaflet.css';
import '../../../Styles/AthleteProfile.css';
import '../../../Styles/ImportPreview.css';

const startIcon = new L.Icon({
    iconUrl: 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const endIcon = new L.Icon({
    iconUrl: 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const ImportPreview = () => {
    const [selectedSession, setSelectedSession] = useState(null);
    const [error, setError] = useState('');

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) {
            setError('No file selected');
            return;
        }

        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (fileExtension === 'json') {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const sessionData = JSON.parse(e.target.result);
                    setSelectedSession(sessionData);
                    setError('');
                    console.log('Imported Session:', sessionData);
                } catch (err) {
                    setError('Error reading JSON file');
                    console.error('Error reading file:', err);
                }
            };
            reader.readAsText(file);
        } else {
            setError('Unsupported file type, please upload a JSON file generated by our exporter');
            console.error('Unsupported file type');
        }
    };

    const formatChartData = (data, label) => ({
        labels: data ? data.map((_, index) => index) : [],
        datasets: [{
            label: label,
            data: data ? data.map(value => (value !== null && value !== undefined) ? parseFloat(value.toFixed(2)) : value) : [],
            borderColor: 'rgba(75,192,192,1)',
            backgroundColor: 'rgba(75,192,192,0.2)',
            fill: true,
        }],
    });

    const getHillData = () => {
        if (!selectedSession || !selectedSession.hill_data) {
            return { labels: [], datasets: [] };
        }
        const { num_hills, avg_altitude, avg_ascent, distance_hills, hills_share } = selectedSession.hill_data;
        return {
            labels: ['Number of Hills', 'Avg Altitude (m)', 'Avg Ascent (m)', 'Distance Hills (km)', 'Hills Share (%)'],
            datasets: [
                {
                    label: 'Hill Data',
                    data: [
                        num_hills,
                        avg_altitude,
                        avg_ascent,
                        distance_hills,
                        hills_share * 100,
                    ],
                    backgroundColor: [
                        'rgba(75,192,192,0.6)',
                        'rgba(75,75,192,0.6)',
                        'rgba(192,75,75,0.6)',
                        'rgba(75,192,75,0.6)',
                        'rgba(192,192,75,0.6)',
                    ],
                    borderWidth: 1
                },
            ],
        };
    };

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="import-preview-container">
             <h2>Import and Preview Training Session</h2>
            <p>Here you can import and preview training sessions shared by others.</p>
            <label className="custom-file-input">
                Choose a file
                <input type="file" onChange={handleFileUpload} />
            </label>
            {error && <p className="error-message">{error}</p>}

            {selectedSession && (
                <div className="athlete-profile-container">
                    <div className="athlete-profile">
                        <h3>Session Details</h3>
                        <p>Details of your training session on {new Date(selectedSession.start_time).toLocaleDateString()}</p>
                        <div className="session-cards">
                            <div className="card">
                                <h4>Altitude Avg</h4>
                                <p>{parseFloat(selectedSession.altitude_avg).toFixed(2)} m</p>
                            </div>
                            <div className="card">
                                <h4>Altitude Max</h4>
                                <p>{parseFloat(selectedSession.altitude_max).toFixed(2)} m</p>
                            </div>
                            <div className="card">
                                <h4>Altitude Min</h4>
                                <p>{parseFloat(selectedSession.altitude_min).toFixed(2)} m</p>
                            </div>
                            <div className="card">
                                <h4>Ascent</h4>
                                <p>{parseFloat(selectedSession.ascent).toFixed(2)} m</p>
                            </div>
                            <div className="card">
                                <h4>Calories</h4>
                                <p>{parseFloat(selectedSession.calories).toFixed(2)} kcal</p>
                            </div>
                            <div className="card">
                                <h4>Descent</h4>
                                <p>{parseFloat(selectedSession.descent).toFixed(2)} m</p>
                            </div>
                            <div className="card">
                                <h4>Distance</h4>
                                <p>{parseFloat(selectedSession.distance).toFixed(2)} km</p>
                            </div>
                            <div className="card">
                                <h4>Duration</h4>
                                <p>{parseFloat(selectedSession.duration).toFixed(2)} seconds</p>
                            </div>
                            <div className="card">
                                <h4>HR Avg</h4>
                                <p>{parseFloat(selectedSession.hr_avg).toFixed(2)} bpm</p>
                            </div>
                            <div className="card">
                                <h4>HR Max</h4>
                                <p>{parseFloat(selectedSession.hr_max).toFixed(2)} bpm</p>
                            </div>
                            <div className="card">
                                <h4>HR Min</h4>
                                <p>{parseFloat(selectedSession.hr_min).toFixed(2)} bpm</p>
                            </div>
                            <div className="card">
                                <h4>Total Distance</h4>
                                <p>{parseFloat(selectedSession.total_distance).toFixed(2)} km</p>
                            </div>
                        </div>

                        {selectedSession.weather && (
                            <div className="weather-container">
                                <h4>Weather Data</h4>
                                <p>Weather conditions during your session:</p>
                                <div className="weather-card">
                                    <p><strong>Temperature:</strong> {selectedSession.weather.temp_c ? `${parseFloat(selectedSession.weather.temp_c).toFixed(2)}°C` : 'N/A'}</p>
                                    <p><strong>Condition:</strong> {selectedSession.weather.condition ? selectedSession.weather.condition : 'N/A'}</p>
                                    <p><strong>Wind Speed:</strong> {selectedSession.weather.wind_kph ? `${parseFloat(selectedSession.weather.wind_kph).toFixed(2)} kph` : 'N/A'}</p>
                                    <p><strong>Humidity:</strong> {selectedSession.weather.humidity ? `${parseFloat(selectedSession.weather.humidity).toFixed(2)}%` : 'N/A'}</p>
                                </div>
                            </div>
                        )}
                        {selectedSession.positions && selectedSession.positions.length > 0 && (
                            <div className="map-container">
                                <h4>Route Map</h4>
                                <p>View the route you took during your training session:</p>
                                <MapContainer center={selectedSession.positions[0]} zoom={13} style={{ height: "80%", width: "100%" }}>
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    <Polyline
                                        positions={selectedSession.positions}
                                        color="blue"
                                    />
                                    <Marker position={selectedSession.positions[0]} icon={startIcon}>
                                        <Popup>Start Point</Popup>
                                    </Marker>
                                    <Marker position={selectedSession.positions[selectedSession.positions.length - 1]} icon={endIcon}>
                                        <Popup>End Point</Popup>
                                    </Marker>
                                </MapContainer>
                            </div>
                        )}
                        <div className="chart-row">
                            <div className="chart-container">
                                <h4>Hill Data</h4>
                                <p>Analysis of hills encountered during the session:</p>
                                <Doughnut data={getHillData()} options={{plugins: {legend: {display: true}}}}/>
                            </div>
                            <div className="chart-container">
                                <h4>Hills Share</h4>
                                <p>Percentage of session spent on hills vs flat terrain:</p>
                                {selectedSession.hill_data && (
                                    <Pie data={{
                                        labels: ['Hills', 'Flat'],
                                        datasets: [{
                                            data: [selectedSession.hill_data.hills_share * 100, 100 - selectedSession.hill_data.hills_share * 100],
                                            backgroundColor: ['rgba(75,192,192,0.6)', 'rgba(192,75,75,0.6)'],
                                        }]
                                    }} options={{ plugins: { legend: { display: true }}}} />
                                )}
                            </div>
                        </div>
                        <div className="chart-container">
                            <h4>Altitude Over Time</h4>
                            <p>Track the change in altitude throughout the session:</p>
                            <Line data={formatChartData(selectedSession.altitudes, 'Altitude')} options={{ plugins: { legend: { display: true }}}} />
                        </div>
                        <div className="chart-container">
                            <h4>Heart Rate Over Time</h4>
                            <p>Monitor your heart rate throughout the session:</p>
                            <Line data={formatChartData(selectedSession.heartrates, 'Heart Rate')} options={{ plugins: { legend: { display: true }}}} />
                        </div>
                        <div className="chart-container">
                            <h4>Speed Over Time</h4>
                            <p>Track your speed throughout the session:</p>
                            <Line data={formatChartData(selectedSession.speeds, 'Speed')} options={{ plugins: { legend: { display: true }}}} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImportPreview;
