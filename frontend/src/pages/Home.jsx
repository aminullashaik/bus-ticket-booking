import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Calendar, Search, ArrowRightLeft, ShieldCheck, Star, Clock, Navigation, TrendingUp, Users, Zap } from "lucide-react";

const Home = () => {
  const [search, setSearch] = useState({ from: "", to: "", date: "" });
  const [minDate, setMinDate] = useState("");
  const [isFocused, setIsFocused] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setMinDate(today);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams(search).toString();
    navigate(`/buses?${query}`);
  };

  const swapLocations = () => {
    setSearch((prev) => ({ ...prev, from: prev.to, to: prev.from }));
  };

  return (
    <div style={styles.container}>
      {/* ELITE HERO SECTION WITH GENERATED BACKGROUND */}
      <section style={styles.heroSection}>
        <div style={styles.heroBgOverlay}></div>
        <div style={styles.mainWrapper}>
          <header style={styles.header}>
            <motion.div 
              initial={{ opacity: 0, y: -20 }} 
              animate={{ opacity: 1, y: 0 }} 
              style={styles.liveBadge}
            >
              <div style={styles.pulseDot}></div>
              <span>GLOBAL FLEET: 452+ PREMIUM BUSES ACTIVE</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              style={styles.heroTitle}
            >
              Ultimate <span style={styles.glowText}>Luxury</span> <br/>
              Intercity Travel.
            </motion.h1>
            <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 0.2 }}
                style={styles.heroSubtitle}
            >
              Experience the future of road travel with JBS Executive. 
              Real-time tracking, executive lounges, and premium onboard service.
            </motion.p>
          </header>

          {/* GLASSMORPHISM SEARCH CONSOLE */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              ...styles.searchConsole,
              borderColor: isFocused ? "rgba(99, 102, 241, 0.4)" : "rgba(255, 255, 255, 0.08)",
              boxShadow: isFocused ? "0 0 50px rgba(99, 102, 241, 0.15)" : "0 40px 100px -20px rgba(0, 0, 0, 0.6)"
            }}
          >
            <form onSubmit={handleSearch} style={styles.engineGrid}>
              <div 
                style={styles.inputField} 
                onFocus={() => setIsFocused('from')} 
                onBlur={() => setIsFocused(null)}
              >
                <label style={styles.label}>Departure</label>
                <div style={styles.innerInput}>
                  <Navigation size={18} color="var(--primary)" />
                  <input type="text" placeholder="From City" style={styles.ghostInput} value={search.from} onChange={(e) => setSearch({ ...search, from: e.target.value })} required />
                </div>
              </div>

              <motion.button whileHover={{ rotate: 180, scale: 1.1 }} type="button" onClick={swapLocations} style={styles.swapBtn}>
                <ArrowRightLeft size={18} />
              </motion.button>

              <div 
                style={styles.inputField}
                onFocus={() => setIsFocused('to')} 
                onBlur={() => setIsFocused(null)}
              >
                <label style={styles.label}>Destination</label>
                <div style={styles.innerInput}>
                  <MapPin size={18} color="var(--secondary)" />
                  <input type="text" placeholder="To City" style={styles.ghostInput} value={search.to} onChange={(e) => setSearch({ ...search, to: e.target.value })} required />
                </div>
              </div>

              <div 
                style={styles.inputField}
                onFocus={() => setIsFocused('date')} 
                onBlur={() => setIsFocused(null)}
              >
                <label style={styles.label}>Travel Date</label>
                <div style={styles.innerInput}>
                  <Calendar size={18} color="var(--accent-purple)" />
                  <input type="date" min={minDate} style={styles.dateInput} value={search.date} onChange={(e) => setSearch({ ...search, date: e.target.value })} required />
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }} 
                type="submit" 
                className="btn btn-primary"
                style={styles.actionButton}
              >
                <Search size={22} strokeWidth={3} />
                <span>Search</span>
              </motion.button>
            </form>
          </motion.div>

          <div style={styles.trustRow}>
            <div style={styles.trustItem}><ShieldCheck size={18} /> 100% Secure Payments</div>
            <div style={styles.trustItem}><Clock size={18} /> Real-time GPS Tracking</div>
            <div style={styles.trustItem}><Star size={18} /> Choice of 5,000+ Journeys daily</div>
          </div>
        </div>
      </section>

      {/* VALUE PROPOSITION GRID */}
      <section style={styles.valueSection}>
        <div style={styles.gridContainer}>
            <div className="card-premium animate-fade-in" style={{ flex: 1 }}>
                <TrendingUp size={32} color="var(--primary)" style={{ marginBottom: '20px' }} />
                <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Smart Scheduling</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>Our proprietary travel engine optimizes schedules for maximum efficiency and on-time performance.</p>
            </div>
            <div className="card-premium animate-fade-in" style={{ flex: 1, animationDelay: '0.2s' }}>
                <Users size={32} color="var(--secondary)" style={{ marginBottom: '20px' }} />
                <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Loyalty Rewards</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>Earn JBS Miles on every booking. Redeem points for free travel or executive lounge access.</p>
            </div>
            <div className="card-premium animate-fade-in" style={{ flex: 1, animationDelay: '0.4s' }}>
                <Zap size={32} color="var(--accent-purple)" style={{ marginBottom: '20px' }} />
                <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Instant Digital Delivery</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>Receive your personalized tickets instantly via WhatsApp or SMS. Go paperless with JBS.</p>
            </div>
        </div>
      </section>
    </div>
  );
};

const styles = {
  container: { 
    minHeight: "100vh", 
    backgroundColor: "var(--bg-onyx)", 
    color: "#fff", 
    overflowX: "hidden" 
  },
  heroSection: {
    height: "100vh",
    minHeight: "800px",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundImage: "url('file:///C:/Users/SHAIK AMINULLA/.gemini/antigravity/brain/a44850d5-0609-4273-b7b5-45d5182af528/premium_hero_bg_1767077858875.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    padding: "0 40px"
  },
  heroBgOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(to bottom, rgba(5, 7, 10, 0.4) 0%, rgba(5, 7, 10, 0.9) 100%)",
    zIndex: 0
  },
  mainWrapper: { 
    width: "100%", 
    maxWidth: "1350px", 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    zIndex: 1,
    paddingTop: "40px"
  },
  header: { textAlign: "center", marginBottom: "60px" },
  liveBadge: { 
    background: "rgba(255,255,255,0.05)", 
    border: "1px solid rgba(255,255,255,0.1)", 
    padding: "10px 24px", 
    borderRadius: "100px", 
    fontSize: "0.85rem", 
    fontWeight: "800", 
    color: "#fff", 
    display: "inline-flex", 
    alignItems: "center", 
    gap: "12px", 
    marginBottom: "36px",
    letterSpacing: "0.5px"
  },
  pulseDot: { 
    width: "8px", 
    height: "8px", 
    background: "var(--secondary)", 
    borderRadius: "50%", 
    boxShadow: "0 0 15px var(--secondary)" 
  },
  heroTitle: { 
    fontSize: "clamp(3.5rem, 8vw, 6.5rem)", 
    fontWeight: "900", 
    letterSpacing: "-0.04em", 
    margin: 0, 
    lineHeight: 1,
    maxWidth: "1000px"
  },
  glowText: { 
    background: "linear-gradient(180deg, #fff 40%, var(--primary) 100%)", 
    WebkitBackgroundClip: "text", 
    WebkitTextFillColor: "transparent" 
  },
  heroSubtitle: { 
    color: "var(--text-muted)", 
    fontSize: "1.4rem", 
    marginTop: "24px", 
    maxWidth: "750px",
    margin: "24px auto 0",
    lineHeight: "1.6"
  },
  searchConsole: { 
    background: "rgba(10, 15, 25, 0.7)", 
    backdropFilter: "blur(30px)", 
    borderRadius: "32px", 
    padding: "12px", 
    border: "1px solid rgba(255, 255, 255, 0.08)", 
    width: "100%", 
    maxWidth: "1150px", 
    transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)" 
  },
  engineGrid: { display: "flex", alignItems: "center", gap: "8px" },
  inputField: { flex: 1, padding: "18px 24px", borderRadius: "20px", transition: "background 0.2s" },
  label: { 
    fontSize: "0.7rem", 
    fontWeight: "900", 
    color: "var(--text-muted)", 
    textTransform: "uppercase", 
    marginBottom: "8px", 
    display: "block", 
    letterSpacing: "1.5px" 
  },
  innerInput: { display: "flex", alignItems: "center", gap: "14px" },
  ghostInput: { background: "transparent", border: "none", color: "#fff", fontSize: "1.2rem", fontStretch: "tight", fontWeight: "700", outline: "none", width: "100%" },
  dateInput: { background: "transparent", border: "none", color: "#fff", fontSize: "1.2rem", fontWeight: "700", outline: "none", cursor: "pointer", width: "100%" },
  swapBtn: { 
    background: "rgba(255,255,255,0.05)", 
    border: "1px solid rgba(255,255,255,0.1)", 
    color: "var(--primary)", 
    width: "48px", 
    height: "48px", 
    borderRadius: "15px", 
    cursor: "pointer", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center" 
  },
  actionButton: { 
    borderRadius: "24px", 
    padding: "0 40px", 
    height: "88px", 
    fontSize: "1.1rem",
    gap: "12px"
  },
  trustRow: { 
    display: "flex", 
    gap: "48px", 
    marginTop: "48px", 
    color: "var(--text-muted)", 
    fontSize: "0.95rem", 
    fontWeight: "700" 
  },
  trustItem: { display: "flex", alignItems: "center", gap: "10px" },
  valueSection: {
    padding: "100px 40px",
    display: "flex",
    justifyContent: "center",
    background: "linear-gradient(to bottom, var(--bg-onyx), #0a0c10)"
  },
  gridContainer: {
    width: "100%",
    maxWidth: "1350px",
    display: "flex",
    gap: "32px"
  }
};

export default Home;