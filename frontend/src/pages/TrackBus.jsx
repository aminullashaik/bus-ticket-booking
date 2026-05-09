import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import PremiumBackButton from '../components/PremiumBackButton';
import { useTranslation } from '../utils/LanguageContext';
import api from '../utils/api';
import { MapPin, Navigation, Map as MapIcon, Bell, Clock, Play, AlertTriangle, CheckCircle } from 'lucide-react';

const userIcon = new L.DivIcon({
    className: 'custom-user-icon',
    html: '<div style="background-color: #3b82f6; width: 18px; height: 18px; border-radius: 50%; border: 3px solid #fff; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
});

const busIcon = new L.DivIcon({
    className: 'custom-bus-icon',
    html: '<div style="background-color: #10b981; width: 30px; height: 30px; border-radius: 50%; border: 3px solid #fff; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 15px rgba(16, 185, 129, 0.8);"><span style="color: white; font-size: 14px;">🚌</span></div>',
    iconSize: [36, 36],
    iconAnchor: [18, 18]
});

const stopIcon = new L.DivIcon({
    className: 'custom-stop-icon',
    html: '<div style="background-color: #f59e0b; width: 12px; height: 12px; border-radius: 50%; border: 2px solid #fff;"></div>',
    iconSize: [16, 16],
    iconAnchor: [8, 8]
});

const TrackBus = () => {
    const socketRef = useRef(null);

    useEffect(() => {
        const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';
        socketRef.current = io(socketUrl, { transports: ['websocket', 'polling'] });
        
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, []);

    const { pnr } = useParams();
    const [busLocation, setBusLocation] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [destination, setDestination] = useState('Loading...');
    const [source, setSource] = useState('Loading...');
    const { t } = useTranslation();
    const [status, setStatus] = useState('Connecting...');
    const [path, setPath] = useState([]);
    
    const [tripStatus, setTripStatus] = useState('Scheduled'); // Scheduled, Ongoing, Completed
    const [loading, setLoading] = useState(true);
    
    // Alarm States
    const [alarmTriggered, setAlarmTriggered] = useState(false);
    const [isSnoozed, setIsSnoozed] = useState(false);
    const [snoozeTime, setSnoozeTime] = useState(null);
    const [showAlarmModal, setShowAlarmModal] = useState(false);
    
    const alarmAudio = useRef(null);

    const routePoints = [
        { lat: 12.9716, lng: 77.5946, name: 'Bangalore' },
        { lat: 12.9249, lng: 77.4991, name: 'Kengeri' },
        { lat: 12.7150, lng: 77.2813, name: 'Ramanagara' },
        { lat: 12.6560, lng: 77.2000, name: 'Channapatna' },
        { lat: 12.5222, lng: 77.0459, name: 'Mandya' },
        { lat: 12.3833, lng: 76.8667, name: 'Srirangapatna' },
        { lat: 12.2958, lng: 76.6394, name: 'Mysore' }
    ];

    useEffect(() => {
        // Fetch User Location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
                },
                (err) => console.log('Location access denied or failed.', err)
            );
        }

        const fetchBookingDetails = async () => {
            try {
                const { data } = await api.get('/bookings/mybookings');
                const booking = data.find(b => b._id === pnr);
                if (booking && booking.schedule && booking.schedule.route) {
                    setDestination(booking.schedule.route.destination);
                    setSource(booking.schedule.route.source);
                    setTripStatus(booking.schedule.status || 'Scheduled');
                }
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchBookingDetails();

        // Polling for status if not started
        const interval = setInterval(async () => {
            if (tripStatus === 'Scheduled') {
                const { data } = await api.get('/bookings/mybookings');
                const booking = data.find(b => b._id === pnr);
                if (booking?.schedule?.status === 'Ongoing') {
                    setTripStatus('Ongoing');
                }
            }
        }, 5000);

        const socket = socketRef.current;
        if (tripStatus === 'Ongoing' && socket) {
            socket.emit('join_bus', pnr);

            socket.on('bus_location', (data) => {
                setBusLocation(data);
                setPath(prev => {
                    const newPath = [...prev, [data.lat, data.lng]];
                    // Keep only last 100 points for performance
                    return newPath.slice(-100);
                });
                setStatus(`Near ${data.locationName}`);

                // Alarm Logic: Raise alarm if ETA <= 15 minutes
                if (data.eta <= 15 && !alarmTriggered && !isSnoozed) {
                    triggerAlarm();
                }

                // Check if snooze period is over
                if (isSnoozed && snoozeTime && Date.now() > snoozeTime) {
                    setIsSnoozed(false);
                    setSnoozeTime(null);
                    triggerAlarm();
                }
            });
        }

        return () => {
            if (socket) socket.off('bus_location');
            clearInterval(interval);
        };
    }, [pnr, alarmTriggered, isSnoozed, snoozeTime, tripStatus]);

    const triggerAlarm = () => {
        setAlarmTriggered(true);
        setShowAlarmModal(true);
        // Play sound (using a standard browser sound or just visual for demo)
        try {
            const context = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = context.createOscillator();
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(440, context.currentTime);
            oscillator.connect(context.destination);
            oscillator.start();
            setTimeout(() => oscillator.stop(), 1000);
        } catch (e) {
            console.log("Audio not supported or blocked");
        }
    };

    const handleSnooze = () => {
        setIsSnoozed(true);
        setSnoozeTime(Date.now() + 5 * 60 * 1000); // 5 minutes snooze
        setShowAlarmModal(false);
        setAlarmTriggered(false);
    };

    const handleDismiss = () => {
        setShowAlarmModal(false);
        setAlarmTriggered(true); // Mark as triggered so it doesn't pop up again immediately
    };

    const handleResetSimulation = () => {
        if (socketRef.current) socketRef.current.emit('reset_tracking', pnr);
        setAlarmTriggered(false);
        setIsSnoozed(false);
        setPath([]);
    };

    return (
        <div style={{ height: '100vh', width: '100vw', background: '#0f141c', position: 'relative', overflow: 'hidden' }}>
            {/* Control Panel Overlay */}
            <div style={{
                position: 'absolute',
                top: 20,
                left: 20,
                zIndex: 1000,
                background: 'rgba(15, 20, 28, 0.9)',
                padding: '24px',
                borderRadius: '20px',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(16px)',
                width: '360px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                maxHeight: 'calc(100vh - 40px)',
                overflowY: 'auto'
            }}>
                <div style={{ marginBottom: '20px' }}>
                    <PremiumBackButton to="/my-tickets" label={t('back_to_bookings') || 'Back'} />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h2 style={{ color: '#fff', margin: 0, fontSize: '1.4rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MapIcon size={20} color="#3b82f6" /> {t('live_bus_tracking') || 'Live Tracking'}
                    </h2>
                    <button 
                        onClick={handleResetSimulation}
                        style={{ 
                            background: 'rgba(59, 130, 246, 0.2)', 
                            border: '1px solid rgba(59, 130, 246, 0.3)', 
                            color: '#3b82f6', 
                            padding: '6px 12px', 
                            borderRadius: '8px', 
                            fontSize: '0.75rem', 
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}
                    >
                        <Play size={12} fill="#3b82f6" /> {t('real') || 'REAL'}
                    </button>
                </div>
                
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '700' }}>{t('pnr') || 'PNR'}</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: '800', background: 'rgba(59, 130, 246, 0.2)', padding: '4px 10px', borderRadius: '6px', color: '#3b82f6' }}>{pnr.slice(-6).toUpperCase()}</div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#94a3b8' }}></div>
                            <div style={{ width: '2px', height: '24px', background: 'rgba(255,255,255,0.1)' }}></div>
                            <MapPin size={14} color="#10b981" />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
                            <div>
                                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700' }}>FROM</div>
                                <div style={{ color: '#fff', fontWeight: '700', fontSize: '0.95rem' }}>{source}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700' }}>GOING TO</div>
                                <div style={{ color: '#10b981', fontWeight: '800', fontSize: '1.05rem' }}>{destination}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(16, 185, 129, 0.1)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                        <div style={{ width: '12px', height: '12px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981', animation: 'pulse 2s infinite' }}></div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '800', textTransform: 'uppercase' }}>Status</div>
                            <div style={{ color: '#fff', fontWeight: '700', fontSize: '0.95rem' }}>{status}</div>
                        </div>
                        {busLocation && busLocation.eta && (
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '800' }}>ETA</div>
                                <div style={{ color: '#fff', fontWeight: '800', fontSize: '1.1rem' }}>{busLocation.eta} min</div>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        {busLocation && (
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6', marginBottom: '4px' }}>
                                    <Navigation size={14} />
                                    <span style={{ fontSize: '0.7rem', fontWeight: '700' }}>SPEED</span>
                                </div>
                                <div style={{ color: '#fff', fontWeight: '700', fontSize: '0.95rem' }}>{busLocation.speed}</div>
                            </div>
                        )}
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', marginBottom: '4px' }}>
                                <Bell size={14} />
                                <span style={{ fontSize: '0.7rem', fontWeight: '700' }}>ALARM</span>
                            </div>
                            <div style={{ color: isSnoozed ? '#f59e0b' : (busLocation?.eta <= 15 ? '#ef4444' : '#10b981'), fontWeight: '700', fontSize: '0.85rem' }}>
                                {isSnoozed ? 'Snoozed' : (busLocation?.eta <= 15 ? 'Alert Active' : 'Set for 15m')}
                            </div>
                        </div>
                    </div>
                    
                    {userLocation ? (
                        <div style={{ fontSize: '0.75rem', color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }}></div>
                            Your location is visible on map
                        </div>
                    ) : (
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                            Enable location to see where you are.
                        </div>
                    )}
                </div>
            </div>

            {/* Alarm Modal Overlay */}
            {showAlarmModal && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(15, 20, 28, 0.8)',
                    backdropFilter: 'blur(8px)',
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        background: '#1e293b',
                        padding: '40px',
                        borderRadius: '32px',
                        width: '400px',
                        textAlign: 'center',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        boxShadow: '0 0 50px rgba(239, 68, 68, 0.2)'
                    }}>
                        <div style={{ 
                            width: '80px', 
                            height: '80px', 
                            background: 'rgba(239, 68, 68, 0.2)', 
                            borderRadius: '50%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            margin: '0 auto 24px',
                            animation: 'shake 0.5s infinite'
                        }}>
                            <Bell size={40} color="#ef4444" fill="#ef4444" />
                        </div>
                        <h2 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: '900', marginBottom: '10px' }}>Arriving Soon!</h2>
                        <p style={{ color: '#94a3b8', fontSize: '1rem', marginBottom: '30px' }}>
                            The bus is approximately <b>{busLocation?.eta} minutes</b> away from your drop point.
                        </p>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button 
                                onClick={handleSnooze}
                                style={{
                                    background: 'rgba(245, 158, 11, 0.2)',
                                    color: '#f59e0b',
                                    border: '1px solid rgba(245, 158, 11, 0.3)',
                                    padding: '16px',
                                    borderRadius: '16px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}
                            >
                                <Clock size={20} /> Snooze for 5 mins
                            </button>
                            <button 
                                onClick={handleDismiss}
                                style={{
                                    background: '#3b82f6',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '16px',
                                    borderRadius: '16px',
                                    fontWeight: '800',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}
                            >
                                <CheckCircle size={20} /> I am awake
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Map Area */}
            {tripStatus === 'Ongoing' && busLocation ? (
                <MapContainer center={[busLocation.lat, busLocation.lng]} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; CARTO'
                    />
                    
                    {/* Full Route Line */}
                    <Polyline 
                        positions={routePoints.map(p => [p.lat, p.lng])} 
                        color="rgba(255,255,255,0.1)" 
                        weight={8} 
                    />
                    
                    {/* Path Traveled */}
                    {path.length > 1 && (
                        <Polyline positions={path} color="#10b981" weight={4} opacity={0.6} dashArray="10, 10" />
                    )}

                    {/* Stops */}
                    {routePoints.map((stop, i) => (
                        <Marker key={i} position={[stop.lat, stop.lng]} icon={stopIcon}>
                            <Popup>
                                <div style={{ fontWeight: '700' }}>{stop.name}</div>
                            </Popup>
                        </Marker>
                    ))}

                    <Marker position={[busLocation.lat, busLocation.lng]} icon={busIcon}>
                        <Popup className="premium-popup">
                            <div style={{ textAlign: 'center', padding: '5px' }}>
                                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '700', marginBottom: '4px' }}>LIVE BUS</div>
                                <b style={{ fontSize: '1.1rem', color: '#0f141c' }}>{busLocation.speed}</b><br />
                                <span style={{ fontSize: '0.85rem' }}>{busLocation.locationName}</span>
                            </div>
                        </Popup>
                    </Marker>

                    {userLocation && (
                        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                            <Popup>
                                <div style={{ textAlign: 'center', padding: '4px' }}>
                                    <b style={{ color: '#3b82f6' }}>You are here</b>
                                </div>
                            </Popup>
                        </Marker>
                    )}
                </MapContainer>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#fff', gap: '24px', background: 'radial-gradient(circle at center, #1e293b 0%, #0f141c 100%)' }}>
                    <div style={{ position: 'relative' }}>
                        <div style={{ width: '80px', height: '80px', border: '2px solid rgba(59, 130, 246, 0.2)', borderRadius: '50%', animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' }}></div>
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#3b82f6', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px #3b82f6' }}>
                            <Clock color="white" size={20} />
                        </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '8px' }}>
                            {tripStatus === 'Scheduled' ? 'Trip Not Started' : 'Locating Bus...'}
                        </h3>
                        <p style={{ color: '#94a3b8', maxWidth: '300px', lineHeight: '1.6' }}>
                            {tripStatus === 'Scheduled' 
                                ? 'The admin is currently verifying the driver OTP. Tracking will begin automatically once the ride starts.' 
                                : 'Establishing secure connection to the bus GPS satellite...'}
                        </p>
                    </div>
                    {tripStatus === 'Scheduled' && (
                        <div style={{ padding: '12px 24px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '30px', border: '1px solid rgba(59, 130, 246, 0.2)', color: '#3b82f6', fontSize: '0.85rem', fontWeight: '700' }}>
                            🔄 Polling for live updates...
                        </div>
                    )}
                </div>
            )}
            <style>{`
                @keyframes pulse {
                    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
                    70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
                    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
                }
                @keyframes ping {
                    75%, 100% { transform: scale(2); opacity: 0; }
                }
                @keyframes spin { 100% { transform: rotate(360deg); } }
                @keyframes shake {
                    0% { transform: rotate(0); }
                    25% { transform: rotate(10deg); }
                    50% { transform: rotate(0); }
                    75% { transform: rotate(-10deg); }
                    100% { transform: rotate(0); }
                }
                .premium-popup .leaflet-popup-content-wrapper { border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); }
                .premium-popup .leaflet-popup-tip { background: white; }
            `}</style>
        </div>
    );
};

export default TrackBus;
