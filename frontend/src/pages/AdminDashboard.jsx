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
import { useTranslation } from '../utils/LanguageContext';

const AdminDashboard = ({ initialTab = 'overview' }) => {
    const { t } = useTranslation();
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
    const [scheduleForm, setScheduleForm] = useState({ bus: '', route: '', departureTime: '', arrivalTime: '', price: 0 });

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
            
            setBuses(busesRes.data || []);
            setRoutes(routesRes.data || []);
            setBookings(bookingsRes.data || []);
            setTickets(ticketsRes.data || []);
            setSchedules(schedulesRes.data || []);

            // Calculate Stats
            const revenue = (bookingsRes.data || []).reduce((sum, b) => sum + (b.totalAmount || 0), 0);
            setStats({
                revenue,
                totalBookings: (bookingsRes.data || []).length,
                totalBuses: (busesRes.data || []).length,
                totalRoutes: (routesRes.data || []).length
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
            setScheduleForm({ bus: '', route: '', departureTime: '', arrivalTime: '', price: 0 });
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

    const [otpModal, setOtpModal] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [otpInput, setOtpInput] = useState('');

    const handleStartTrip = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/schedules/${selectedSchedule._id}/start`, { otp: otpInput });
            setOtpModal(false);
            setOtpInput('');
            fetchData();
            alert('Trip started! Live tracking is now active.');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to start trip. Check OTP.');
        }
    };

    return (
        <div style={styles.dashboardWrapper}>
            {/* OTP MODAL */}
            {otpModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <div style={{...styles.circleAvatar, margin: '0 auto 20px', width: '60px', height: '60px', background: '#3b82f620'}}><Users size={30} /></div>
                        <h3 style={{...styles.cardTitle, marginBottom: '10px'}}>{t('trip_verification') || 'Trip Verification'}</h3>
                        <p style={{color: '#94a3b8', fontSize: '0.9rem', marginBottom: '20px'}}>
                            Driver has assessed all tickets and is ready to start. <br/>
                            Ask driver for the verification OTP.
                        </p>
                        
                        <div style={{background: 'rgba(59, 130, 246, 0.1)', padding: '15px', borderRadius: '12px', marginBottom: '20px', border: '1px dashed rgba(59, 130, 246, 0.3)'}}>
                            <span style={{fontSize: '0.75rem', color: '#3b82f6', fontWeight: '800', display: 'block', marginBottom: '5px'}}>DRIVER SAYS OTP IS:</span>
                            <span style={{fontSize: '1.5rem', fontWeight: '900', color: '#fff', letterSpacing: '4px'}}>{selectedSchedule?.otp}</span>
                        </div>

                        <form onSubmit={handleStartTrip}>
                            <input 
                                type="text" 
                                placeholder="Verify OTP here" 
                                value={otpInput} 
                                onChange={e => setOtpInput(e.target.value)} 
                                style={{...styles.formInput, textAlign: 'center', fontSize: '1.2rem', fontWeight: '800', marginBottom: '20px'}}
                                maxLength={4}
                                required
                            />
                            <div style={{display: 'flex', gap: '12px'}}>
                                <button type="button" onClick={() => setOtpModal(false)} style={{...styles.filterBtn, flex: 1}}>{t('cancel')}</button>
                                <button type="submit" style={{...styles.actionBtn, flex: 1, height: '48px'}}>{t('start_ride') || 'Start Ride'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
                <div style={styles.tabContent}>
                    <div style={styles.header}>
                        <h2 style={styles.pageTitle}>{t('dashboard_overview')}</h2>
                        <p style={styles.subTitle}>{t('real_time_metrics')}</p>
                    </div>

                    <div style={styles.statsGrid}>
                        <StatCard icon={IndianRupee} label={t('total_revenue')} value={`₹${stats.revenue}`} color="#3b82f6" trend="12% from last month" />
                        <StatCard icon={Ticket} label={t('total_bookings')} value={stats.totalBookings} color="#10b981" trend="8.4% growth" />
                        <StatCard icon={Bus} label={t('active_fleet')} value={stats.totalBuses} color="#f59e0b" />
                        <StatCard icon={TrendingUp} label={t('total_routes')} value={stats.totalRoutes} color="#8b5cf6" />
                    </div>

                    <div style={styles.contentGrid}>
                        {/* RECENT BOOKINGS PREVIEW */}
                        <div style={styles.card}>
                            <div style={styles.cardHeader}>
                                <h3 style={styles.cardTitle}>{t('recent_bookings')}</h3>
                                <button onClick={() => setActiveTab('bookings')} style={styles.textBtn}>{t('view_all')}</button>
                            </div>
                            <div style={styles.listContainer}>
                                {bookings.slice(0, 5).map(b => (
                                    <div key={b._id} style={styles.listItem}>
                                        <div style={styles.itemLead}>
                                            <div style={styles.circleAvatar}>{b.user?.name?.charAt(0)}</div>
                                            <div>
                                                <span style={styles.itemTitle}>{b.user?.name || 'Unknown User'}</span>
                                                <span style={styles.itemSub}>{b.schedule?.bus?.operatorName || 'Unknown Operator'}</span>
                                            </div>
                                        </div>
                                        <div style={styles.itemEnd}>
                                            <span style={styles.itemPrice}>₹{b.totalAmount}</span>
                                            <span style={styles.statusBadge}>{t('booked')}</span>
                                        </div>
                                    </div>
                                ))}
                                {bookings.length === 0 && <p style={styles.emptyState}>{t('no_bookings_recorded') || 'No bookings recorded.'}</p>}
                            </div>
                        </div>

                        {/* SUPPORT PREVIEW */}
                        <div style={styles.card}>
                            <div style={styles.cardHeader}>
                                <h3 style={styles.cardTitle}>{t('open_tickets')}</h3>
                                <button onClick={() => setActiveTab('support')} style={styles.textBtn}>{t('manage')}</button>
                            </div>
                            <div style={styles.listContainer}>
                                {tickets.filter(t_item => t_item.status === 'open').slice(0, 5).map(t_item => (
                                    <div key={t_item._id} style={styles.listItem}>
                                        <div style={styles.itemLead}>
                                            <div style={{...styles.circleAvatar, background: '#ef444415', color: '#ef4444'}}><AlertCircle size={16} /></div>
                                            <div>
                                                <span style={styles.itemTitle}>{t_item.subject}</span>
                                                <span style={styles.itemSub}>{t_item.user?.name} • {new Date(t_item.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <ChevronRight size={16} color="#475569" />
                                    </div>
                                ))}
                                {tickets.filter(t_item => t_item.status === 'open').length === 0 && <p style={styles.emptyState}>{t('all_caught_up') || 'All caught up!'}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* BOOKINGS TAB */}
            {activeTab === 'bookings' && (
                <div style={styles.tabContent}>
                    <div style={styles.header}>
                        <h2 style={styles.pageTitle}>{t('booking_management')}</h2>
                        <p style={styles.subTitle}>{t('monitor_reservations')}</p>
                    </div>

                    <div style={styles.card}>
                        <div style={styles.tableHeader}>
                            <div style={styles.tableFilters}>
                                <div style={styles.searchBox}>
                                    <Search size={16} color="#64748b" />
                                    <input type="text" placeholder={t('search_placeholder')} style={styles.tableInput} />
                                </div>
                                <button style={styles.filterBtn}><Filter size={16} /> {t('filter')}</button>
                            </div>
                        </div>

                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.tableHeadRow}>
                                    <th>{t('user')}</th>
                                    <th>{t('passenger')}</th>
                                    <th>{t('phone')}</th>
                                    <th>{t('route')}</th>
                                    <th>{t('journey_date')}</th>
                                    <th>{t('seats')}</th>
                                    <th>{t('amount')}</th>
                                    <th>{t('status')}</th>
                                    <th>{t('action')}</th>
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
                                                <span style={styles.routeName}>{b.schedule?.route?.source || 'Unknown'} ➝ {b.schedule?.route?.destination || 'Unknown'}</span>
                                                <span style={styles.routeSub}>{b.schedule?.bus?.operatorName || 'Unknown Operator'}</span>
                                            </div>
                                        </td>
                                        <td>{b.schedule?.departureTime ? new Date(b.schedule.departureTime).toLocaleDateString() : 'N/A'}</td>
                                        <td>{b.seats?.join(', ') || ''}</td>
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
                                                        if(window.confirm(t('confirm_cancel_booking') || 'Are you sure you want to cancel this booking?')) {
                                                            try {
                                                                await api.put(`/bookings/${b._id}/cancel`);
                                                                fetchData();
                                                            } catch (err) { alert(t('failed_cancel_booking') || 'Failed to cancel booking') }
                                                        }
                                                    }}
                                                    style={{...styles.textBtn, color: '#ef4444'}}
                                                >
                                                    {t('cancel')}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {bookings.length === 0 && <p style={styles.emptyState}>{t('no_bookings_found') || 'No bookings found.'}</p>}
                    </div>
                </div>
            )}

            {/* SUPPORT TAB */}
            {activeTab === 'support' && (
                <div style={styles.tabContent}>
                    <div style={styles.header}>
                        <h2 style={styles.pageTitle}>{t('support_help_desk')}</h2>
                        <p style={styles.subTitle}>{t('resolve_inquiries')}</p>
                    </div>

                    <div style={styles.ticketsGrid}>
                        {tickets.map(t_item => (
                            <div key={t_item._id} style={styles.ticketCard}>
                                <div style={styles.ticketHeader}>
                                    <span style={{
                                        ...styles.priorityBadge,
                                        background: t_item.priority === 'urgent' ? '#ef444415' : '#3b82f615',
                                        color: t_item.priority === 'urgent' ? '#ef4444' : '#3b82f6'
                                    }}>
                                        {t_item.priority === 'urgent' ? t('priority_urgent') : t('priority_standard')}
                                    </span>
                                    <span style={styles.ticketDate}>{new Date(t_item.createdAt).toLocaleString()}</span>
                                </div>
                                <h4 style={styles.ticketSubject}>{t_item.subject}</h4>
                                <p style={styles.ticketMessage}>{t_item.message}</p>
                                <div style={styles.ticketUser}>
                                    <div style={styles.avatarMini}>{t_item.user?.name?.charAt(0)}</div>
                                    <div style={styles.userInfoMini}>
                                        <span style={styles.userNameMini}>{t_item.user?.name}</span>
                                        <span style={styles.userEmailMini}>{t_item.user?.email}</span>
                                    </div>
                                </div>
                                <div style={styles.ticketActions}>
                                    <select 
                                        style={styles.ticketSelect} 
                                        value={t_item.status}
                                        onChange={(e) => handleUpdateTicket(t_item._id, e.target.value)}
                                    >
                                        <option value="open">{t('status_open')}</option>
                                        <option value="in-progress">{t('status_in_progress')}</option>
                                        <option value="resolved">{t('status_resolved')}</option>
                                        <option value="closed">{t('status_closed')}</option>
                                    </select>
                                    <button style={styles.actionBtn}>{t('reply')}</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {tickets.length === 0 && <p style={styles.emptyState}>{t('no_support_tickets_found') || 'No support tickets found.'}</p>}
                </div>
            )}

            {activeTab === 'buses' && (
                <div style={styles.tabContent}>
                    <PremiumBackButton to="/admin" label={t('back_to_dashboard') || "Back to Dashboard"} />
                    <div style={styles.header}>
                        <h2 style={styles.pageTitle}>{t('bus_fleet_management')}</h2>
                        <p style={styles.subTitle}>{t('register_fleet')}</p>
                    </div>

                    <div style={{...styles.card, marginBottom: '20px'}}>
                        <h3 style={styles.cardTitle}>{t('add_new_bus')}</h3>
                        <form onSubmit={handleCreateBus} style={styles.managementForm}>
                            <input placeholder={t('bus_number')} value={busForm.busNumber} onChange={e => setBusForm({...busForm, busNumber: e.target.value})} style={styles.formInput} required />
                            <input placeholder={t('operator_name')} value={busForm.operatorName} onChange={e => setBusForm({...busForm, operatorName: e.target.value})} style={styles.formInput} required />
                            <select value={busForm.type} onChange={e => setBusForm({...busForm, type: e.target.value})} style={styles.formInput}>
                                <option>AC Seater</option>
                                <option>Non-AC Seater</option>
                                <option>AC Sleeper</option>
                                <option>Non-AC Sleeper</option>
                            </select>
                            <input type="number" placeholder={t('total_seats') || "Total Seats"} value={busForm.totalSeats} onChange={e => setBusForm({...busForm, totalSeats: e.target.value})} style={styles.formInput} required />
                            <button className="btn btn-primary" style={{gridColumn: 'span 2'}}>{t('add_bus')}</button>
                        </form>
                    </div>

                    <div style={styles.card}>
                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.tableHeadRow}>
                                    <th>{t('operator_name')}</th>
                                    <th>{t('bus_number')}</th>
                                    <th>{t('type')}</th>
                                    <th>{t('seats')}</th>
                                    <th>{t('action')}</th>
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
                    <PremiumBackButton to="/admin" label={t('back_to_dashboard') || "Back to Dashboard"} />
                    <div style={styles.header}>
                        <h2 style={styles.pageTitle}>{t('routes_management')}</h2>
                        <p style={styles.subTitle}>{t('define_travel_routes') || 'Define travel routes and reaching points'}</p>
                    </div>

                    <div style={{...styles.card, marginBottom: '20px'}}>
                        <h3 style={styles.cardTitle}>{t('create_new_route')}</h3>
                        <form onSubmit={handleCreateRoute} className="admin-grid-3">
                            <div style={styles.inputGroupCompact}>
                                <label style={styles.inputLabel}>{t('source_city')}</label>
                                <input placeholder="e.g. Hyderabad" value={routeForm.source} onChange={e => setRouteForm({...routeForm, source: e.target.value})} className="admin-input-premium" required />
                            </div>
                            <div style={styles.inputGroupCompact}>
                                <label style={styles.inputLabel}>{t('destination_city')}</label>
                                <input placeholder="e.g. Bangalore" value={routeForm.destination} onChange={e => setRouteForm({...routeForm, destination: e.target.value})} className="admin-input-premium" required />
                            </div>
                            <div style={styles.inputGroupCompact}>
                                <label style={styles.inputLabel}>{t('boarding_point')}</label>
                                <input placeholder="e.g. MGBS Terminal" value={routeForm.departurePoint} onChange={e => setRouteForm({...routeForm, departurePoint: e.target.value})} className="admin-input-premium" required />
                            </div>
                            <div style={styles.inputGroupCompact}>
                                <label style={styles.inputLabel}>{t('dropping_point')}</label>
                                <input placeholder="e.g. Majestic Stand" value={routeForm.arrivalPoint} onChange={e => setRouteForm({...routeForm, arrivalPoint: e.target.value})} className="admin-input-premium" required />
                            </div>
                            <div style={styles.inputGroupCompact}>
                                <label style={styles.inputLabel}>{t('distance_km')}</label>
                                <input type="number" placeholder="0" value={routeForm.distance} onChange={e => setRouteForm({...routeForm, distance: e.target.value})} className="admin-input-premium" required />
                            </div>
                            <div style={{ display: 'flex' }}>
                                <button className="btn btn-primary" style={{width: '100%', height: '48px', fontSize: '1rem'}}>+ {t('create_route')}</button>
                            </div>
                        </form>
                    </div>

                    <div style={styles.card}>
                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.tableHeadRow}>
                                    <th>{t('from') || 'FROM (SOURCE)'}</th>
                                    <th>{t('to') || 'TO (DESTINATION)'}</th>
                                    <th>{t('distance') || 'DISTANCE'}</th>
                                    <th>{t('action')}</th>
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
                    <PremiumBackButton to="/admin" label={t('back_to_dashboard') || "Back to Dashboard"} />
                    <div style={styles.header}>
                        <h2 style={styles.pageTitle}>{t('schedules_management')}</h2>
                        <p style={styles.subTitle}>{t('plan_schedules')}</p>
                    </div>

                    <div style={{...styles.card, marginBottom: '20px'}}>
                        <h3 style={styles.cardTitle}>{t('publish_new_schedule')}</h3>
                        <form onSubmit={handleCreateSchedule} className="admin-grid-3">
                            <div style={styles.inputGroupCompact}>
                                <label style={styles.inputLabel}>{t('select_bus')}</label>
                                <select value={scheduleForm.bus} onChange={e => setScheduleForm({...scheduleForm, bus: e.target.value})} className="admin-input-premium" required>
                                    <option value="">{t('choose_bus') || 'Choose Bus...'}</option>
                                    {buses.map(b => (
                                        <option key={b._id} value={b._id}>{b.operatorName} - {b.busNumber}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={styles.inputGroupCompact}>
                                <label style={styles.inputLabel}>{t('select_route')}</label>
                                <select value={scheduleForm.route} onChange={e => setScheduleForm({...scheduleForm, route: e.target.value})} className="admin-input-premium" required>
                                    <option value="">{t('choose_route') || 'Choose Route...'}</option>
                                    {routes.map(r => (
                                        <option key={r._id} value={r._id}>{r.source} ➝ {r.destination}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={styles.inputGroupCompact}>
                                <label style={styles.inputLabel}>{t('departure_time')}</label>
                                <input type="datetime-local" value={scheduleForm.departureTime} onChange={e => setScheduleForm({...scheduleForm, departureTime: e.target.value})} className="admin-input-premium" required />
                            </div>
                            <div style={styles.inputGroupCompact}>
                                <label style={styles.inputLabel}>{t('arrival_time')}</label>
                                <input type="datetime-local" value={scheduleForm.arrivalTime} onChange={e => setScheduleForm({...scheduleForm, arrivalTime: e.target.value})} className="admin-input-premium" required />
                            </div>
                            <div style={styles.inputGroupCompact}>
                                <label style={styles.inputLabel}>{t('ticket_price')}</label>
                                <input type="number" placeholder="e.g. 1500" value={scheduleForm.price} onChange={e => setScheduleForm({...scheduleForm, price: e.target.value})} className="admin-input-premium" required />
                            </div>
                            <button className="btn btn-primary" style={{width: '100%', height: '48px', fontSize: '1rem'}}>+ {t('publish_schedule')}</button>
                        </form>
                    </div>

                    <div style={styles.card}>
                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.tableHeadRow}>
                                    <th>{t('bus') || 'BUS'}</th>
                                    <th>{t('route') || 'ROUTE'}</th>
                                    <th>{t('price') || 'PRICE'}</th>
                                    <th>{t('status')}</th>
                                    <th>{t('action')}</th>
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
                                                <span style={styles.routeName}>{s.route?.source || 'Unknown'} ➝ {s.route?.destination || 'Unknown'}</span>
                                                <span style={styles.routeSub}>{s.departureTime ? new Date(s.departureTime).toLocaleString() : 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td style={{fontWeight: '900', color: '#10b981'}}>₹{s.price}</td>
                                        <td>
                                            <span style={{
                                                ...styles.statusBadge,
                                                background: s.status === 'Ongoing' ? '#3b82f615' : '#10b98115',
                                                color: s.status === 'Ongoing' ? '#3b82f6' : '#10b981'
                                            }}>{s.status || 'Scheduled'}</span>
                                        </td>
                                        <td>
                                            <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                                                {s.status === 'Scheduled' && (
                                                    <button 
                                                        onClick={() => { setSelectedSchedule(s); setOtpModal(true); }}
                                                        style={{...styles.actionBtn, padding: '4px 10px', fontSize: '0.75rem'}}
                                                    >
                                                        {t('start_ride') || 'Start Ride'}
                                                    </button>
                                                )}
                                                {s.status === 'Ongoing' && (
                                                    <span style={{fontSize: '0.7rem', color: '#3b82f6', fontWeight: '700'}}>{t('trip_live') || 'LIVE'}</span>
                                                )}
                                                <button onClick={() => handleDeleteSchedule(s._id)} style={{...styles.textBtn, color: '#ef4444'}}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
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
    dashboardWrapper: { width: '100%', animation: 'fadeIn 0.5s ease-out' },
    tabContent: { display: 'flex', flexDirection: 'column', gap: '32px' },
    header: { marginBottom: '8px' },
    pageTitle: { fontSize: '2.2rem', fontWeight: '900', color: '#fff', letterSpacing: '-1px' },
    subTitle: { color: '#64748b', fontSize: '1.1rem', fontWeight: '500' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' },
    statCard: { background: '#0f141c', borderRadius: '24px', padding: '24px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)' },
    statIcon: { width: '60px', height: '60px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    statInfo: { display: 'flex', flexDirection: 'column', gap: '4px' },
    statLabel: { fontSize: '0.85rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' },
    statValue: { fontSize: '1.8rem', fontWeight: '900', color: '#fff' },
    statTrend: { fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700' },

    contentGrid: { display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' },
    card: { background: '#0f141c', borderRadius: '16px', padding: '24px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.4)' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    cardTitle: { fontSize: '1.25rem', fontWeight: '800', color: '#fff' },
    textBtn: { background: 'transparent', border: 'none', color: '#3b82f6', fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem' },
    listContainer: { display: 'flex', flexDirection: 'column', gap: '12px' },
    listItem: { background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.02)' },
    itemLead: { display: 'flex', alignItems: 'center', gap: '12px' },
    circleAvatar: { width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #1e293b, #0f172a)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', fontWeight: '900', border: '1px solid rgba(59, 130, 246, 0.2)' },
    itemTitle: { display: 'block', fontWeight: '700', color: '#e2e8f0', fontSize: '0.9rem' },
    itemSub: { display: 'block', fontSize: '0.75rem', color: '#64748b' },
    itemEnd: { textAlign: 'right', display: 'flex', flexDirection: 'column' },
    itemPrice: { fontWeight: '900', color: '#10b981' },
    statusBadge: { fontSize: '0.65rem', fontWeight: '800', padding: '4px 8px', background: '#10b98115', color: '#10b981', borderRadius: '6px', textTransform: 'uppercase' },
    tableHeader: { marginBottom: '16px' },
    tableFilters: { display: 'flex', gap: '12px' },
    searchBox: { flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '10px' },
    tableInput: { background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%', fontSize: '0.9rem' },
    filterBtn: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', padding: '8px 16px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' },
    table: { width: '100%', borderCollapse: 'separate', borderSpacing: '0 4px' },
    tableHeadRow: { textAlign: 'left', color: '#64748b', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase' },
    tableRow: { background: 'rgba(255,255,255,0.02)' },
    userNameGroup: { display: 'flex', flexDirection: 'column' },
    mainName: { fontWeight: '700', color: '#fff', fontSize: '0.9rem' },
    subName: { fontSize: '0.75rem', color: '#64748b' },
    routeGroup: { display: 'flex', flexDirection: 'column' },
    routeName: { fontWeight: '700', color: '#fff', fontSize: '0.9rem' },
    routeSub: { fontSize: '0.75rem', color: '#64748b' },
    ticketsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
    ticketCard: { background: '#0f141c', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '12px' },
    managementForm: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '10px' },
    ticketHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    priorityBadge: { fontSize: '0.65rem', fontWeight: '900', padding: '4px 8px', borderRadius: '6px', textTransform: 'uppercase' },
    ticketDate: { fontSize: '0.75rem', color: '#475569' },
    ticketSubject: { fontSize: '1.1rem', fontWeight: '800', color: '#fff' },
    ticketMessage: { color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.5' },
    ticketUser: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px' },
    avatarMini: { width: '28px', height: '28px', borderRadius: '8px', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.8rem' },
    userInfoMini: { display: 'flex', flexDirection: 'column' },
    userNameMini: { fontSize: '0.85rem', fontWeight: '700', color: '#e2e8f0' },
    userEmailMini: { fontSize: '0.7rem', color: '#64748b' },
    ticketActions: { display: 'flex', gap: '10px', marginTop: 'auto' },
    ticketSelect: { flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', padding: '6px' },
    actionBtn: { background: '#3b82f6', color: '#fff', border: 'none', padding: '6px 16px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' },
    emptyState: { textAlign: 'center', color: '#475569', padding: '32px', fontSize: '0.95rem' },
    inputGroupCompact: { display: 'flex', flexDirection: 'column' },
    inputLabel: { fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', marginBottom: '6px' },
    formInput: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '0.9rem', outline: 'none', width: '100%' },
    modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
    modalContent: { background: '#0f141c', padding: '40px', borderRadius: '32px', maxWidth: '450px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 30px 60px rgba(0,0,0,0.8)', textAlign: 'center' }
};

export default AdminDashboard;
