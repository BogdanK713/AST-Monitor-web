import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'chart.js/auto';
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
        labels: data.map((_, index) => index),
        datasets: [{
            label: label,
            data: data,
            borderColor: 'rgba(75,192,192,1)',
            backgroundColor: 'rgba(75,192,192,0.2)',
            fill: true,
        }],
    });

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
                <div className="session-details-table">
                    <h3>Session Details on {new Date(selectedSession.start_time).toLocaleDateString()}</h3>
                    <table>
                        <tbody>
                            <tr>
                                <td>Altitude Avg:</td>
                                <td>{selectedSession.altitude_avg}</td>
                            </tr>
                            <tr>
                                <td>Altitude Max:</td>
                                <td>{selectedSession.altitude_max}</td>
                            </tr>
                            <tr>
                                <td>Altitude Min:</td>
                                <td>{selectedSession.altitude_min}</td>
                            </tr>
                            <tr>
                                <td>Ascent:</td>
                                <td>{selectedSession.ascent}</td>
                            </tr>
                            <tr>
                                <td>Calories:</td>
                                <td>{selectedSession.calories}</td>
                            </tr>
                            <tr>
                                <td>Descent:</td>
                                <td>{selectedSession.descent}</td>
                            </tr>
                            <tr>
                                <td>Distance:</td>
                                <td>{selectedSession.distance}</td>
                            </tr>
                            <tr>
                                <td>Duration:</td>
                                <td>{selectedSession.duration} seconds</td>
                            </tr>
                            <tr>
                                <td>HR Avg:</td>
                                <td>{selectedSession.hr_avg}</td>
                            </tr>
                            <tr>
                                <td>HR Max:</td>
                                <td>{selectedSession.hr_max}</td>
                            </tr>
                            <tr>
                                <td>HR Min:</td>
                                <td>{selectedSession.hr_min}</td>
                            </tr>
                            <tr>
                                <td>Total Distance:</td>
                                <td>{selectedSession.total_distance}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="chart-container">
                        <h4>Altitude Over Time</h4>
                        <Line data={formatChartData(selectedSession.altitudes, 'Altitude')} />
                        <h4>Heart Rate Over Time</h4>
                        <Line data={formatChartData(selectedSession.heartrates, 'Heart Rate')} />
                        <h4>Speed Over Time</h4>
                        <Line data={formatChartData(selectedSession.speeds, 'Speed')} />
                    </div>
                    {selectedSession.positions && selectedSession.positions.length > 0 && (
                        <div className="map-container">
                            <MapContainer center={selectedSession.positions[0]} zoom={13} style={{ height: "100%", width: "100%" }}>
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                <Polyline positions={selectedSession.positions} color="blue" />
                                <Marker position={selectedSession.positions[0]} icon={startIcon}>
                                    <Popup>Start Point</Popup>
                                </Marker>
                                <Marker position={selectedSession.positions[selectedSession.positions.length - 1]} icon={endIcon}>
                                    <Popup>End Point</Popup>
                                </Marker>
                            </MapContainer>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ImportPreview;
