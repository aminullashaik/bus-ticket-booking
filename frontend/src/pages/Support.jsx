import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, HelpCircle, MessageSquare, ShieldCheck, Mail, Zap, Phone, ChevronRight } from 'lucide-react';
import api from '../utils/api';
import PremiumBackButton from '../components/PremiumBackButton';

const Support = () => {
    const [formData, setFormData] = useState({ subject: '', message: '', priority: 'low' });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/support', formData);
            setSubmitted(true);
            setFormData({ subject: '', message: '', priority: 'low' });
        } catch (err) {
            alert('Failed to transmit request. Our secure channels are currently experiencing high volume.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.pageWrapper}>
            <div className="container" style={{ paddingTop: '100px', paddingBottom: '80px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
                    <div>
                        <h1 style={styles.title}>Elite Concierge</h1>
                        <p style={styles.subtitle}>Priority assistance for JBS Executive members</p>
                    </div>
                    <PremiumBackButton to="/" label="Dashboard" />
                </div>

                <AnimatePresence mode="wait">
                    {submitted ? (
                        <motion.div 
                            key="success"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="card-premium glass-effect"
                            style={styles.successCard}
                        >
                            <div style={styles.successIcon}>
                                <ShieldCheck size={48} color="var(--secondary)" />
                            </div>
                            <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#fff', marginBottom: '16px' }}>Request Transmitted</h2>
                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '32px', fontSize: '1.1rem' }}>
                                Your priority ticket has been routed to our executive support team. 
                                We aim to resolve all Elite inquiries within 120 minutes.
                            </p>
                            <button onClick={() => setSubmitted(false)} className="btn btn-primary" style={{ height: '56px', padding: '0 40px' }}>
                                Submit New Request
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="form"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            style={styles.contentGrid}
                        >
                            <div className="card-premium glass-effect" style={styles.formCard}>
                                <div style={styles.cardIndicator}>PRIORITY CHANNEL</div>
                                <form onSubmit={handleSubmit} style={styles.formGrid}>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Subject of Inquiry</label>
                                        <div style={styles.inputWrapper}>
                                            <input 
                                                style={styles.input} 
                                                placeholder="e.g., Payment Authorization Delay" 
                                                value={formData.subject}
                                                onChange={e => setFormData({...formData, subject: e.target.value})}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Priority Protocol</label>
                                        <div style={styles.inputWrapper}>
                                            <select 
                                                style={styles.select}
                                                value={formData.priority}
                                                onChange={e => setFormData({...formData, priority: e.target.value})}
                                            >
                                                <option value="low">Standard Inquiry</option>
                                                <option value="medium">Booking Adjustment</option>
                                                <option value="high">Payment Verification</option>
                                                <option value="urgent">Urgent Boarding Issue</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Electronic Description</label>
                                        <div style={styles.inputWrapper}>
                                            <textarea 
                                                style={styles.textarea} 
                                                placeholder="Please provide comprehensive details regarding your request..."
                                                value={formData.message}
                                                onChange={e => setFormData({...formData, message: e.target.value})}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        className="btn btn-primary"
                                        style={styles.submitBtn}
                                    >
                                        {loading ? 'Transmitting...' : <><Send size={18} /> <span>Transmit Priority Ticket</span></>}
                                    </button>
                                </form>
                            </div>

                            <div style={styles.sideColumn}>
                                <div className="card-premium" style={styles.contactCard}>
                                    <div style={styles.contactIcon}><Phone size={24} color="var(--primary)" /></div>
                                    <div>
                                        <h3 style={styles.contactTitle}>Elite Hotline</h3>
                                        <p style={styles.contactValue}>+91 1800-JBS-ELITE</p>
                                    </div>
                                </div>
                                <div className="card-premium" style={styles.contactCard}>
                                    <div style={styles.contactIcon}><Mail size={24} color="var(--secondary)" /></div>
                                    <div>
                                        <h3 style={styles.contactTitle}>Dedicated Email</h3>
                                        <p style={styles.contactValue}>concierge@jbs-executive.com</p>
                                    </div>
                                </div>
                                
                                <div style={styles.guaranteeBox}>
                                    <Zap size={16} color="var(--primary)" />
                                    <p>Members receive instant routing to human agents during business hours.</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const styles = {
    pageWrapper: { minHeight: '100vh', background: 'var(--bg-onyx)' },
    title: { fontSize: '3rem', fontWeight: '900', color: '#fff', letterSpacing: '-2px', marginBottom: '8px' },
    subtitle: { color: 'var(--text-muted)', fontSize: '1.2rem', fontWeight: '600' },
    
    contentGrid: { display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '48px', alignItems: 'flex-start' },
    formCard: { padding: '48px', position: 'relative' },
    cardIndicator: { position: 'absolute', top: '24px', right: '48px', fontSize: '0.65rem', fontWeight: '900', color: 'var(--primary)', letterSpacing: '2px', padding: '4px 12px', background: 'var(--primary-glow)', borderRadius: '100px' },
    formGrid: { display: 'flex', flexDirection: 'column', gap: '28px' },
    
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '10px' },
    label: { fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' },
    inputWrapper: { display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '16px', overflow: 'hidden' },
    input: { background: 'transparent', border: 'none', color: '#fff', padding: '18px 24px', width: '100%', outline: 'none', fontSize: '1rem', fontWeight: '600' },
    select: { background: 'transparent', border: 'none', color: '#fff', padding: '18px 24px', width: '100%', outline: 'none', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' },
    textarea: { background: 'transparent', border: 'none', color: '#fff', padding: '18px 24px', width: '100%', outline: 'none', fontSize: '1rem', fontWeight: '600', minHeight: '180px', resize: 'vertical' },
    submitBtn: { height: '70px', fontSize: '1.2rem', borderRadius: '18px' },
    
    sideColumn: { display: 'flex', flexDirection: 'column', gap: '24px' },
    contactCard: { padding: '28px', display: 'flex', alignItems: 'center', gap: '24px' },
    contactIcon: { width: '56px', height: '56px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    contactTitle: { fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', margin: 0 },
    contactValue: { fontSize: '1.1rem', fontWeight: '700', color: '#fff', marginTop: '4px' },
    
    guaranteeBox: { marginTop: '12px', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '16px', padding: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start', color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6' },
    
    successCard: { maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '80px 48px' },
    successIcon: { width: '80px', height: '80px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }
};

export default Support;
