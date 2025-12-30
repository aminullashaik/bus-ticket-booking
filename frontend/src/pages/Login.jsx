import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowLeft, ShieldCheck, Zap, Eye, EyeOff, Key } from "lucide-react";
import api from "../utils/api";
import PremiumBackButton from "../components/PremiumBackButton";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const loginData = {
      email: formData.email.trim(),
      password: formData.password.trim()
    };

    try {
      const { data } = await api.post("/auth/login", loginData);
      localStorage.setItem("user", JSON.stringify(data));
      if (data.role === 'admin') {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials for JBS Executive");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Cinematic Background Layer */}
      <div style={styles.bgOverlay}></div>
      
      <div style={styles.mainWrapper}>
        <div style={{ marginBottom: '40px' }}>
            <PremiumBackButton to="/" label="Back to Network" />
        </div>

        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-premium glass-effect"
            style={styles.authCard}
        >
            <div style={styles.headerArea}>
                <div style={styles.brandIcon}><Key size={28} color="var(--primary)" /></div>
                <h2 style={styles.title}>Member Authentication</h2>
                <p style={styles.subtitle}>Enter your JBS Executive credentials to continue</p>
            </div>

            {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={styles.errorBox}>
                    {error}
                </motion.div>
            )}

            <form onSubmit={handleSubmit} style={styles.formGrid}>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Electronic Mail</label>
                    <div style={{...styles.inputWrapper, borderColor: focusedField === 'email' ? 'var(--primary)' : 'var(--border-glass)'}}>
                        <Mail size={18} color={focusedField === 'email' ? 'var(--primary)' : '#64748b'} />
                        <input
                            type="email"
                            placeholder="executive@jbs.com"
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label style={styles.label}>Access Key</label>
                        <span style={styles.forgotLink}>Forgot Key?</span>
                    </div>
                    <div style={{...styles.inputWrapper, borderColor: focusedField === 'password' ? 'var(--primary)' : 'var(--border-glass)'}}>
                        <Lock size={18} color={focusedField === 'password' ? 'var(--primary)' : '#64748b'} />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••••••"
                            style={styles.input}
                            onFocus={() => setFocusedField('password')}
                            onBlur={() => setFocusedField(null)}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={loading} 
                    className="btn btn-primary"
                    style={styles.submitBtn}
                >
                    {loading ? "Authenticating..." : "Authorize Access"}
                </button>
            </form>

            <div style={styles.divider}>
                <div style={styles.line} />
                <span style={styles.dividerText}>or</span>
                <div style={styles.line} />
            </div>

            <div style={styles.footer}>
                New to the platform? <span style={styles.link} onClick={() => navigate("/register")}>Request Membership</span>
            </div>
        </motion.div>

        <div style={styles.safetyRow}>
            <ShieldCheck size={16} color="var(--secondary)" />
            <span>End-to-End Encrypted Session</span>
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
  title: { fontSize: "1.8rem", fontWeight: "900", color: "#fff", marginBottom: "8px" },
  subtitle: { color: "var(--text-muted)", fontSize: "0.95rem", fontWeight: "600" },
  errorBox: { background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#f87171", padding: "14px", borderRadius: "12px", marginBottom: "24px", textAlign: "center", fontSize: "0.85rem", fontWeight: "700" },
  formGrid: { display: "flex", flexDirection: "column", gap: "24px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "10px" },
  label: { fontSize: "0.75rem", fontWeight: "900", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1.5px" },
  inputWrapper: { display: "flex", alignItems: "center", gap: "14px", background: "rgba(255,255,255,0.02)", border: "1px solid", padding: "18px 24px", borderRadius: "18px", transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)" },
  input: { background: "transparent", border: "none", color: "#fff", outline: "none", width: "100%", fontSize: "1rem", fontWeight: "600" },
  eyeBtn: { background: "transparent", border: "none", color: "#64748b", cursor: "pointer", display: "flex" },
  forgotLink: { fontSize: "0.75rem", fontWeight: "700", color: "var(--primary)", cursor: "pointer" },
  submitBtn: { height: "64px", fontSize: "1.1rem", borderRadius: "18px", marginTop: "12px" },
  divider: { display: "flex", alignItems: "center", gap: "15px", margin: "32px 0" },
  line: { flex: 1, height: "1px", background: "var(--border-glass)" },
  dividerText: { fontSize: "0.8rem", color: "rgba(255,255,255,0.2)", fontWeight: "700", textTransform: "uppercase" },
  footer: { textAlign: "center", fontSize: "0.95rem", color: "var(--text-muted)", fontWeight: "600" },
  link: { color: "var(--primary)", fontWeight: "800", cursor: "pointer" },
  safetyRow: { marginTop: "32px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", color: "rgba(255,255,255,0.2)", fontSize: "0.85rem", fontWeight: "600" }
};

export default Login;