import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BackButton = ({ style }) => {
    const navigate = useNavigate();

    return (
        <button 
            onClick={() => navigate(-1)} 
            style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                background: 'transparent',
                border: '1px solid #D1D5DB',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                color: '#4B5563',
                marginBottom: '1rem',
                ...style
            }}
            className="btn-back"
        >
            <ArrowLeft size={18} />
            Back
        </button>
    );
};

export default BackButton;
