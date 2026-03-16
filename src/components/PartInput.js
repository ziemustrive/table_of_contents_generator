import React, { useEffect, useRef, useState } from 'react';
import AnnexInput from './AnnexInput';

const PartInput = ({ part, index, onChange, onRemove, onAddAnnex, onAddPartAfter }) => {
    const titleRef = useRef(null);
    const [showAnnexes, setShowAnnexes] = useState(false);

    const autoResize = (textarea) => {
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        }
    };

    useEffect(() => {
        autoResize(titleRef.current);
    }, [part.title]);

    const handleTitleChange = (value) => {
        // Allow up to 95 characters in first paragraph before wrapping
        const lines = value.split('\n');
        
        if (lines.length > 0 && lines[0].length > 95) {
            // Find the best break point after 95 characters
            const firstLine = lines[0];
            let breakPoint = -1;
            
            // Try to break at a space or punctuation after 95 characters
            for (let i = 95; i < firstLine.length; i++) {
                if (firstLine[i] === ' ' || firstLine[i] === '.' || firstLine[i] === ',' || firstLine[i] === '-') {
                    breakPoint = i + 1;
                    break;
                }
            }
            
            // Only wrap if we found a break point
            if (breakPoint > 95) {
                // Reconstruct the value with proper line break
                lines[0] = firstLine.substring(0, breakPoint);
                if (lines.length === 1) {
                    lines.push(firstLine.substring(breakPoint));
                } else {
                    lines[1] = firstLine.substring(breakPoint) + '\n' + lines.slice(1).join('\n');
                }
                value = lines.join('\n');
            }
        }
        
        onChange(index, { ...part, title: value });
        
        // Auto-resize after change
        setTimeout(() => {
            autoResize(titleRef.current);
        }, 0);
    };

    const handleAnnexChange = (partIndex, annexIndex, updateAnnex) => {
        const newAnnexes = [...part.annexes];
        newAnnexes[annexIndex] = updateAnnex;
        onChange(index, { ...part, annexes: newAnnexes });
    };

    const handleRemoveAnnex = (partIndex, annexIndex) => {
        const newAnnexes = part.annexes.filter((_, i) => i !== annexIndex);
        onChange(index, { ...part, annexes: newAnnexes });
        
        // Hide annex section if no annexes left
        if (newAnnexes.length === 0) {
            setShowAnnexes(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onAddPartAfter(index);
        }
        // Allow Shift+Enter to create new paragraphs (default behavior)
    };

    const handleAddAnnex = () => {
        setShowAnnexes(true);
        onAddAnnex(index);
    };

    const hasValidAnnexes = part.annexes && part.annexes.some(annex => 
        annex && (annex.description && annex.description.trim() || annex.number && annex.number.trim())
    );

    return (
        <div className="part-input" data-part-index={index}>
            <div style={{ display: 'flex', gap: '5px' }}>
                <button
                    className="add-part-inline-btn"
                    onClick={() => onAddPartAfter(index)}
                >
                    +
                </button>
                <button
                    className="remove-btn"
                    onClick={() => onRemove(index)}
                >
                    ×
                </button>
            </div>
            <textarea
                ref={titleRef}
                placeholder="Enter part title"
                value={part.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                onKeyPress={handleKeyPress}
                className="part-input-title"
                style={{
                    flex: 1,
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '14px',
                    minHeight: '40px',
                    resize: 'none'
                }}
            />
            {(showAnnexes || hasValidAnnexes) && (
                <div className="annexes-container">
                    {part.annexes.map((annex, annexIndex) => (
                        <AnnexInput
                            key={`annex-${annexIndex}-${annex.type || 'annex'}`}
                            annex={annex}
                            index={annexIndex}
                            partIndex={index}
                            onChange={handleAnnexChange}
                            onRemove={handleRemoveAnnex}
                        />
                    ))}
                </div>
            )}
            <button
                type="button"
                className="add-annex-to-part-btn"
                onClick={handleAddAnnex}
            >
                Add Annex/Exhibit
            </button>
        </div>
    );
};

export default PartInput;
