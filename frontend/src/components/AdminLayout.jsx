import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    LayoutDashboard, 
    Bus, 
    Map, 
    Calendar, 
    LogOut, 
    Settings,
    ChevronRight,
    Users,
    Ticket,
    HelpCircle,
    Bell,
    User,
    Menu,
    Search
} from 'lucide-react';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    const sidebarLinks = [
        { path: '/admin', label: 'Overview', icon: LayoutDashboard },
        { path: '/admin/bookings', label: 'Bookings', icon: Ticket },
        { path: '/admin/buses', label: 'Fleet Management', icon: Bus },
        { path: '/admin/routes', label: 'Route Network', icon: Map },
        { path: '/admin/schedules', label: 'Trip Schedules', icon: Calendar },
        { path: '/admin/support', label: 'Help Desk', icon: HelpCircle },
    ];

    return (
        <div style={styles.layoutContainer}>
            {/* SIDEBAR */}
            <aside style={styles.sidebar}>
                <Link to="/" style={styles.brandLink}>
                    <div style={styles.brand}>
                        <div style={styles.brandIcon}>
                            <Bus color="white" size={24} />
                        </div>
                        <span style={styles.brandText}>JBS <span style={{color: '#3b82f6'}}>Executive</span></span>
                    </div>
                </Link>

                <div style={styles.navContainer}>
                    <p style={styles.sectionTitle}>Main Menu</p>
                    {sidebarLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = location.pathname === link.path || (link.path !== '/admin' && location.pathname.startsWith(link.path));
                        
                        return (
                            <Link 
                                key={link.path} 
                                to={link.path} 
                                style={{
                                    ...styles.navLink,
                                    background: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                                    borderRight: isActive ? '3px solid #3b82f6' : '3px solid transparent',
                                }}
                            >
                                <Icon size={20} color={isActive ? '#3b82f6' : '#94a3b8'} />
                                <span style={{ 
                                    color: isActive ? '#fff' : '#94a3b8', 
                                    fontWeight: isActive ? 700 : 500,
                                    fontSize: '0.95rem'
                                }}>
                                    {link.label}
                                </span>
                                {isActive && <ChevronRight size={14} color="#3b82f6" style={{marginLeft: 'auto'}} />}
                            </Link>
                        );
                    })}
                </div>

                <div style={styles.sidebarFooter}>
                    <button onClick={handleLogout} style={styles.logoutBtn}>
                        <LogOut size={18} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div style={styles.contentWrapper}>
                {/* TOP BAR */}
                <header style={styles.topBar}>
                    <div style={styles.topBarLeft}>
                        <Menu size={20} color="#94a3b8" style={{cursor: 'pointer'}} />
                        <div style={styles.searchBar}>
                            <Search size={16} color="#475569" />
                            <input type="text" placeholder="Search data..." style={styles.searchInput} />
                        </div>
                    </div>

                    <div style={styles.topBarRight}>
                        <div style={styles.iconBtn}>
                            <Bell size={20} color="#94a3b8" />
                            <span style={styles.notifDot}></span>
                        </div>
                        <div style={styles.divider}></div>
                        <div style={styles.userProfile}>
                            <div style={styles.userInfo}>
                                <span style={styles.userName}>{user?.name || 'Admin'}</span>
                                <span style={styles.userRole}>System Administrator</span>
                            </div>
                            <div style={styles.avatar}>
                                <User size={20} color="#fff" />
                            </div>
                        </div>
                    </div>
                </header>

                <main style={styles.mainContent}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

const styles = {
    layoutContainer: {
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#05070a',
        color: '#fff',
    },
    sidebar: {
        width: '280px',
        backgroundColor: '#0f141c',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        flexDirection: 'column',
        padding: '30px 20px',
        position: 'fixed',
        height: '100vh',
        zIndex: 50,
    },
    brandLink: {
        textDecoration: 'none',
        color: 'inherit',
    },
    brand: {
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        marginBottom: '40px',
        paddingLeft: '10px',
    },
    brandIcon: {
        background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
        padding: '10px',
        borderRadius: '12px',
        display: 'flex',
        boxShadow: '0 8px 16px rgba(59, 130, 246, 0.2)',
    },
    brandText: {
        fontSize: '1.4rem',
        fontWeight: '900',
        letterSpacing: '-1px',
    },
    navContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        flex: 1,
    },
    sectionTitle: {
        fontSize: '0.7rem',
        fontWeight: '800',
        color: '#475569',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        marginBottom: '15px',
        paddingLeft: '12px',
    },
    navLink: {
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        padding: '14px 16px',
        borderRadius: '12px',
        textDecoration: 'none',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
    },
    sidebarFooter: {
        marginTop: 'auto',
        paddingTop: '20px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
    },
    logoutBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: 'rgba(239, 68, 68, 0.08)',
        color: '#f87171',
        border: '1px solid rgba(239, 68, 68, 0.1)',
        padding: '12px',
        width: '100%',
        borderRadius: '12px',
        cursor: 'pointer',
        fontWeight: '700',
        transition: 'all 0.2s',
    },
    contentWrapper: {
        marginLeft: '280px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    topBar: {
        height: '80px',
        background: 'rgba(15, 20, 28, 0.5)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        padding: '0 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 40,
    },
    topBarLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
    },
    searchBar: {
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '12px',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        width: '300px',
    },
    searchInput: {
        background: 'transparent',
        border: 'none',
        color: '#fff',
        outline: 'none',
        fontSize: '0.9rem',
        width: '100%',
    },
    topBarRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
    },
    iconBtn: {
        position: 'relative',
        padding: '8px',
        borderRadius: '10px',
        cursor: 'pointer',
        transition: 'background 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    notifDot: {
        position: 'absolute',
        top: '8px',
        right: '8px',
        width: '6px',
        height: '6px',
        background: '#3b82f6',
        borderRadius: '50%',
        border: '2px solid #0f141c',
    },
    divider: {
        width: '1px',
        height: '24px',
        background: 'rgba(255,255,255,0.1)',
    },
    userProfile: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        cursor: 'pointer',
    },
    userInfo: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    userName: {
        fontSize: '0.9rem',
        fontWeight: '700',
    },
    userRole: {
        fontSize: '0.75rem',
        color: '#64748b',
        fontWeight: '500',
    },
    avatar: {
        width: '40px',
        height: '40px',
        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
    },
    mainContent: {
        padding: '40px',
        flex: 1,
    }
};

export default AdminLayout;

