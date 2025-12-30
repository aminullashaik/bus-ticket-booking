import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const PremiumBackButton = ({ to, label = "Go Back" }) => {
    const navigate = useNavigate();

    return (
        <motion.button
            whileHover={{ x: -2, background: 'rgba(255,255,255,0.05)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => to ? navigate(to) : navigate(-1)}
            style={styles.btn}
        >
            <div style={styles.iconCircle}>
                <ArrowLeft size={16} color="#3b82f6" />
            </div>
            <span style={styles.label}>{label}</span>
        </motion.button>
    );
};

const styles = {
    btn: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: 'transparent',
        border: 'none',
        padding: '8px 16px 8px 8px',
        borderRadius: '100px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        width: 'fit-content',
        marginBottom: '20px'
    },
    iconCircle: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: 'rgba(59, 130, 246, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid rgba(59, 130, 246, 0.2)'
    },
    label: {
        fontSize: '0.85rem',
        fontWeight: '700',
        color: '#94a3b8',
        letterSpacing: '0.5px'
    }
};

export default PremiumBackButton;
