import React, { useState, useCallback } from 'react';
import styles from './ColorPicker.module.css';

const ColorPicker = ({ colors, selectedColorIndex, onColorChange }) => {
    const [menuVisible, setMenuVisible] = useState(false);

    const handleButtonClick = useCallback((index) => {
        onColorChange(index);
        setMenuVisible(false);
    }, [onColorChange]);

    return (
        <div className={styles.container}>
            <button
                className={styles.button}
                style={{ background: colors[selectedColorIndex] }}
                onClick={() => setMenuVisible(v => !v)}
            />
            {menuVisible && (
                <div className={styles.menu}>
                    {colors.map((color, index) =>
                            index !== selectedColorIndex && (
                                <button
                                    key={color}
                                    className={styles.button}
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