import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bus, LogOut, User, LayoutDashboard, Ticket, Globe, HelpCircle, Bell } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.topBeam}></div>
      <div style={styles.container}>
        {/* JBS BRAND LOGO */}
        <Link to="/" style={styles.logoGroup}>
          <div style={styles.logoIcon}>
            <Bus size={22} color="#fff" strokeWidth={2.5} />
          </div>
          <motion.span 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            style={styles.logoText}
          >
            JBS <span>EXECUTIVE</span>
          </motion.span>
        </Link>

        {/* Navigation Links */}
        <div style={styles.linksGroup}>
          <Link to="/" style={styles.navLink}>
            <span style={styles.linkText}>Experience</span>
          </Link>
          <Link to="/buses" style={styles.navLink}>
            <Globe size={16} />
            <span style={styles.linkText}>Global Fleet</span>
          </Link>
          <Link to="/support" style={styles.navLink}>
            <HelpCircle size={16} />
            <span style={styles.linkText}>Concierge</span>
          </Link>
          
          <div style={styles.divider}></div>

          {user ? (
            <div style={styles.authGroup}>
              <Link to="/my-bookings" style={styles.navLink}>
                <Ticket size={18} />
                <span style={styles.linkText}>My Trips</span>
              </Link>
              
              {user.role === 'admin' && (
                <Link to="/admin" style={styles.adminPulseLink}>
                  <LayoutDashboard size={18} />
                  <span>Command Center</span>
                </Link>
              )}

              <div style={styles.userSection}>
                  <div style={styles.userBadge}>
                    {user.name?.charAt(0).toUpperCase() || <User size={16} />}
                  </div>
                  <motion.button 
                    whileHover={{ color: "#ef4444" }}
                    onClick={handleLogout} 
                    style={styles.logoutIconBtn}
                    title="Sign Out"
                  >
                    <LogOut size={18} />
                  </motion.button>
              </div>
            </div>
          ) : (
            <div style={styles.authGroup}>
              <Link to="/login" style={{...styles.navLink, color: "#fff"}}>Sign In</Link>
              <motion.button 
                whileHover={{ scale: 1.02, boxShadow: "0 0 25px var(--primary-glow)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/register')}
                className="btn btn-primary"
                style={styles.registerBtn}
              >
                Join JBS Elite
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    position: "fixed",
    top: 0,
    width: "100%",
    zIndex: 9999,
    background: "rgba(5, 7, 10, 0.8)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
  },
  topBeam: {
      position: "absolute",
      top: 0,
      left: 0,
      height: "2px",
      width: "100%",
      background: "linear-gradient(90deg, transparent, var(--primary), var(--accent-purple), transparent)",
      opacity: 0.6
  },
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0.8rem 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoGroup: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    textDecoration: "none",
  },
  logoIcon: {
    background: "linear-gradient(135deg, var(--primary), var(--accent-purple))",
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 20px -5px var(--primary-glow)",
  },
  logoText: {
    color: "#fff",
    fontSize: "1.4rem",
    fontWeight: "900",
    letterSpacing: "1px",
    display: "flex",
    gap: "6px"
  },
  linksGroup: {
    display: "flex",
    alignItems: "center",
    gap: "2.5rem",
  },
  navLink: {
    color: "#94a3b8",
    textDecoration: "none",
    fontSize: "0.85rem",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "color 0.3s ease",
  },
  linkText: {
      position: "relative",
  },
  adminPulseLink: {
    color: "var(--primary)",
    textDecoration: "none",
    fontSize: "0.85rem",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(99, 102, 241, 0.1)",
    padding: "8px 16px",
    borderRadius: "8px",
    border: "1px solid rgba(99, 102, 241, 0.2)"
  },
  authGroup: {
    display: "flex",
    alignItems: "center",
    gap: "2rem",
  },
  divider: {
    width: "1px",
    height: "20px",
    background: "rgba(255, 255, 255, 0.1)",
  },
  registerBtn: {
    padding: "10px 24px",
    fontSize: "0.85rem",
    borderRadius: "10px"
  },
  userSection: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "4px 4px 4px 12px",
      background: "rgba(255,255,255,0.03)",
      borderRadius: "100px",
      border: "1px solid var(--border-glass)"
  },
  logoutIconBtn: {
    background: "transparent",
    border: "none",
    color: "#64748b",
    padding: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    transition: "all 0.2s"
  },
  userBadge: {
    width: "30px",
    height: "30px",
    background: "var(--primary)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: "900",
    fontSize: "0.8rem",
    boxShadow: "0 0 15px var(--primary-glow)"
  }
};

export default Navbar;