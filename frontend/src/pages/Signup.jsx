import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, UserPlus, Zap } from "lucide-react";
import api from "../utils/api";
import PremiumBackButton from "../components/PremiumBackButton";
import { useTranslation } from "../utils/LanguageContext";

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const registrationData = {
      ...formData,
      email: formData.email.trim()
    };

    try {
      const { data } = await api.post("/auth/register", registrationData);
      localStorage.setItem("user", JSON.stringify(data));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || t('registration_failed'));
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
            <div style={styles.headerArea}>
                <div style={styles.brandIcon}><UserPlus size={28} color="var(--secondary)" /></div>
                <h2 style={styles.title}>{t('create_account')}</h2>
                <p style={styles.subtitle}>{t('join_us_today')}</p>
            </div>

            {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={styles.errorBox}>
                    {error}
                </motion.div>
            )}

            <form onSubmit={handleSubmit} style={styles.formGrid}>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>{t('full_name')}</label>
                    <div style={{...styles.inputWrapper, borderColor: focusedField === 'name' ? 'var(--secondary)' : 'var(--border-glass)'}}>
                        <User size={18} color={focusedField === 'name' ? 'var(--secondary)' : '#64748b'} />
                        <input
                            type="text"
                            placeholder="John Doe"
                            style={styles.input}
                            onFocus={() => setFocusedField('name')}
                            onBlur={() => setFocusedField(null)}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>{t('email_or_username')}</label>
                    <div style={{...styles.inputWrapper, borderColor: focusedField === 'email' ? 'var(--secondary)' : 'var(--border-glass)'}}>
                        <Mail size={18} color={focusedField === 'email' ? 'var(--secondary)' : '#64748b'} />
                        <input
                            type="text"
                            placeholder="username or name@company.com"
                            style={styles.input}
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => setFocusedField(null)}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>{t('password')}</label>
                    <div style={{...styles.inputWrapper, borderColor: focusedField === 'password' ? 'var(--secondary)' : 'var(--border-glass)'}}>
                        <Lock size={18} color={focusedField === 'password' ? 'var(--secondary)' : '#64748b'} />
                        <input
                            type="password"
                            placeholder="••••••••"
                            style={styles.input}
                            onFocus={() => setFocusedField('password')}
                            onBlur={() => setFocusedField(null)}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <button type="submit" disabled={loading} className="btn btn-primary" style={{...styles.submitBtn, background: "linear-gradient(135deg, var(--secondary), #059669)"}}>
                    {loading ? t('creating_account') : t('sign_up_button')}
                </button>
            </form>

            <div style={styles.footer}>
                {t('already_have_account')} <span style={styles.link} onClick={() => navigate("/login")}>{t('sign_in_link')}</span>
            </div>
        </motion.div>

        <div style={styles.safetyRow}>
            <Zap size={16} color="var(--primary)" />
            <span>{t('secure_registration')}</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: "100vh", background: "var(--bg-onyx)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflowX: "hidden" },
  bgOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.05) 0%, transparent 60%)", pointerEvents: "none" },
  mainWrapper: { width: "100%", maxWidth: "480px", padding: "0 20px", display: "flex", flexDirection: "column", zIndex: 1 },
  authCard: { padding: "48px" },
  headerArea: { textAlign: "center", marginBottom: "32px" },
  brandIcon: { width: "64px", height: "64px", background: "rgba(16, 185, 129, 0.05)", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" },
  title: { fontSize: "1.8rem", fontWeight: "900", color: "#fff", marginBottom: "8px" },
  subtitle: { color: "var(--text-muted)", fontSize: "0.95rem", fontWeight: "600" },
  errorBox: { background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#f87171", padding: "14px", borderRadius: "12px", marginBottom: "24px", textAlign: "center", fontSize: "0.85rem", fontWeight: "700" },
  formGrid: { display: "flex", flexDirection: "column", gap: "24px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "10px" },
  label: { fontSize: "0.75rem", fontWeight: "900", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1.5px" },
  inputWrapper: { display: "flex", alignItems: "center", gap: "14px", background: "rgba(255,255,255,0.02)", border: "1px solid", padding: "18px 24px", borderRadius: "18px", transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)" },
  input: { background: "transparent", border: "none", color: "#fff", outline: "none", width: "100%", fontSize: "1rem", fontWeight: "600" },
  submitBtn: { height: "64px", fontSize: "1.1rem", borderRadius: "18px", marginTop: "12px" },
  footer: { textAlign: "center", marginTop: "32px", fontSize: "0.95rem", color: "var(--text-muted)", fontWeight: "600" },
  link: { color: "var(--secondary)", fontWeight: "800", cursor: "pointer" },
  safetyRow: { marginTop: "32px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", color: "rgba(255,255,255,0.2)", fontSize: "0.85rem", fontWeight: "600" }
};

export default Signup;