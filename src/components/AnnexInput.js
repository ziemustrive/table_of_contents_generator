import React, { useEffect, useRef } from 'react';

const AnnexInput = ({ annex, index, partIndex, onChange, onRemove }) => {
    const numberRef = useRef(null);
    const descriptionRef = useRef(null);

    const autoResize = (textarea) => {
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        }
    };

    useEffect(() => {
        autoResize(numberRef.current);
        autoResize(descriptionRef.current);
    }, [annex.number, annex.description]);

    const handleChange = (field, value) => {
        onChange(partIndex, index, { ...annex, [field]: value });
        
        // Auto-resize after change
        setTimeout(() => {
            if (field === 'number') {
                autoResize(numberRef.current);
            } else if (field === 'description') {
                autoResize(descriptionRef.current);
            }
        }, 0);
    };

    return (
        <div className="annex-input">
            <select
                value={annex.type || 'Annex'}
                onChange={(e) => handleChange('type', e.target.value)}
                className="annex-type"
            >
                <option value="Annex">Annex</option>
                <option value="Exhibit">Exhibit</option>
            </select>
            <textarea
                ref={numberRef}
                placeholder="Letter/Number"
                value={annex.number || ''}
                onChange={(e) => handleChange('number', e.target.value)}
                className="annex-number"
                style={{
                    width: '90px',
                    padding: '5px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    minHeight: '30px',
                    resize: 'none'
                }}
            />
            <textarea
                ref={descriptionRef}
                placeholder="Enter description"
                value={annex.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                className="annex-title"
                style={{
                    flex: 1,
                    padding: '5px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '12px',
                    minHeight: '30px',
                    resize: 'none'
                }}
            />
            <button
                className="remove-annex-btn"
                onClick={() => onRemove(partIndex, index)}
            >
                ×
            </button>
        </div>
    );
};

export default AnnexInput;
