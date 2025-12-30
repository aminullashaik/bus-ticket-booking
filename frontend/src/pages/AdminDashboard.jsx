import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    TrendingUp, 
    Users, 
    Bus, 
    Ticket, 
    IndianRupee, 
    Clock, 
    CheckCircle, 
    AlertCircle,
    User,
    Mail,
    Calendar,
    ChevronRight,
    Search,
    Filter,
    Trash2,
    Plus
} from 'lucide-react';
import api from '../utils/api';
import { motion } from 'framer-motion';
import PremiumBackButton from '../components/PremiumBackButton';

const AdminDashboard = ({ initialTab = 'overview' }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(initialTab);
    const [stats, setStats] = useState({ revenue: 0, totalBookings: 0, totalBuses: 0, totalRoutes: 0 });
    const [buses, setBuses] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Forms state
    const [busForm, setBusForm] = useState({ busNumber: '', operatorName: '', type: 'AC Seater', totalSeats: 40 });
    const [routeForm, setRouteForm] = useState({ source: '', destination: '', departurePoint: 'Main Stand', arrivalPoint: 'Drop Point', distance: 0 });
    const [scheduleForm, setScheduleForm] = useState({ busId: '', routeId: '', departureTime: '', arrivalTime: '', price: 0 });

    useEffect(() => {
       setActiveTab(initialTab === 'overview' ? 'overview' : initialTab);
    }, [initialTab]);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [busesRes, routesRes, bookingsRes, ticketsRes, schedulesRes] = await Promise.all([
                api.get('/buses'),
                api.get('/routes'),
                api.get('/bookings'),
                api.get('/support'),
                api.get('/schedules')
            ]);
            
            setBuses(busesRes.data);
            setRoutes(routesRes.data);
            setBookings(bookingsRes.data);
            setTickets(ticketsRes.data);
            setSchedules(schedulesRes.data);

            // Calculate Stats
            const revenue = bookingsRes.data.reduce((sum, b) => sum + b.totalAmount, 0);
            setStats({
                revenue,
                totalBookings: bookingsRes.data.length,
                totalBuses: busesRes.data.length,
                totalRoutes: routesRes.data.length
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateTicket = async (id, status) => {
        try {
            await api.put(`/support/${id}`, { status });
            fetchData();
        } catch (err) { alert('Failed to update ticket') }
    };

    const handleCreateBus = async (e) => {
        e.preventDefault();
        try {
            await api.post('/buses', busForm);
            setBusForm({ busNumber: '', operatorName: '', type: 'AC Seater', totalSeats: 40 });
            fetchData();
            alert('Bus added successfully');
        } catch (err) { alert(err.response?.data?.message || 'Failed to add bus') }
    };

    const handleCreateRoute = async (e) => {
        e.preventDefault();
        try {
            await api.post('/routes', routeForm);
            setRouteForm({ source: '', destination: '', departurePoint: 'Main Stand', arrivalPoint: 'Drop Point', distance: 0 });
            fetchData();
            alert('Route added successfully');
        } catch (err) { alert(err.response?.data?.message || 'Failed to add route') }
    };

    const handleCreateSchedule = async (e) => {
        e.preventDefault();
        try {
            await api.post('/schedules', scheduleForm);
            setScheduleForm({ busId: '', routeId: '', departureTime: '', arrivalTime: '', price: 0 });
            fetchData();
            alert('Schedule added successfully');
        } catch (err) { alert(err.response?.data?.message || 'Failed to add schedule') }
    };

    const handleDeleteBus = async (id) => {
        if(window.confirm('Delete this bus?')) {
            try { await api.delete(`/buses/${id}`); fetchData(); } 
            catch (err) { alert('Failed to delete bus') }
        }
    };

    const handleDeleteRoute = async (id) => {
        if(window.confirm('Delete this route?')) {
            try { await api.delete(`/routes/${id}`); fetchData(); } 
            catch (err) { alert('Failed to delete route') }
        }
    };

    const handleDeleteSchedule = async (id) => {
        if(window.confirm('Delete this schedule?')) {
            try { await api.delete(`/schedules/${id}`); fetchData(); } 
            catch (err) { alert('Failed to delete schedule') }
        }
    };

    const StatCard = ({ icon: Icon, label, value, color, trend }) => (
        <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: `${color}15`, color: color }}>
                <Icon size={24} />
            </div>
            <div style={styles.statInfo}>
                <span style={styles.statLabel}>{label}</span>
                <span style={styles.statValue}>{value}</span>
                {trend && <span style={styles.statTrend}><TrendingUp size={12} /> {trend}</span>}
            </div>
        </div>
    );

    return (
        <div style={styles.dashboardWrapper}>
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
                <div style={styles.tabContent}>
                    <div style={styles.header}>
                        <h2 style={styles.pageTitle}>Dashboard Overview</h2>
                        <p style={styles.subTitle}>Real-time performance metrics</p>
                    </div>

                    <div style={styles.statsGrid}>
                        <StatCard icon={IndianRupee} label="Total Revenue" value={`₹${stats.revenue}`} color="#3b82f6" trend="12% from last month" />
                        <StatCard icon={Ticket} label="Total Bookings" value={stats.totalBookings} color="#10b981" trend="8.4% growth" />
                        <StatCard icon={Bus} label="Active Fleet" value={stats.totalBuses} color="#f59e0b" />
                        <StatCard icon={TrendingUp} label="Total Routes" value={stats.totalRoutes} color="#8b5cf6" />
                    </div>

                    <div style={styles.contentGrid}>
                        {/* RECENT BOOKINGS PREVIEW */}
                        <div style={styles.card}>
                            <div style={styles.cardHeader}>
                                <h3 style={styles.cardTitle}>Recent Bookings</h3>
                                <button onClick={() => setActiveTab('bookings')} style={styles.textBtn}>View All</button>
                            </div>
                            <div style={styles.listContainer}>
                                {bookings.slice(0, 5).map(b => (
                                    <div key={b._id} style={styles.listItem}>
                                        <div style={styles.itemLead}>
                                            <div style={styles.circleAvatar}>{b.user?.name?.charAt(0)}</div>
                                            <div>
                                                <span style={styles.itemTitle}>{b.user?.name}</span>
                                                <span style={styles.itemSub}>{b.schedule?.bus?.operatorName}</span>
                                            </div>
                                        </div>
                                        <div style={styles.itemEnd}>
                                            <span style={styles.itemPrice}>₹{b.totalAmount}</span>
                                            <span style={styles.statusBadge}>Booked</span>
                                        </div>
                                    </div>
                                ))}
                                {bookings.length === 0 && <p style={styles.emptyState}>No bookings recorded.</p>}
                            </div>
                        </div>

                        {/* SUPPORT PREVIEW */}
                        <div style={styles.card}>
                            <div style={styles.cardHeader}>
                                <h3 style={styles.cardTitle}>Open Tickets</h3>
                                <button onClick={() => setActiveTab('support')} style={styles.textBtn}>Manage</button>
                            </div>
                            <div style={styles.listContainer}>
                                {tickets.filter(t => t.status === 'open').slice(0, 5).map(t => (
                                    <div key={t._id} style={styles.listItem}>
                                        <div style={styles.itemLead}>
                                            <div style={{...styles.circleAvatar, background: '#ef444415', color: '#ef4444'}}><AlertCircle size={16} /></div>
                                            <div>
                                                <span style={styles.itemTitle}>{t.subject}</span>
                                                <span style={styles.itemSub}>{t.user?.name} • {new Date(t.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <ChevronRight size={16} color="#475569" />
                                    </div>
                                ))}
                                {tickets.filter(t => t.status === 'open').length === 0 && <p style={styles.emptyState}>All caught up!</p>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* BOOKINGS TAB */}
            {activeTab === 'bookings' && (
                <div style={styles.tabContent}>
                    <div style={styles.header}>
                        <h2 style={styles.pageTitle}>Booking Management</h2>
                        <p style={styles.subTitle}>Monitor and manage all user reservations</p>
                    </div>

                    <div style={styles.card}>
                        <div style={styles.tableHeader}>
                            <div style={styles.tableFilters}>
                                <div style={styles.searchBox}>
                                    <Search size={16} color="#64748b" />
                                    <input type="text" placeholder="Search by ID or Name" style={styles.tableInput} />
                                </div>
                                <button style={styles.filterBtn}><Filter size={16} /> Filter</button>
                            </div>
                        </div>

                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.tableHeadRow}>
                                    <th>USER</th>
                                    <th>PASSENGER</th>
                                    <th>PHONE</th>
                                    <th>ROUTE</th>
                                    <th>JOURNEY DATE</th>
                                    <th>SEATS</th>
                                    <th>AMOUNT</th>
                                    <th>STATUS</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map(b => (
                                    <tr key={b._id} style={styles.tableRow}>
                                        <td>
                                            <div style={styles.userNameGroup}>
                                                <span style={styles.mainName}>{b.user?.name}</span>
                                                <span style={styles.subName}>{b.user?.email}</span>
                                            </div>
                                        </td>
                                        <td>{b.passengerName}</td>
                                        <td>{b.passengerPhone} ({b.deliveryMethod?.toUpperCase()})</td>
                                        <td>
                                            <div style={styles.routeGroup}>
                                                <span style={styles.routeName}>{b.schedule?.route?.source} ➝ {b.schedule?.route?.destination}</span>
                                                <span style={styles.routeSub}>{b.schedule?.bus?.operatorName}</span>
                                            </div>
                                        </td>
                                        <td>{new Date(b.schedule?.departureTime).toLocaleDateString()}</td>
                                        <td>{b.seats.join(', ')}</td>
                                        <td style={{fontWeight: '700', color: '#10b981'}}>₹{b.totalAmount}</td>
                                        <td><span style={{
                                            ...styles.statusBadge,
                                            background: b.status === 'cancelled' ? '#fee2e2' : '#10b98115',
                                            color: b.status === 'cancelled' ? '#ef4444' : '#10b981'
                                        }}>{b.status}</span></td>
                                        <td>
                                            {b.status !== 'cancelled' && (
                                                <button 
                                                    onClick={async () => {
                                                        if(window.confirm('Are you sure you want to cancel this booking?')) {
                                                            try {
                                                                await api.put(`/bookings/${b._id}/cancel`);
                                                                fetchData();
                                                            } catch (err) { alert('Failed to cancel booking') }
                                                        }
                                                    }}
                                                    style={{...styles.textBtn, color: '#ef4444'}}
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {bookings.length === 0 && <p style={styles.emptyState}>No bookings found.</p>}
                    </div>
                </div>
            )}

            {/* SUPPORT TAB */}
            {activeTab === 'support' && (
                <div style={styles.tabContent}>
                    <div style={styles.header}>
                        <h2 style={styles.pageTitle}>Support Help Desk</h2>
                        <p style={styles.subTitle}>Resolve user inquiries and issues</p>
                    </div>

                    <div style={styles.ticketsGrid}>
                        {tickets.map(t => (
                            <div key={t._id} style={styles.ticketCard}>
                                <div style={styles.ticketHeader}>
                                    <span style={{
                                        ...styles.priorityBadge,
                                        background: t.priority === 'urgent' ? '#ef444415' : '#3b82f615',
                                        color: t.priority === 'urgent' ? '#ef4444' : '#3b82f6'
                                    }}>
                                        {t.priority}
                                    </span>
                                    <span style={styles.ticketDate}>{new Date(t.createdAt).toLocaleString()}</span>
                                </div>
                                <h4 style={styles.ticketSubject}>{t.subject}</h4>
                                <p style={styles.ticketMessage}>{t.message}</p>
                                <div style={styles.ticketUser}>
                                    <div style={styles.avatarMini}>{t.user?.name?.charAt(0)}</div>
                                    <div style={styles.userInfoMini}>
                                        <span style={styles.userNameMini}>{t.user?.name}</span>
                                        <span style={styles.userEmailMini}>{t.user?.email}</span>
                                    </div>
                                </div>
                                <div style={styles.ticketActions}>
                                    <select 
                                        style={styles.ticketSelect} 
                                        value={t.status}
                                        onChange={(e) => handleUpdateTicket(t._id, e.target.value)}
                                    >
                                        <option value="open">Open</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="resolved">Resolved</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                    <button style={styles.actionBtn}>Reply</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {tickets.length === 0 && <p style={styles.emptyState}>No support tickets found.</p>}
                </div>
            )}

            {activeTab === 'buses' && (
                <div style={styles.tabContent}>
                    <PremiumBackButton to="/admin" label="Back to Dashboard" />
                    <div style={styles.header}>
                        <h2 style={styles.pageTitle}>Bus Fleet Management</h2>
                        <p style={styles.subTitle}>Register and manage your fleet</p>
                    </div>

                    <div style={{...styles.card, marginBottom: '20px'}}>
                        <h3 style={styles.cardTitle}>Add New Bus</h3>
                        <form onSubmit={handleCreateBus} style={styles.managementForm}>
                            <input placeholder="Bus Number" value={busForm.busNumber} onChange={e => setBusForm({...busForm, busNumber: e.target.value})} style={styles.formInput} required />
                            <input placeholder="Operator Name" value={busForm.operatorName} onChange={e => setBusForm({...busForm, operatorName: e.target.value})} style={styles.formInput} required />
                            <select value={busForm.type} onChange={e => setBusForm({...busForm, type: e.target.value})} style={styles.formInput}>
                                <option>AC Seater</option>
                                <option>Non-AC Seater</option>
                                <option>AC Sleeper</option>
                                <option>Non-AC Sleeper</option>
                            </select>
                            <input type="number" placeholder="Total Seats" value={busForm.totalSeats} onChange={e => setBusForm({...busForm, totalSeats: e.target.value})} style={styles.formInput} required />
                            <button className="btn btn-primary" style={{gridColumn: 'span 2'}}>Add Bus</button>
                        </form>
                    </div>

                    <div style={styles.card}>
                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.tableHeadRow}>
                                    <th>OPRATOR</th>
                                    <th>NUMBER</th>
                                    <th>TYPE</th>
                                    <th>SEATS</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {buses.map(bus => (
                                    <tr key={bus._id} style={styles.tableRow}>
                                        <td style={{fontWeight: '700', color: '#fff'}}>{bus.operatorName}</td>
                                        <td>{bus.busNumber}</td>
                                        <td>{bus.type}</td>
                                        <td>{bus.totalSeats}</td>
                                        <td>
                                            <button onClick={() => handleDeleteBus(bus._id)} style={{...styles.textBtn, color: '#ef4444'}}>
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'routes' && (
                <div style={styles.tabContent}>
                    <PremiumBackButton to="/admin" label="Back to Dashboard" />
                    <div style={styles.header}>
                        <h2 style={styles.pageTitle}>Route Management</h2>
                        <p style={styles.subTitle}>Define travel routes and reaching points</p>
                    </div>

                    <div style={{...styles.card, marginBottom: '20px'}}>
                        <h3 style={styles.cardTitle}>Create New Route</h3>
                        <form onSubmit={handleCreateRoute} style={styles.managementForm}>
                            <input placeholder="Source City" value={routeForm.source} onChange={e => setRouteForm({...routeForm, source: e.target.value})} style={styles.formInput} required />
                            <input placeholder="Departure Point (Local)" value={routeForm.departurePoint} onChange={e => setRouteForm({...routeForm, departurePoint: e.target.value})} style={styles.formInput} required />
                            <input placeholder="Destination City" value={routeForm.destination} onChange={e => setRouteForm({...routeForm, destination: e.target.value})} style={styles.formInput} required />
                            <input placeholder="Arrival Point (Local)" value={routeForm.arrivalPoint} onChange={e => setRouteForm({...routeForm, arrivalPoint: e.target.value})} style={styles.formInput} required />
                            <input type="number" placeholder="Distance (km)" value={routeForm.distance} onChange={e => setRouteForm({...routeForm, distance: e.target.value})} style={styles.formInput} required />
                            <button className="btn btn-primary" style={{gridColumn: 'span 2'}}>Create Route</button>
                        </form>
                    </div>

                    <div style={styles.card}>
                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.tableHeadRow}>
                                    <th>FROM (SOURCE)</th>
                                    <th>TO (DESTINATION)</th>
                                    <th>DISTANCE</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {routes.map(r => (
                                    <tr key={r._id} style={styles.tableRow}>
                                        <td>
                                            <div style={styles.routeGroup}>
                                                <span style={styles.routeName}>{r.source}</span>
                                                <span style={styles.routeSub}>{r.departurePoint}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={styles.routeGroup}>
                                                <span style={styles.routeName}>{r.destination}</span>
                                                <span style={styles.routeSub}>{r.arrivalPoint}</span>
                                            </div>
                                        </td>
                                        <td>{r.distance} km</td>
                                        <td>
                                            <button onClick={() => handleDeleteRoute(r._id)} style={{...styles.textBtn, color: '#ef4444'}}>
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'schedules' && (
                <div style={styles.tabContent}>
                    <PremiumBackButton to="/admin" label="Back to Dashboard" />
                    <div style={styles.header}>
                        <h2 style={styles.pageTitle}>Schedule Management</h2>
                        <p style={styles.subTitle}>Plan and publish bus schedules</p>
                    </div>

                    <div style={{...styles.card, marginBottom: '20px'}}>
                        <h3 style={styles.cardTitle}>Publish New Schedule</h3>
                        <form onSubmit={handleCreateSchedule} style={styles.managementForm}>
                            <select value={scheduleForm.busId} onChange={e => setScheduleForm({...scheduleForm, busId: e.target.value})} style={styles.formInput} required>
                                <option value="">Select Bus</option>
                                {buses.map(b => (
                                    <option key={b._id} value={b._id}>{b.operatorName} ({b.busNumber})</option>
                                ))}
                            </select>
                            <select value={scheduleForm.routeId} onChange={e => setScheduleForm({...scheduleForm, routeId: e.target.value})} style={styles.formInput} required>
                                <option value="">Select Route</option>
                                {routes.map(r => (
                                    <option key={r._id} value={r._id}>{r.source} ➝ {r.destination}</option>
                                ))}
                            </select>
                            <div>
                                <label style={{fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '4px'}}>DEPARTURE TIME</label>
                                <input type="datetime-local" value={scheduleForm.departureTime} onChange={e => setScheduleForm({...scheduleForm, departureTime: e.target.value})} style={styles.formInput} required />
                            </div>
                            <div>
                                <label style={{fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '4px'}}>ARRIVAL TIME</label>
                                <input type="datetime-local" value={scheduleForm.arrivalTime} onChange={e => setScheduleForm({...scheduleForm, arrivalTime: e.target.value})} style={styles.formInput} required />
                            </div>
                            <input type="number" placeholder="Price (₹)" value={scheduleForm.price} onChange={e => setScheduleForm({...scheduleForm, price: e.target.value})} style={styles.formInput} required />
                            <button className="btn btn-primary" style={{gridColumn: 'span 2'}}>Publish Schedule</button>
                        </form>
                    </div>

                    <div style={styles.card}>
                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.tableHeadRow}>
                                    <th>BUS</th>
                                    <th>ROUTE</th>
                                    <th>PRICE</th>
                                    <th>STATUS</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {schedules.map(s => (
                                    <tr key={s._id} style={styles.tableRow}>
                                        <td>
                                            <div style={styles.routeGroup}>
                                                <span style={styles.routeName}>{s.bus?.operatorName}</span>
                                                <span style={styles.routeSub}>{s.bus?.busNumber}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={styles.routeGroup}>
                                                <span style={styles.routeName}>{s.route?.source} ➝ {s.route?.destination}</span>
                                                <span style={styles.routeSub}>{new Date(s.departureTime).toLocaleString()}</span>
                                            </div>
                                        </td>
                                        <td style={{fontWeight: '900', color: '#10b981'}}>₹{s.price}</td>
                                        <td>
                                            <span style={styles.statusBadge}>Active</span>
                                        </td>
                                        <td>
                                            <button onClick={() => handleDeleteSchedule(s._id)} style={{...styles.textBtn, color: '#ef4444'}}>
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    dashboardWrapper: {
        width: '100%',
        animation: 'fadeIn 0.5s ease-out',
    },
    tabContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
    },
    header: { marginBottom: '8px' },
    pageTitle: { fontSize: '2.2rem', fontWeight: '900', marginBottom: '8px', color: '#fff', letterSpacing: '-1px' },
    subTitle: { color: '#64748b', fontSize: '1.1rem', fontWeight: '500' },
    
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '24px',
    },
    statCard: {
        background: '#0f141c',
        borderRadius: '24px',
        padding: '24px',
        border: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
    },
    statIcon: {
        width: '60px',
        height: '60px',
        borderRadius: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    statLabel: { fontSize: '0.85rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' },
    statValue: { fontSize: '1.8rem', fontWeight: '900', color: '#fff' },
    statTrend: { fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700' },

    contentGrid: {
        display: 'grid',
        gridTemplateColumns: '1.5fr 1fr',
        gap: '32px',
    },
    card: {
        background: '#0f141c',
        borderRadius: '28px',
        padding: '30px',
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 20px 50px -15px rgba(0,0,0,0.6)',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
    },
    cardTitle: { fontSize: '1.25rem', fontWeight: '800', color: '#fff' },
    textBtn: { background: 'transparent', border: 'none', color: '#3b82f6', fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem' },
    
    listContainer: { display: 'flex', flexDirection: 'column', gap: '16px' },
    listItem: {
        background: 'rgba(255,255,255,0.02)',
        padding: '16px',
        borderRadius: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: '1px solid rgba(255,255,255,0.02)',
        transition: 'transform 0.2s',
        cursor: 'pointer',
    },
    itemLead: { display: 'flex', alignItems: 'center', gap: '14px' },
    circleAvatar: {
        width: '44px',
        height: '44px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #1e293b, #0f172a)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#3b82f6',
        fontWeight: '900',
        fontSize: '1.1rem',
        border: '1px solid rgba(59, 130, 246, 0.2)',
    },
    itemTitle: { display: 'block', fontWeight: '700', color: '#e2e8f0', fontSize: '0.95rem' },
    itemSub: { display: 'block', fontSize: '0.8rem', color: '#64748b', fontWeight: '500' },
    itemEnd: { textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '4px' },
    itemPrice: { fontWeight: '900', color: '#10b981', fontSize: '1.1rem' },
    statusBadge: {
        fontSize: '0.65rem',
        fontWeight: '800',
        padding: '4px 8px',
        background: '#10b98115',
        color: '#10b981',
        borderRadius: '6px',
        textTransform: 'uppercase',
    },

    tableHeader: { marginBottom: '20px' },
    tableFilters: { display: 'flex', gap: '16px' },
    searchBox: {
        flex: 1,
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '12px',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    tableInput: { background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%', fontSize: '0.9rem' },
    filterBtn: {
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        color: '#fff',
        padding: '10px 20px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    table: { width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' },
    tableHeadRow: { textAlign: 'left', color: '#64748b', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' },
    tableRow: { background: 'rgba(255,255,255,0.02)', transition: 'background 0.2s' },
    userNameGroup: { display: 'flex', flexDirection: 'column' },
    mainName: { fontWeight: '700', color: '#fff' },
    subName: { fontSize: '0.8rem', color: '#64748b' },
    routeGroup: { display: 'flex', flexDirection: 'column' },
    routeName: { fontWeight: '700', color: '#fff' },
    routeSub: { fontSize: '0.8rem', color: '#64748b' },

    ticketsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' },
    ticketCard: {
        background: '#0f141c',
        borderRadius: '24px',
        padding: '24px',
        border: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    managementForm: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginTop: '10px',
    },
    formInput: {
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '14px',
        padding: '14px 18px',
        color: '#fff',
        fontSize: '0.95rem',
        outline: 'none',
        transition: 'border-color 0.2s',
        width: '100%',
    },
    ticketHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    priorityBadge: { fontSize: '0.7rem', fontWeight: '900', padding: '4px 10px', borderRadius: '8px', textTransform: 'uppercase' },
    ticketDate: { fontSize: '0.75rem', color: '#475569', fontWeight: '600' },
    ticketSubject: { fontSize: '1.2rem', fontWeight: '800', color: '#fff', margin: 0 },
    ticketMessage: { color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6' },
    ticketUser: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '14px' },
    avatarMini: { width: '32px', height: '32px', borderRadius: '8px', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: '#fff' },
    userInfoMini: { display: 'flex', flexDirection: 'column' },
    userNameMini: { fontSize: '0.85rem', fontWeight: '700', color: '#e2e8f0' },
    userEmailMini: { fontSize: '0.75rem', color: '#64748b' },
    ticketActions: { display: 'flex', gap: '12px', marginTop: 'auto' },
    ticketSelect: { flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '10px', padding: '8px', outline: 'none' },
    actionBtn: { background: '#3b82f6', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' },

    emptyState: { textAlign: 'center', color: '#475569', padding: '40px', fontSize: '1rem', fontWeight: '600', fontStyle: 'italic' }
};

export default AdminDashboard;

