import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { io } from 'socket.io-client';
import { Bus, Hospital, Hotel, Landmark, MapPin } from 'lucide-react';
import { renderToString } from 'react-dom/server';

// Custom Marker Icons using Lucide
const createCustomIcon = (IconComponent, color) => {
    return L.divIcon({
        html: renderToString(
            <div style={{
                background: 'white',
                padding: '8px',
                borderRadius: '50%',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `2px solid ${color}`
            }}>
                <IconComponent size={20} color={color} />
            </div>
        ),
        className: 'custom-map-icon',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
    });
};

const busIcon = createCustomIcon(Bus, '#3b82f6');
const hospitalIcon = createCustomIcon(Hospital, '#ef4444');
const hotelIcon = createCustomIcon(Hotel, '#f59e0b');
const landmarkIcon = createCustomIcon(Landmark, '#8b5cf6');

const LiveFleetMap = () => {
    const [buses, setBuses] = useState({});
    const [pois, setPois] = useState([
        { id: 1, name: "City General Hospital", type: "hospital", lat: 17.3850, lng: 78.4867 },
        { id: 2, name: "Grand Elite Hotel", type: "hotel", lat: 17.3950, lng: 78.4967 },
        { id: 3, name: "Charminar Monument", type: "landmark", lat: 17.3616, lng: 78.4747 },
        { id: 4, name: "Apollo Health City", type: "hospital", lat: 17.4150, lng: 78.4167 },
        { id: 5, name: "Marriot Luxury Suites", type: "hotel", lat: 17.4250, lng: 78.4767 }
    ]);

    useEffect(() => {
        const socket = io(import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000');

        socket.on('busLocationUpdate', (data) => {
            setBuses(prev => ({
                ...prev,
                [data.busId]: {
                    ...data,
                    timestamp: new Date()
                }
            }));
        });

        return () => socket.disconnect();
    }, []);

    const getIcon = (type) => {
        switch(type) {
            case 'hospital': return hospitalIcon;
            case 'hotel': return hotelIcon;
            case 'landmark': return landmarkIcon;
            default: return landmarkIcon;
        }
    };

    return (
        <div style={{ height: '600px', width: '100%', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
            <MapContainer center={[17.3850, 78.4867]} zoom={12} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />

                {/* Live Buses */}
                {Object.values(buses).map(bus => (
                    <Marker key={bus.busId} position={[bus.lat, bus.lng]} icon={busIcon}>
                        <Popup>
                            <div style={{ color: '#000', padding: '5px' }}>
                                <strong style={{ fontSize: '1.1rem' }}>{bus.busId}</strong><br/>
                                <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>Live Tracking Active</span><br/>
                                <strong>Speed:</strong> {bus.speed} km/h<br/>
                                <strong>Heading:</strong> {bus.heading}°
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Points of Interest */}
                {pois.map(poi => (
                    <React.Fragment key={poi.id}>
                        <Marker position={[poi.lat, poi.lng]} icon={getIcon(poi.type)}>
                            <Popup>
                                <div style={{ color: '#000' }}>
                                    <strong>{poi.name}</strong><br/>
                                    <span style={{ textTransform: 'capitalize', color: '#666' }}>{poi.type} Point</span>
                                </div>
                            </Popup>
                        </Marker>
                        <Circle 
                            center={[poi.lat, poi.lng]} 
                            radius={500} 
                            pathOptions={{ 
                                color: poi.type === 'hospital' ? '#ef4444' : poi.type === 'hotel' ? '#f59e0b' : '#8b5cf6',
                                fillColor: poi.type === 'hospital' ? '#ef4444' : poi.type === 'hotel' ? '#f59e0b' : '#8b5cf6',
                                fillOpacity: 0.1 
                            }} 
                        />
                    </React.Fragment>
                ))}
            </MapContainer>

            {/* Map Overlay Stats */}
            <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 1000, background: 'rgba(15, 20, 28, 0.9)', padding: '15px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', color: '#fff', width: '200px' }}>
                <h4 style={{ margin: '0 0 10px', fontSize: '0.9rem', fontWeight: '800', color: '#3b82f6' }}>LIVE FLEET STATUS</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <span>Active Buses:</span>
                        <span style={{ fontWeight: 'bold' }}>{Object.keys(buses).length}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <span>Safe Zones:</span>
                        <span style={{ fontWeight: 'bold', color: '#10b981' }}>Active</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <span>Refresh Rate:</span>
                        <span style={{ fontWeight: 'bold' }}>2.0s</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveFleetMap;
