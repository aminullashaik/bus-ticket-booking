import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Download, Calendar, MapPin, Share2, Ticket, ChevronRight, Bus, ShieldCheck } from 'lucide-react';
import PremiumBackButton from '../components/PremiumBackButton';

const BookingSuccess = () => {
    const location = useLocation();
    const { booking } = location.state || {};
    
    const operatorName = booking?.schedule?.bus?.operatorName || 'JBS Executive Fleet';
    const source = booking?.schedule?.route?.source || 'Origin';
    const destination = booking?.schedule?.route?.destination || 'Destination';
    const departureTime = booking?.schedule?.departureTime ? new Date(booking?.schedule?.departureTime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Upcoming';
    const seats = booking?.seats?.join(', ') || 'Confirmed';
    const pnr = booking?._id?.toString().slice(-6).toUpperCase() || 'JBS-XXX';

    const handlePrint = () => {
        window.print();
    };

  return (
    <div style={styles.pageWrapper}>
      <style>
          {`
            @media print {
                body { background: white !important; }
                .no-print { display: none !important; }
                .printable-ticket {
                    position: absolute;
                    top: 0; left: 0; width: 100%;
                    box-shadow: none !important;
                    border: 2px solid #eee !important;
                    color: #000 !important;
                }
                .printable-ticket * { color: #000 !important; }
                .glass-effect { backdrop-filter: none !important; background: white !important; }
            }
            @keyframes celebrate {
                0% { transform: scale(0); opacity: 0; }
                50% { transform: scale(1.2); opacity: 1; }
                100% { transform: scale(1); opacity: 1; }
            }
          `}
      </style>

      <div className="container" style={{ paddingTop: '100px', paddingBottom: '80px', maxWidth: '900px' }}>
        <div className="no-print" style={{ marginBottom: '32px' }}>
            <PremiumBackButton to="/" label="Back to Home" />
        </div>

        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={styles.successHeader}
            className="no-print"
        >
            <div style={styles.successIcon}>
                <CheckCircle size={48} color="var(--secondary)" />
            </div>
            <h1 style={styles.title}>Authorization Confirmed</h1>
            <p style={styles.subtitle}>Your JBS Elite journey has been successfully registered.</p>
            <div style={styles.pnrBadge}>PNR: {pnr}</div>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={styles.ticketSection}
        >
            <div className="card-premium glass-effect printable-ticket" style={styles.ticketCard}>
                <div style={styles.ticketHeader}>
                    <div style={styles.brandRow}>
                        <div style={styles.logoCircle}><Bus size={20} color="#fff" /></div>
                        <div>
                            <div style={styles.brandName}>JBS EXECUTIVE</div>
                            <div style={styles.boardingPass}>BOARDING PASS • ELITE CLASS</div>
                        </div>
                    </div>
                    <div style={styles.qrPlaceholder}>
                        <div style={styles.qrInner}>JBS</div>
                    </div>
                </div>

                <div style={styles.ticketBody}>
                    <div style={styles.routeRow}>
                        <div style={styles.cityBlock}>
                            <div style={styles.cityLabel}>DEPARTURE CITY</div>
                            <div style={styles.cityName}>{source}</div>
                            <div style={styles.stationName}>{booking?.schedule?.route?.departurePoint || 'MAIN TERMINAL'}</div>
                        </div>
                        <div style={styles.flightVisual}>
                            <div style={styles.visualLine}></div>
                            <Bus size={18} style={{ margin: '0 15px', color: 'var(--primary)' }} />
                            <div style={styles.visualLine}></div>
                        </div>
                        <div style={{...styles.cityBlock, textAlign: 'right'}}>
                            <div style={styles.cityLabel}>ARRIVAL CITY</div>
                            <div style={styles.cityName}>{destination}</div>
                            <div style={styles.stationName}>{booking?.schedule?.route?.arrivalPoint || 'DROP STATION'}</div>
                        </div>
                    </div>

                    <div style={styles.infoGrid}>
                        <div style={styles.infoBox}>
                            <div style={styles.boxLabel}>SCHEDULED DATE</div>
                            <div style={styles.boxValue}>{departureTime.split(',')[0]}</div>
                        </div>
                        <div style={styles.infoBox}>
                            <div style={styles.boxLabel}>DEPARTURE TIME</div>
                            <div style={styles.boxValue}>{departureTime.split(',')[1]}</div>
                        </div>
                        <div style={styles.infoBox}>
                            <div style={styles.boxLabel}>CONFIRMED SEATS</div>
                            <div style={{...styles.boxValue, color: 'var(--primary)'}}>{seats}</div>
                        </div>
                        <div style={styles.infoBox}>
                            <div style={styles.boxLabel}>FLEET OPERATOR</div>
                            <div style={styles.boxValue}>{operatorName}</div>
                        </div>
                    </div>

                    <div style={styles.passengerRow}>
                        <div style={styles.passInfo}>
                            <div style={styles.boxLabel}>PASSENGER NAME</div>
                            <div style={styles.passName}>{booking?.passengerName?.toUpperCase() || 'EXECUTIVE TRAVELER'}</div>
                        </div>
                        <div style={styles.barcodeArea}>
                             <div style={styles.barcodeStrip}></div>
                             <div style={styles.pnrText}>{pnr}</div>
                        </div>
                    </div>
                </div>

                <div style={styles.ticketFooter}>
                    <div style={styles.footerItem}><ShieldCheck size={14} /> Verified Trip</div>
                    <div style={styles.footerItem}><Calendar size={14} /> Arrive 15m Early</div>
                    <div style={styles.footerItem}>Digital Receipt: ₹{booking?.totalAmount}</div>
                </div>
            </div>
        </motion.div>

        <div className="no-print" style={styles.actionRow}>
            <button onClick={handlePrint} className="btn-secondary" style={styles.downloadBtn}>
                <Download size={20} /> Save Document
            </button>
            <Link to="/my-bookings" className="btn btn-primary" style={styles.viewTripsBtn}>
                Track My Trips <ChevronRight size={20} />
            </Link>
        </div>

        <div className="no-print" style={styles.notice}>
            Confirmation details sent to <strong>{booking?.passengerPhone}</strong> via Multi-Channel Gateway (SMS + WhatsApp).
        </div>
      </div>
    </div>
  );
};

const styles = {
    pageWrapper: { minHeight: '100vh', background: 'var(--bg-onyx)' },
    successHeader: { textAlign: 'center', marginBottom: '40px' },
    successIcon: { width: '80px', height: '80px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', animation: 'celebrate 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)' },
    title: { fontSize: '2.5rem', fontWeight: '900', color: '#fff', marginBottom: '8px', letterSpacing: '-1px' },
    subtitle: { color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: '600' },
    pnrBadge: { display: 'inline-block', marginTop: '16px', padding: '6px 16px', background: 'var(--primary-glow)', color: 'var(--primary)', borderRadius: '100px', fontSize: '0.9rem', fontWeight: '900', border: '1px solid rgba(99, 102, 241, 0.2)' },
    
    ticketSection: { display: 'flex', justifyContent: 'center' },
    ticketCard: { width: '100%', maxWidth: '760px', padding: 0, overflow: 'hidden', border: '1px solid var(--border-glass)', borderRadius: '32px' },
    ticketHeader: { padding: '40px', background: 'linear-gradient(135deg, #0f172a, #1e293b)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed var(--border-glass)' },
    brandRow: { display: 'flex', alignItems: 'center', gap: '15px' },
    logoCircle: { width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    brandName: { color: '#fff', fontWeight: '900', fontSize: '1.2rem', letterSpacing: '1px' },
    boardingPass: { color: 'var(--primary)', fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '4px' },
    qrPlaceholder: { width: '50px', height: '50px', border: '2px solid rgba(255,255,255,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    qrInner: { fontSize: '0.7rem', fontWeight: '900', color: 'rgba(255,255,255,0.2)' },
    
    ticketBody: { padding: '40px' },
    routeRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
    cityBlock: { display: 'flex', flexDirection: 'column', gap: '4px' },
    cityLabel: { fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '900', letterSpacing: '1px' },
    cityName: { fontSize: '1.8rem', color: '#fff', fontWeight: '900' },
    stationName: { fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' },
    flightVisual: { flex: 1, display: 'flex', alignItems: 'center', padding: '0 40px' },
    visualLine: { flex: 1, height: '1px', background: 'var(--border-glass)', opacity: 0.5 },
    
    infoGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px', padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '20px' },
    infoBox: { display: 'flex', flexDirection: 'column', gap: '4px' },
    boxLabel: { fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: '900', letterSpacing: '1px' },
    boxValue: { fontSize: '0.95rem', color: '#fff', fontWeight: '700' },
    
    passengerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' },
    passInfo: { display: 'flex', flexDirection: 'column', gap: '6px' },
    passName: { fontSize: '1.2rem', color: '#fff', fontWeight: '900' },
    barcodeArea: { textAlign: 'right' },
    barcodeStrip: { width: '180px', height: '40px', background: 'repeating-linear-gradient(90deg, #fff 0px, #fff 2px, transparent 2px, transparent 6px)', opacity: 0.1 },
    pnrText: { fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '4px', marginTop: '8px' },
    
    ticketFooter: { padding: '20px 40px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' },
    footerItem: { display: 'flex', alignItems: 'center', gap: '8px' },
    
    actionRow: { display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '48px' },
    downloadBtn: { height: '60px', padding: '0 30px', borderRadius: '15px', color: '#fff', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)' },
    viewTripsBtn: { height: '60px', padding: '0 40px', borderRadius: '15px' },
    notice: { textAlign: 'center', marginTop: '32px', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }
};

export default BookingSuccess;
