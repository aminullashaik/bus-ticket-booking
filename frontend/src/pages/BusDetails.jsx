import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ChevronRight, User, ShieldCheck, Zap, Info } from 'lucide-react';
import api from '../utils/api';
import PremiumBackButton from '../components/PremiumBackButton';

const BusDetails = () => {
  const { scheduleId } = useParams();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const { data } = await api.get(`/schedules/${scheduleId}`);
        setSchedule(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, [scheduleId]);

  const toggleSeat = (seatId) => {
    if (schedule.bookedSeats.includes(seatId)) return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleBooking = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert('Please login to book tickets');
        navigate('/login');
        return;
    }

    navigate('/payment', {
        state: {
            schedule,
            seats: selectedSeats,
            totalAmount: selectedSeats.length * schedule.price
        }
    });
  };

  if (loading || !schedule) return (
    <div style={styles.loadingWrapper}>
        <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            style={{ width: '40px', height: '40px', border: '3px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%' }}
        />
    </div>
  );

  const seats = schedule.bus.layout.length > 0 ? schedule.bus.layout : 
    Array.from({ length: 40 }, (_, i) => `${Math.floor(i/4) + 1}${['A','B','C','D'][i%4]}`);

  return (
    <div style={styles.pageWrapper}>
      <div className="container" style={{ paddingTop: '100px', paddingBottom: '60px' }}>
        <div style={{ marginBottom: '32px' }}>
            <PremiumBackButton to="/buses" label="Back to Fleet" />
        </div>

        <div style={styles.mainGrid}>
            {/* SEAT SELECTION AREA */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ flex: 1.5 }}
            >
                <div style={styles.sectionHeader}>
                    <div>
                        <h1 style={styles.pageTitle}>Select Journey Seats</h1>
                        <p style={styles.pageSub}>{schedule.bus.operatorName} • {schedule.bus.type}</p>
                    </div>
                    <div style={styles.legenda}>
                        <div style={styles.legendItem}><div style={{...styles.seatSample, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)'}} /> Available</div>
                        <div style={styles.legendItem}><div style={{...styles.seatSample, background: 'var(--primary)', border: 'none'}} /> Selected</div>
                        <div style={styles.legendItem}><div style={{...styles.seatSample, background: '#1e293b', border: 'none', opacity: 0.5}} /> Booked</div>
                    </div>
                </div>

                <div className="card-premium" style={styles.busLayoutCard}>
                    <div style={styles.steeringRow}>
                        <div style={styles.steeringWheel}>
                            <div style={styles.steeringIcon} />
                        </div>
                        <div style={styles.entrance}>Entry</div>
                    </div>

                    <div style={styles.seatGrid}>
                        {seats.map((seat, index) => {
                            const isBooked = schedule.bookedSeats.includes(seat);
                            const isSelected = selectedSeats.includes(seat);
                            const isAisle = index % 4 === 1;
                            
                            return (
                                <div key={index} style={{ display: 'contents' }}>
                                    <button
                                        onClick={() => toggleSeat(seat)}
                                        disabled={isBooked}
                                        style={{
                                            ...styles.seatBtn,
                                            background: isBooked ? '#1e293b' : isSelected ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                                            color: isSelected ? '#fff' : isBooked ? 'transparent' : 'var(--text-muted)',
                                            borderColor: isSelected ? 'var(--primary)' : 'var(--border-glass)',
                                            opacity: isBooked ? 0.35 : 1,
                                            transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                                            cursor: isBooked ? 'not-allowed' : 'pointer',
                                            boxShadow: isSelected ? '0 0 15px var(--primary-glow)' : 'none'
                                        }}
                                    >
                                        <User size={14} style={{ opacity: isSelected ? 1 : 0.3 }} />
                                        <span style={styles.seatLabel}>{seat}</span>
                                    </button>
                                    {isAisle && <div style={styles.aisle} />}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </motion.div>

            {/* BOOKING SUMMARY PANEL */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ flex: 1 }}
            >
                <div style={styles.summarySticky}>
                    <div className="card-premium glass-effect" style={styles.summaryCard}>
                        <div style={styles.summaryHeader}>
                            <ShoppingBag size={24} color="var(--primary)" />
                            <h3 style={{ margin: 0, fontSize: '1.4rem' }}>Booking Summary</h3>
                        </div>

                        <div style={styles.summaryBody}>
                            <div style={styles.summaryRow}>
                                <span style={styles.summaryLabel}>Journey</span>
                                <span style={styles.summaryValue}>{schedule.route.source} ➝ {schedule.route.destination}</span>
                            </div>
                            <div style={styles.summaryRow}>
                                <span style={styles.summaryLabel}>Arrival</span>
                                <span style={styles.summaryValue}>{new Date(schedule.arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • Next Day</span>
                            </div>
                            <div style={styles.summaryRow}>
                                <span style={styles.summaryLabel}>Selected Seats</span>
                                <span style={{...styles.summaryValue, color: 'var(--primary)'}}>
                                    {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'No seats selected'}
                                </span>
                            </div>
                            
                            <div style={styles.divider} />

                            <div style={styles.pricingArea}>
                                <div style={styles.priceRow}>
                                    <span style={styles.summaryLabel}>Seat Price (x{selectedSeats.length || 1})</span>
                                    <span style={styles.summaryValue}>₹{schedule.price}</span>
                                </div>
                                <div style={{...styles.priceRow, marginTop: '20px'}}>
                                    <span style={{...styles.summaryLabel, color: '#fff', fontSize: '1.1rem'}}>Total Payable</span>
                                    <span style={styles.totalAmount}>₹{selectedSeats.length * schedule.price}</span>
                                </div>
                            </div>

                            <div style={styles.trustBadge}>
                                <ShieldCheck size={14} color="var(--secondary)" />
                                <span>No hidden fees • Instant Confirmation</span>
                            </div>

                            <button 
                                className="btn btn-primary" 
                                style={styles.payBtn}
                                onClick={handleBooking}
                                disabled={selectedSeats.length === 0}
                            >
                                {selectedSeats.length > 0 ? `Pay ₹${selectedSeats.length * schedule.price}` : 'Select Seats to Proceed'}
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>

                    <div style={styles.infoBox}>
                        <Info size={16} />
                        <p>Arrival times are estimates based on live traffic data.</p>
                    </div>
                </div>
            </motion.div>
        </div>
      </div>
    </div>
  );
};

const ArrowRight = ({ size }) => <ChevronRight size={size} />;

const styles = {
  pageWrapper: { minHeight: '100vh', background: 'var(--bg-onyx)' },
  loadingWrapper: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-onyx)' },
  mainGrid: { display: 'flex', gap: '48px', alignItems: 'flex-start' },
  sectionHeader: { marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' },
  pageTitle: { fontSize: '2.4rem', fontWeight: '900', margin: '0 0 8px 0', letterSpacing: '-1px' },
  pageSub: { color: 'var(--text-muted)', fontWeight: '600', fontSize: '1.1rem' },
  
  legenda: { display: 'flex', gap: '20px', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' },
  legendItem: { display: 'flex', alignItems: 'center', gap: '8px' },
  seatSample: { width: '18px', height: '18px', borderRadius: '5px' },
  
  busLayoutCard: { 
    padding: '60px 40px', 
    maxWidth: '560px', 
    margin: '0 auto', 
    background: '#0a0d14',
    border: '2px solid rgba(255,255,255,0.03)'
  },
  steeringRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px', paddingBottom: '24px', borderBottom: '1px dashed rgba(255,255,255,0.1)' },
  steeringWheel: { width: '44px', height: '44px', borderRadius: '50%', border: '3px solid #334155', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  steeringIcon: { width: '15px', height: '3px', background: '#334155', borderRadius: '2px' },
  entrance: { color: 'var(--text-muted)', fontSize: '0.65rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px' },
  
  seatGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 60px) 40px repeat(2, 60px)', gap: '15px', justifyContent: 'center' },
  seatBtn: { 
    width: '60px', 
    height: '60px', 
    borderRadius: '15px', 
    border: '1px solid transparent', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: '4px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  seatLabel: { fontSize: '0.75rem', fontWeight: '800' },
  aisle: { width: '40px' },
  
  summarySticky: { position: 'sticky', top: '120px' },
  summaryCard: { padding: '32px' },
  summaryHeader: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '32px' },
  summaryBody: { display: 'flex', flexDirection: 'column', gap: '24px' },
  summaryRow: { display: 'flex', flexDirection: 'column', gap: '6px' },
  summaryLabel: { fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' },
  summaryValue: { fontSize: '1.1rem', fontWeight: '700', color: '#fff' },
  divider: { height: '1px', background: 'var(--border-glass)' },
  priceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  totalAmount: { fontSize: '2.4rem', fontWeight: '900', color: 'var(--secondary)' },
  payBtn: { width: '100%', height: '70px', marginTop: '10px', fontSize: '1.2rem', borderRadius: '20px' },
  trustBadge: { display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' },
  infoBox: { marginTop: '24px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '16px', padding: '16px 20px', display: 'flex', gap: '12px', alignItems: 'center', color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.5' }
};

export default BusDetails;
