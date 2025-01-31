import React, { useState, useCallback } from 'react';
import '../styles/ColorPicker.css';

const ColorPicker = ({ colors, selectedColorIndex, onColorChange }) => {
    const [menuVisible, setMenuVisible] = useState(false);

    const handleButtonClick = useCallback((index) => {
        onColorChange(index);
        setMenuVisible(false);
    }, [onColorChange]);

    return (
        <div className="color-picker-container">
            <button
                className="color-picker-button"
                style={{ background: colors[selectedColorIndex] }}
                onClick={() => setMenuVisible(v => !v)}
            />

            {menuVisible && (
                <div className="color-picker-menu">
                    {colors.map((color, index) =>
                            index !== selectedColorIndex && (
                                <button
                                    key={color}
                                    className="color-picker-button"
                                    style={{ background: color }}
                                    onClick={() => handleButtonClick(index)}
                                />
                            )
                    )}
                </div>
            )}
        </div>
    );
};

export default React.memo(ColorPicker);