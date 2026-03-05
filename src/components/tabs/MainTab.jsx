import React from 'react';
import '../../styles/MainTab.css';
import NumberButton from '../ui/NumberButton';

const LAB_NUMBERS = [1, 2, 3, 4, 5];

const MainTab = ({ onLabClick }) => {
    return (
        <div className="content-box">
            <div className="main-tab-content">
                <div className="header-text">
                    Лабораторный практикум<br/>по предмету "Управление данными"
                </div>
                <div className="buttons-container">
                    {LAB_NUMBERS.reduce((rows, num, index) => {
                        if (index % 3 === 0) rows.push([]);
                        rows[rows.length - 1].push(
                            <NumberButton
                                key={num}
                                number={num}
                                text="Лабораторная работа"
                                onClick={() => onLabClick(num)}
                            />
                        );
                        return rows;
                    }, []).map((row, i) => (
                        <div key={i} className="button-row">{row}</div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default React.memo(MainTab);