import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bus, Clock, ArrowRight, Star, ShieldCheck, MapPin, Navigation, Filter, ChevronRight, Calendar, Users, Zap } from 'lucide-react';
import api from '../utils/api';
import PremiumBackButton from '../components/PremiumBackButton';

const BusSearch = () => {
  const [searchParams] = useSearchParams();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const date = searchParams.get('date');

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        let query = '/schedules?';
        if (from) query += `from=${from}&`;
        if (to) query += `to=${to}&`;
        if (date) query += `date=${date}&`;

        const { data } = await api.get(query);
        setSchedules(data);
      } catch (error) {
        console.error('Error fetching buses', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, [from, to, date]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (loading) return (
    <div style={styles.loadingWrapper}>
        <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
            <Bus size={40} color="var(--primary)" />
        </motion.div>
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontWeight: '600' }}>Fetching premium fleet...</p>
    </div>
  );

  return (
    <div style={styles.pageWrapper}>
      <div className="container" style={{ paddingTop: '100px', paddingBottom: '60px' }}>
        <header style={styles.searchHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <PremiumBackButton to="/" label="Modify Search" />
                <div>
                    <h1 style={styles.routeHeadline}>
                        {from && to ? (
                            <><span style={{ color: 'var(--primary)' }}>{from}</span> <ArrowRight size={24} style={{ margin: '0 10px' }} /> <span style={{ color: 'var(--secondary)' }}>{to}</span></>
                        ) : 'Executive Fleet Selection'}
                    </h1>
                    <div style={styles.searchMeta}>
                        <Calendar size={14} /> {date || 'All Dates'} • <Users size={14} /> {schedules.length} Luxury Buses Available
                    </div>
                </div>
            </div>
            <button style={styles.filterBtn}><Filter size={18} /> Filters</button>
        </header>

        {schedules.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-premium" 
            style={styles.emptyCard}
          >
              <div style={styles.emptyIcon}><Bus size={48} /></div>
              <h2 style={{ marginBottom: '12px' }}>No Service Found</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '30px', maxWidth: '400px', margin: '0 auto 30px' }}>
                  We couldn't find any premium schedules for this route on the selected date. 
                  Try adjusting your search criteria.
              </p>
              <Link to="/" className="btn btn-primary">Try New Search</Link>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={styles.scheduleGrid}
          >
              {schedules.map(schedule => (
                  <motion.div 
                    key={schedule._id} 
                    variants={itemVariants}
                    className="card-premium" 
                    style={styles.busCard}
                  >
                        {/* CARD TOP: Operator & Rating */}
                        <div style={styles.cardTop}>
                            <div style={styles.busInfo}>
                                <div style={styles.busIcon}><Bus size={20} /></div>
                                <div>
                                    <h3 style={styles.operatorName}>{schedule.bus.operatorName}</h3>
                                    <div style={styles.busTypeBadge}>{schedule.bus.type}</div>
                                </div>
                            </div>
                            <div style={styles.ratingBox}>
                                <Star size={14} fill="currentColor" />
                                <span>4.8</span>
                            </div>
                        </div>

                        {/* CARD MIDDLE: Journey Visualization */}
                        <div style={styles.journeyWrapper}>
                            <div style={styles.timeCluster}>
                                <span style={styles.timeText}>{new Date(schedule.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                <span style={styles.cityText}>{schedule.route.source}</span>
                                <span style={styles.pointText}>{schedule.route.departurePoint}</span>
                            </div>

                            <div style={styles.journeyVisual}>
                                <div style={styles.dot} />
                                <div style={styles.line} />
                                <div style={{...styles.dot, background: 'var(--secondary)'}} />
                            </div>

                            <div style={{...styles.timeCluster, textAlign: 'right'}}>
                                <span style={styles.timeText}>{new Date(schedule.arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                <span style={styles.cityText}>{schedule.route.destination}</span>
                                <span style={styles.pointText}>{schedule.route.arrivalPoint}</span>
                            </div>
                        </div>

                        {/* CARD FOOTER: Service Icons & Action */}
                        <div style={styles.cardFooter}>
                            <div style={styles.amenities}>
                                <ShieldCheck size={16} title="Insured Journey" />
                                <Clock size={16} title="On-time Guarantee" />
                                <Zap size={16} title="Instant Booking" />
                            </div>
                            <div style={styles.actionGroup}>
                                <div style={styles.priceTag}>
                                    <span style={styles.currency}>₹</span>
                                    <span style={styles.amount}>{schedule.price}</span>
                                </div>
                                <button 
                                    onClick={() => navigate(`/book/${schedule._id}`)}
                                    className="btn btn-primary" 
                                    style={styles.bookBtn}
                                >
                                    Select Seats <ChevronRight size={18} />
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

const styles = {
  pageWrapper: { minHeight: '100vh', background: 'var(--bg-onyx)' },
  loadingWrapper: { height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-onyx)' },
  searchHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' },
  routeHeadline: { fontSize: '2.5rem', fontWeight: '900', margin: '8px 0', display: 'flex', alignItems: 'center' },
  searchMeta: { display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' },
  filterBtn: { background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', color: '#fff', padding: '12px 24px', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '700', cursor: 'pointer' },
  
  scheduleGrid: { display: 'flex', flexDirection: 'column', gap: '24px' },
  busCard: { padding: '28px', position: 'relative', overflow: 'hidden' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' },
  busInfo: { display: 'flex', gap: '18px', alignItems: 'center' },
  busIcon: { width: '48px', height: '48px', background: 'var(--primary-glow)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' },
  operatorName: { fontSize: '1.25rem', fontWeight: '800', margin: 0, color: '#fff' },
  busTypeBadge: { fontSize: '0.7rem', fontWeight: '900', textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '1px', marginTop: '4px' },
  ratingBox: { background: '#f59e0b15', color: '#f59e0b', padding: '6px 12px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '800' },
  
  journeyWrapper: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', padding: '0 10px' },
  timeCluster: { display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '120px' },
  timeText: { fontSize: '1.6rem', fontWeight: '900', color: '#fff' },
  cityText: { fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)' },
  pointText: { fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500' },
  
  journeyVisual: { flex: 1, display: 'flex', alignItems: 'center', padding: '0 30px', position: 'relative' },
  dot: { width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)', zIndex: 1 },
  line: { flex: 1, height: '2px', background: 'linear-gradient(to right, var(--primary), var(--secondary))', opacity: 0.3 },
  
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '24px', borderTop: '1px solid var(--border-glass)' },
  amenities: { display: 'flex', gap: '20px', color: 'var(--text-muted)' },
  actionGroup: { display: 'flex', alignItems: 'center', gap: '30px' },
  priceTag: { display: 'flex', alignItems: 'baseline', gap: '4px' },
  currency: { fontSize: '1rem', color: 'var(--secondary)', fontWeight: '800' },
  amount: { fontSize: '2rem', fontWeight: '900', color: 'var(--secondary)' },
  bookBtn: { height: '56px', borderRadius: '16px', padding: '0 30px' },
  
  emptyCard: { textAlign: 'center', padding: '80px 40px' },
  emptyIcon: { width: '80px', height: '80px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', margin: '0 auto 24px' }
};

export default BusSearch;
