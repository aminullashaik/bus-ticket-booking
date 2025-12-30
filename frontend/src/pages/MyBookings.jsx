import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bus, Ticket, MapPin, Calendar, Clock, Download, ChevronRight, AlertCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import api from '../utils/api';
import PremiumBackButton from '../components/PremiumBackButton';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { data } = await api.get('/bookings/mybookings');
                setBookings(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    if (loading) return (
        <div style={styles.loadingWrapper}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={styles.loader}></motion.div>
        </div>
    );

    return (
        <div style={styles.pageWrapper}>
            <div className="container" style={{ paddingTop: '100px', paddingBottom: '80px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
                    <div>
                        <h1 style={styles.pageTitle}>Elite Journeys</h1>
                        <p style={styles.pageSub}>Manage and track your premium travel registrations</p>
                    </div>
                    <PremiumBackButton to="/" label="Dashboard" />
                </div>

                {bookings.length === 0 ? (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card-premium" style={styles.emptyCard}>
                        <div style={styles.emptyIcon}><Ticket size={48} /></div>
                        <h2>No Active Journeys</h2>
                        <p>You haven't registered any journeys yet. Start exploring our elite fleet.</p>
                        <Link to="/buses" className="btn btn-primary" style={{ height: '56px', padding: '0 40px', display: 'flex', alignItems: 'center' }}>Explore Global Fleet</Link>
                    </motion.div>
                ) : (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        style={styles.bookingGrid}
                    >
                        {bookings.map(booking => (
                            <motion.div key={booking._id} variants={itemVariants} className="card-premium" style={styles.bookingCard}>
                                <div style={styles.cardHeader}>
                                    <div style={styles.operatorGroup}>
                                        <div style={styles.busIcon}><Bus size={20} /></div>
                                        <div>
                                            <h3 style={styles.operatorName}>{booking.schedule.bus.operatorName}</h3>
                                            <span style={styles.pnrCode}>PNR: {booking._id.slice(-6).toUpperCase()}</span>
                                        </div>
                                    </div>
                                    <div style={{...styles.statusBadge, ...getStatusStyle(booking.status)}}>
                                        {booking.status.toUpperCase()}
                                    </div>
                                </div>

                                <div style={styles.journeyBody}>
                                    <div style={styles.routeBox}>
                                        <div style={styles.cityInfo}>
                                            <span style={styles.timeLabel}>{new Date(booking.schedule.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                            <span style={styles.cityName}>{booking.schedule.route.source}</span>
                                        </div>
                                        <div style={styles.visualFlow}>
                                            <div style={styles.dot}></div>
                                            <div style={styles.line}></div>
                                            <div style={{...styles.dot, background: 'var(--secondary)'}}></div>
                                        </div>
                                        <div style={{...styles.cityInfo, textAlign: 'right'}}>
                                            <span style={styles.timeLabel}>{new Date(booking.schedule.arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                            <span style={styles.cityName}>{booking.schedule.route.destination}</span>
                                        </div>
                                    </div>

                                    <div style={styles.metaRow}>
                                        <div style={styles.metaItem}><Calendar size={14} /> {new Date(booking.schedule.departureTime).toLocaleDateString('en-IN', {day: 'numeric', month: 'short'})}</div>
                                        <div style={styles.metaItem}><Ticket size={14} /> Seats: {booking.seats.join(', ')}</div>
                                        <div style={styles.metaItem}><ShoppingBag size={14} /> ₹{booking.totalAmount}</div>
                                    </div>
                                </div>

                                <div style={styles.cardFooter}>
                                    <div style={styles.footerNote}>
                                        <Clock size={14} /> Registered on {new Date(booking.createdAt).toLocaleDateString()}
                                    </div>
                                    <div style={styles.actionGroup}>
                                        <button 
                                            onClick={() => navigate('/success', { state: { booking } })}
                                            style={styles.secondaryBtn}
                                        >
                                            <Download size={16} /> View Ticket
                                        </button>
                                        <button 
                                            onClick={() => navigate(`/book/${booking.schedule._id}`)}
                                            style={styles.primaryBtn}
                                        >
                                            Book Again <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

const getStatusStyle = (status) => {
    switch(status) {
        case 'booked': return { background: 'rgba(16, 185, 129, 0.1)', color: 'var(--secondary)', border: '1px solid rgba(16, 185, 129, 0.2)' };
        case 'cancelled': return { background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)' };
        default: return { background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.2)' };
    }
};

const styles = {
    pageWrapper: { minHeight: '100vh', background: 'var(--bg-onyx)' },
    loader: { width: '40px', height: '40px', border: '3px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%' },
    loadingWrapper: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-onyx)' },
    pageTitle: { fontSize: '2.5rem', fontWeight: '900', color: '#fff', marginBottom: '8px', letterSpacing: '-1.5px' },
    pageSub: { color: 'var(--text-muted)', fontWeight: '600', fontSize: '1.1rem' },
    
    emptyCard: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '80px', textAlign: 'center' },
    emptyIcon: { width: '80px', height: '80px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' },
    
    bookingGrid: { display: 'flex', flexDirection: 'column', gap: '24px' },
    bookingCard: { padding: '32px' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' },
    operatorGroup: { display: 'flex', gap: '16px', alignItems: 'center' },
    busIcon: { width: '44px', height: '44px', background: 'var(--primary-glow)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' },
    operatorName: { fontSize: '1.2rem', fontWeight: '800', color: '#fff', margin: 0 },
    pnrCode: { fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)', letterSpacing: '1px' },
    statusBadge: { padding: '6px 14px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '900', letterSpacing: '1px' },
    
    journeyBody: { marginBottom: '32px' },
    routeBox: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    cityInfo: { display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '120px' },
    timeLabel: { fontSize: '1.4rem', fontWeight: '900', color: '#fff' },
    cityName: { fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)' },
    visualFlow: { flex: 1, display: 'flex', alignItems: 'center', padding: '0 30px' },
    dot: { width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' },
    line: { flex: 1, height: '1px', background: 'var(--border-glass)', opacity: 0.5 },
    
    metaRow: { display: 'flex', gap: '32px', padding: '16px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' },
    metaItem: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' },
    
    cardFooter: { borderTop: '1px solid var(--border-glass)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    footerNote: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.2)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' },
    actionGroup: { display: 'flex', gap: '16px' },
    secondaryBtn: { background: 'transparent', border: '1px solid var(--border-glass)', color: '#fff', padding: '10px 20px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
    primaryBtn: { background: 'var(--primary)', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }
};

export default MyBookings;
