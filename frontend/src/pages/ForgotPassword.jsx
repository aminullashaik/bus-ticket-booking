import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ShieldCheck, Key, CheckCircle, ArrowRight, UserCheck } from "lucide-react";
import api from "../utils/api";
import PremiumBackButton from "../components/PremiumBackButton";
import { useTranslation } from "../utils/LanguageContext";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1); // 1: Email, 2: PIN & New Password
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      let finalEmail = email.trim();
      if (!finalEmail.includes('@')) finalEmail += '@gmail.com';
      
      const { data } = await api.post("/auth/forgot-password", { email: finalEmail });
      setMessage(data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || t('user_not_found'));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      let finalEmail = email.trim();
      if (!finalEmail.includes('@')) finalEmail += '@gmail.com';

      await api.post("/auth/reset-password", { 
        email: finalEmail, 
        pin, 
        newPassword 
      });
      setMessage(t('password_updated_msg'));
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || t('invalid_pin_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.bgOverlay}></div>
      
      <div style={styles.mainWrapper}>
        <div style={{ marginBottom: '40px' }}>
            <PremiumBackButton to="/login" label={t('back_to_login')} />
        </div>

        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-premium glass-effect"
            style={styles.authCard}
        >
            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div 
                        key="step1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                    >
                        <div style={styles.headerArea}>
                            <div style={styles.brandIcon}><Mail size={28} color="var(--primary)" /></div>
                            <h2 style={styles.title}>{t('forgot_password_title')}</h2>
                            <p style={styles.subtitle}>{t('email_lookup_subtitle')}</p>
                        </div>

                        {error && <div style={styles.errorBox}>{error}</div>}

                        <form onSubmit={handleVerifyEmail} style={styles.formGrid}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>{t('email_input_label')}</label>
                                <div style={styles.inputWrapper}>
                                    <Mail size={18} color="var(--primary)" />
                                    <input
                                        type="text"
                                        placeholder={t('email_input_placeholder')}
                                        style={styles.input}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className="btn btn-primary" style={styles.submitBtn}>
                                {loading ? t('verifying_text') : t('check_account_button')}
                            </button>
                        </form>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div 
                        key="step2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                    >
                        <div style={styles.headerArea}>
                            <div style={styles.brandIcon}><Key size={28} color="var(--secondary)" /></div>
                            <h2 style={styles.title}>{t('reset_password_title')}</h2>
                            <p style={styles.subtitle}>{message}</p>
                        </div>

                        {error && <div style={styles.errorBox}>{error}</div>}

                        <form onSubmit={handleResetPassword} style={styles.formGrid}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>{t('pin_input_label')}</label>
                                <div style={styles.inputWrapper}>
                                    <ShieldCheck size={18} color="var(--secondary)" />
                                    <input
                                        type="password"
                                        placeholder={t('pin_input_placeholder')}
                                        style={styles.input}
                                        value={pin}
                                        onChange={(e) => setPin(e.target.value)}
                                        maxLength={4}
                                        required
                                    />
                                </div>
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>{t('new_password_label')}</label>
                                <div style={styles.inputWrapper}>
                                    <Lock size={18} color="var(--primary)" />
                                    <input
                                        type="password"
                                        placeholder={t('new_password_placeholder')}
                                        style={styles.input}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className="btn btn-primary" style={styles.submitBtn}>
                                {loading ? t('updating_text') : t('update_password_button')}
                            </button>
                        </form>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div 
                        key="step3"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ textAlign: 'center' }}
                    >
                        <div style={{ ...styles.brandIcon, background: 'rgba(16, 185, 129, 0.1)' }}>
                            <CheckCircle size={40} color="var(--secondary)" />
                        </div>
                        <h2 style={styles.title}>{t('password_reset_success_title')}</h2>
                        <p style={{ ...styles.subtitle, marginBottom: '32px' }}>
                            {t('password_reset_success_msg')}
                        </p>
                        <button onClick={() => navigate("/login")} className="btn btn-primary" style={styles.submitBtn}>
                            {t('go_to_login_button')} <ArrowRight size={20} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>

        <div style={styles.safetyRow}>
            <UserCheck size={16} color="var(--primary)" />
            <span>{t('secure_recovery_active')}</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: "100vh", background: "var(--bg-onyx)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflowX: "hidden" },
  bgOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.08) 0%, transparent 60%)", pointerEvents: "none" },
  mainWrapper: { width: "100%", maxWidth: "480px", padding: "0 20px", display: "flex", flexDirection: "column", zIndex: 1 },
  authCard: { padding: "48px" },
  headerArea: { textAlign: "center", marginBottom: "32px" },
  brandIcon: { width: "64px", height: "64px", background: "rgba(99, 102, 241, 0.05)", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" },
  title: { fontSize: "1.8rem", fontWeight: "900", color: "#fff", marginBottom: "8px", letterSpacing: "-1px" },
  subtitle: { color: "var(--text-muted)", fontSize: "0.95rem", fontWeight: "600", lineHeight: "1.5" },
  errorBox: { background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#f87171", padding: "14px", borderRadius: "12px", marginBottom: "24px", textAlign: "center", fontSize: "0.85rem", fontWeight: "700" },
  formGrid: { display: "flex", flexDirection: "column", gap: "24px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "10px" },
  label: { fontSize: "0.75rem", fontWeight: "900", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1.5px" },
  inputWrapper: { display: "flex", alignItems: "center", gap: "14px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-glass)", padding: "18px 24px", borderRadius: "18px" },
  input: { background: "transparent", border: "none", color: "#fff", outline: "none", width: "100%", fontSize: "1rem", fontWeight: "600" },
  submitBtn: { height: "64px", fontSize: "1.1rem", borderRadius: "18px", width: "100%" },
  safetyRow: { marginTop: "32px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", color: "rgba(255,255,255,0.2)", fontSize: "0.85rem", fontWeight: "600" }
};

export default ForgotPassword;
