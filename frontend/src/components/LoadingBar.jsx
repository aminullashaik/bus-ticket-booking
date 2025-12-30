import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingBar = () => {
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setLoading(false);
        }, 800); // Simulate load time

        return () => clearTimeout(timer);
    }, [location.pathname]);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    initial={{ width: '0%', opacity: 1 }}
                    animate={{ width: '30%', opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        height: '3px',
                        background: 'linear-gradient(90deg, #3b82f6, #2563eb)',
                        zIndex: 10000,
                        boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
                    }}
                >
                    <motion.div 
                        animate={{ width: '100%' }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        style={{ width: '100%', height: '100%', background: 'inherit' }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoadingBar;
