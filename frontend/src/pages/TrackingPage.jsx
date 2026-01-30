import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import PremiumBackButton from '../components/PremiumBackButton';

// Fix Leaflet Default Icon Issue in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const socket = io('http://localhost:5000'); // Connect to backend

const TrackingPage = () => {
    const { pnr } = useParams();
    const [busLocation, setBusLocation] = useState(null);
    const [status, setStatus] = useState('Connecting to satellite...');

    useEffect(() => {
        socket.emit('join_bus', pnr);

        socket.on('bus_location', (data) => {
            setBusLocation(data);
            setStatus(`Live Tracking: ${data.speed} - Near ${data.locationName}`);
        });

        return () => {
            socket.off('bus_location');
        };
    }, [pnr]);

    return (
        <div style={{ height: '100vh', width: '100vw', background: '#0f141c', position: 'relative' }}>
            {/* Header Overlay */}
            <div style={{
                position: 'absolute',
                top: 20,
                left: 20,
                zIndex: 1000,
                background: 'rgba(15, 20, 28, 0.9)',
                padding: '20px',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                width: '300px'
            }}>
                <PremiumBackButton to="/my-bookings" label="Back to Bookings" />
                <h2 style={{ color: '#fff', margin: '10px 0 5px 0', fontSize: '1.2rem' }}>Live Bus Tracking</h2>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>PNR: <span style={{ color: '#fff', fontWeight: 'bold' }}>{pnr}</span></p>
                
                <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <div style={{ width: '10px', height: '10px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' }}></div>
                        <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.85rem' }}>{status}</span>
                    </div>
                </div>
            </div>

            {/* Map */}
            {busLocation ? (
                <MapContainer center={[busLocation.lat, busLocation.lng]} zoom={10} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    />
                    <Marker position={[busLocation.lat, busLocation.lng]}>
                        <Popup>
                            <div style={{ textAlign: 'center' }}>
                                <b>Your Bus is Here</b><br />
                                Speed: {busLocation.speed}
                            </div>
                        </Popup>
                    </Marker>
                </MapContainer>
            ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#fff' }}>
                    <p>Locating bus signal...</p>
                </div>
            )}
        </div>
    );
};

export default TrackingPage;
