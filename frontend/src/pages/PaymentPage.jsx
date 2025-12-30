import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    AlertCircle, CreditCard, Smartphone, Globe, ShieldCheck, 
    Lock, CheckCircle, ChevronRight, Info, Zap, User, Phone,
    CreditCard as CardIcon
} from 'lucide-react';
import api from '../utils/api';
import paymentQr from '../assets/payment-qr.jpg';
import PremiumBackButton from '../components/PremiumBackButton';

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { schedule, seats, totalAmount } = location.state || {};

    const [paymentMethod, setPaymentMethod] = useState('card');
    const [loading, setLoading] = useState(false);
    const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });
    const [upiId, setUpiId] = useState('');
    const [timeLeft, setTimeLeft] = useState(300);
    const [isExpired, setIsExpired] = useState(false);
    const [qrGenerated, setQrGenerated] = useState(false);
    const [passengerName, setPassengerName] = useState('');
    const [passengerPhone, setPassengerPhone] = useState('');
    const [deliveryMethod, setDeliveryMethod] = useState('sms');
    const [paymentError, setPaymentError] = useState(null);

    useEffect(() => {
        if (!schedule || !seats) {
            navigate('/');
        }
    }, [schedule, seats, navigate]);

    useEffect(() => {
        if (paymentMethod !== 'upi' || isExpired || !qrGenerated) return;
        
        if (timeLeft <= 0) {
            setIsExpired(true);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, paymentMethod, isExpired, qrGenerated]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleGenerateQR = () => {
        setQrGenerated(true);
        setTimeLeft(300);
        setIsExpired(false);
    };

    const handlePayment = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setPaymentError(null);

        if (!passengerName || !passengerPhone) {
            setPaymentError("Identity Verification Required: Please provide Passenger Name and Contact.");
            setLoading(false);
            return;
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 3000));

            const { data } = await api.post('/bookings', {
                scheduleId: schedule._id,
                seats,
                paymentMethod,
                transactionId: upiId || `EXECUTIVE_${Date.now()}`,
                passengerName,
                passengerPhone,
                deliveryMethod
            });
            
            navigate('/success', { state: { booking: data } });
        } catch (error) {
            setPaymentError(error.response?.data?.message || 'Gateway Timeout: Unable to authorize transaction.');
            setLoading(false);
        }
    };

    if (!schedule) return null;

    return (
        <div style={styles.pageWrapper}>
            <div className="container" style={{ paddingTop: '100px', paddingBottom: '60px' }}>
                <div style={{ marginBottom: '32px' }}>
                    <PremiumBackButton to="/buses" label="Modify Selection" />
                </div>

                <div style={styles.mainGrid}>
                    <div style={{ flex: 1.8 }}>
                        {/* PASSENGER SECTION */}
                        <section style={{ marginBottom: '40px' }}>
                            <div style={styles.sectionHeader}>
                                <User size={20} color="var(--primary)" />
                                <h2 style={styles.sectionTitle}>Identity Verification</h2>
                            </div>
                            
                            <div className="card-premium glass-effect" style={styles.passengerCard}>
                                <div style={styles.inputGrid}>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Passenger Legal Name</label>
                                        <div style={styles.inputWrapper}>
                                            <User size={18} color="#64748b" />
                                            <input 
                                                type="text" 
                                                placeholder="Executive Name"
                                                value={passengerName}
                                                onChange={(e) => setPassengerName(e.target.value)}
                                                style={styles.input}
                                            />
                                        </div>
                                    </div>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Direct Contact Number</label>
                                        <div style={styles.inputWrapper}>
                                            <Phone size={18} color="#64748b" />
                                            <input 
                                                type="text" 
                                                placeholder="Mobile / Phone"
                                                value={passengerPhone}
                                                onChange={(e) => setPassengerPhone(e.target.value)}
                                                style={styles.input}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div style={styles.deliveryNotice}>
                                    <Zap size={16} color="var(--secondary)" />
                                    <span>Tickets will be delivered via both **SMS** and **WhatsApp** instantly upon authorization.</span>
                                </div>
                            </div>
                        </section>

                        {/* PAYMENT SECTION */}
                        <section>
                            <div style={styles.sectionHeader}>
                                <Lock size={20} color="var(--primary)" />
                                <h2 style={styles.sectionTitle}>Secure Authorization</h2>
                            </div>

                            <div className="card-premium" style={{ padding: 0 }}>
                                <div style={styles.methodTabs}>
                                    <button 
                                        onClick={() => setPaymentMethod('card')}
                                        style={{...styles.tabBtn, borderBottom: paymentMethod === 'card' ? '2px solid var(--primary)' : 'none', color: paymentMethod === 'card' ? '#fff' : 'var(--text-muted)'}}
                                    >
                                        <CardIcon size={18} /> Credit / Debit
                                    </button>
                                    <button 
                                        onClick={() => setPaymentMethod('upi')}
                                        style={{...styles.tabBtn, borderBottom: paymentMethod === 'upi' ? '2px solid var(--primary)' : 'none', color: paymentMethod === 'upi' ? '#fff' : 'var(--text-muted)'}}
                                    >
                                        <Smartphone size={18} /> UPI / Wallets
                                    </button>
                                    <button 
                                        onClick={() => setPaymentMethod('netbanking')}
                                        style={{...styles.tabBtn, borderBottom: paymentMethod === 'netbanking' ? '2px solid var(--primary)' : 'none', color: paymentMethod === 'netbanking' ? '#fff' : 'var(--text-muted)'}}
                                    >
                                        <Globe size={18} /> Enterprise Banking
                                    </button>
                                </div>

                                <div style={{ padding: '40px' }}>
                                    {paymentError && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.errorBox}>
                                            <AlertCircle size={18} /> {paymentError}
                                        </motion.div>
                                    )}

                                    {paymentMethod === 'card' && (
                                        <div style={styles.cardForm}>
                                            <div style={styles.inputGroup}>
                                                <label style={styles.label}>Card Number</label>
                                                <div style={styles.inputWrapper}>
                                                    <CardIcon size={18} color="#64748b" />
                                                    <input 
                                                        type="text" 
                                                        placeholder="0000 0000 0000 0000"
                                                        style={styles.input}
                                                        value={cardDetails.number}
                                                        onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                                                    />
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '20px' }}>
                                                <div style={{ flex: 1, ...styles.inputGroup }}>
                                                    <label style={styles.label}>Valid Thru</label>
                                                    <input 
                                                        type="text" 
                                                        placeholder="MM/YY"
                                                        style={styles.inputWrapperSimple}
                                                        value={cardDetails.expiry}
                                                        onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                                                    />
                                                </div>
                                                <div style={{ flex: 1, ...styles.inputGroup }}>
                                                    <label style={styles.label}>CVV</label>
                                                    <input 
                                                        type="password" 
                                                        placeholder="•••"
                                                        style={styles.inputWrapperSimple}
                                                        value={cardDetails.cvv}
                                                        onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                                                    />
                                                </div>
                                            </div>
                                            <button 
                                                onClick={handlePayment}
                                                disabled={loading}
                                                className="btn btn-primary" 
                                                style={styles.authBtn}
                                            >
                                                {loading ? "Authorizing Gateway..." : `Authorize ₹${totalAmount}`}
                                            </button>
                                        </div>
                                    )}

                                    {paymentMethod === 'upi' && (
                                        <div style={styles.upiContainer}>
                                            <AnimatePresence mode="wait">
                                                {!qrGenerated ? (
                                                    <motion.div key="gen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={styles.upiInitial}>
                                                        <div style={styles.upiIcon}><Smartphone size={40} /></div>
                                                        <h3>Instant UPI Gateway</h3>
                                                        <p>Scan the dynamic QR code with any premium UPI application.</p>
                                                        <button onClick={handleGenerateQR} className="btn btn-primary" style={{ height: '60px', padding: '0 40px', borderRadius: '15px' }}>Generate Secure QR</button>
                                                    </motion.div>
                                                ) : (
                                                    <motion.div key="qr" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={styles.qrArea}>
                                                        {isExpired ? (
                                                            <div style={styles.expiredState}>
                                                                <Clock size={48} color="#ef4444" />
                                                                <p>Session Expired</p>
                                                                <button onClick={handleGenerateQR} style={styles.retryBtn}>Refresh Session</button>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <div style={styles.qrFrame}>
                                                                    <img src={paymentQr} alt="Payment" style={styles.qrImg} />
                                                                    <div style={styles.qrShimmer}></div>
                                                                </div>
                                                                <div style={styles.timerBadge}>
                                                                    <div style={styles.pulseDot}></div>
                                                                    Valid for: {formatTime(timeLeft)}
                                                                </div>
                                                                <div style={styles.upiIdRow}>Merchant ID: <span>9207038758@ybl</span></div>
                                                                <div style={{ width: '100%', maxWidth: '300px', marginTop: '30px' }}>
                                                                    <label style={styles.label}>Verify Transaction ID</label>
                                                                    <div style={{...styles.inputWrapper, marginTop: '8px', border: '2px solid var(--primary)'}}>
                                                                        <input 
                                                                            type="text" 
                                                                            placeholder="Ref No. / TXN ID" 
                                                                            style={{...styles.input, textAlign: 'center'}}
                                                                            value={upiId}
                                                                            onChange={(e) => setUpiId(e.target.value)}
                                                                        />
                                                                    </div>
                                                                    <button onClick={handlePayment} disabled={loading} className="btn btn-primary" style={{ width: '100%', height: '60px', borderRadius: '15px', marginTop: '15px' }}>
                                                                        {loading ? "Verifying..." : "Confirm Payment"}
                                                                    </button>
                                                                </div>
                                                            </>
                                                        )}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    )}

                                    {paymentMethod === 'netbanking' && (
                                        <div style={styles.upiInitial}>
                                            <Globe size={40} color="var(--primary)" />
                                            <h3 style={{ marginTop: '20px' }}>Enterprise Bank Connect</h3>
                                            <p>Select your tier-1 bank to complete authorization on their portal.</p>
                                            <select style={styles.bankSelect}>
                                                <option>HDFC Executive Banking</option>
                                                <option>ICICI Corporate Portal</option>
                                                <option>SBI Global Connect</option>
                                                <option>Axis Platinum Banking</option>
                                            </select>
                                            <button onClick={handlePayment} className="btn btn-primary" style={{ height: '60px', padding: '0 40px', borderRadius: '15px', marginTop: '20px' }}>
                                                {loading ? "Redirecting..." : "Open Bank Portal"}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>

                    <div style={{ flex: 1 }}>
                        <div style={styles.summarySticky}>
                            <div className="card-premium glass-effect" style={styles.summaryCard}>
                                <div style={styles.summaryHeader}>
                                    <h3 style={{ margin: 0 }}>Executive Summary</h3>
                                    <div style={styles.idBadge}>#{schedule._id.toString().slice(-6).toUpperCase()}</div>
                                </div>

                                <div style={styles.summaryList}>
                                    <div style={styles.summaryItem}>
                                        <span style={styles.summaryLabel}>Fleet Operator</span>
                                        <span style={styles.summaryValue}>{schedule.bus.operatorName}</span>
                                    </div>
                                    <div style={styles.summaryItem}>
                                        <span style={styles.summaryLabel}>Destination</span>
                                        <span style={styles.summaryValue}>{schedule.route.destination}</span>
                                    </div>
                                    <div style={styles.summaryItem}>
                                        <span style={styles.summaryLabel}>Confirmed Seats</span>
                                        <span style={{...styles.summaryValue, color: 'var(--primary)'}}>{seats.join(', ')}</span>
                                    </div>
                                    <div style={styles.summaryItem}>
                                        <span style={styles.summaryLabel}>Scheduled Arrival</span>
                                        <span style={styles.summaryValue}>{new Date(schedule.arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    </div>

                                    <div style={styles.divider} />

                                    <div style={styles.totalRow}>
                                        <span style={styles.totalLabel}>Grand Total</span>
                                        <span style={styles.totalAmount}>₹{totalAmount}</span>
                                    </div>
                                </div>

                                <div style={styles.trustRow}>
                                    <ShieldCheck size={14} color="var(--secondary)" />
                                    <span>PCI-DSS Level 1 Secure</span>
                                </div>
                            </div>

                            <div style={styles.supportBox}>
                                <Info size={16} color="var(--primary)" />
                                <p>Need assistance? Our 24/7 Priority Support is available for JBS Elite members.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    pageWrapper: { minHeight: '100vh', background: 'var(--bg-onyx)' },
    mainGrid: { display: 'flex', gap: '48px', alignItems: 'flex-start' },
    sectionHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' },
    sectionTitle: { fontSize: '1.25rem', fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 },
    
    passengerCard: { padding: '32px' },
    inputGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '10px' },
    label: { fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' },
    inputWrapper: { display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', padding: '14px 20px', borderRadius: '14px' },
    inputWrapperSimple: { background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', padding: '14px 20px', borderRadius: '14px', color: '#fff', outline: 'none' },
    input: { background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%', fontSize: '0.95rem', fontWeight: '600' },
    
    deliveryNotice: { marginTop: '24px', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '12px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', fontWeight: '500' },
    
    methodTabs: { display: 'flex', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-glass)' },
    tabBtn: { flex: 1, padding: '20px', background: 'transparent', border: 'none', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', transition: 'all 0.2s' },
    
    errorBox: { background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', padding: '14px', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: '700', border: '1px solid rgba(239, 68, 68, 0.2)' },
    
    cardForm: { display: 'flex', flexDirection: 'column', gap: '24px' },
    authBtn: { height: '70px', borderRadius: '20px', fontSize: '1.2rem', marginTop: '10px' },
    
    upiContainer: { padding: '20px 0' },
    upiInitial: { textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' },
    upiIcon: { width: '80px', height: '80px', background: 'var(--primary-glow)', color: 'var(--primary)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    
    qrArea: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
    qrFrame: { position: 'relative', width: '220px', height: '220px', background: '#fff', padding: '15px', borderRadius: '24px', marginBottom: '24px' },
    qrImg: { width: '100%', height: '100%', objectFit: 'contain' },
    qrShimmer: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(rgba(59,130,246,0) 40%, rgba(59,130,246,0.1), rgba(59,130,246,0) 60%)', borderRadius: '24px', animation: 'scan 2s infinite linear' },
    
    timerBadge: { display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', padding: '10px 20px', borderRadius: '100px', fontSize: '0.9rem', fontWeight: '800', color: 'var(--primary)' },
    pulseDot: { width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%', boxShadow: '0 0 10px var(--primary)' },
    upiIdRow: { marginTop: '15px', fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: '600' },
    
    expiredState: { textAlign: 'center', padding: '40px' },
    retryBtn: { marginTop: '20px', background: 'none', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '10px 30px', borderRadius: '10px', cursor: 'pointer', fontWeight: '800' },
    
    bankSelect: { width: '100%', maxWidth: '300px', padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', color: '#fff', fontSize: '1rem', fontWeight: '600' },
    
    summarySticky: { position: 'sticky', top: '120px' },
    summaryCard: { padding: '32px' },
    summaryHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
    idBadge: { background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary)', border: '1px solid var(--border-glass)' },
    summaryList: { display: 'flex', flexDirection: 'column', gap: '20px' },
    summaryItem: { display: 'flex', flexDirection: 'column', gap: '4px' },
    summaryLabel: { fontSize: '0.7rem', fontWeight: '900', color: 'var(--text-muted)', textTransform: 'uppercase' },
    summaryValue: { fontSize: '1.1rem', fontWeight: '700', color: '#fff' },
    divider: { height: '1px', background: 'var(--border-glass)' },
    totalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    totalLabel: { fontSize: '1rem', fontWeight: '800', color: '#fff' },
    totalAmount: { fontSize: '2.2rem', fontWeight: '900', color: 'var(--secondary)' },
    trustRow: { marginTop: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' },
    supportBox: { marginTop: '24px', background: 'rgba(99, 102, 241, 0.05)', padding: '20px', borderRadius: '16px', display: 'flex', gap: '15px', alignItems: 'center', fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.6' }
};

export default PaymentPage;
