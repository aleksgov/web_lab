import React from 'react';
import '../../styles/MainTab.css';

const MainTab = ({ renderLabButton }) => {
    return (
        <div className="content-box">
            <div className="main-tab-content">
                <div className="header-text">
                    Лабораторный практикум<br/>по предмету “Управление данными”
                </div>
                <div className="buttons-container">
                    {[1, 2, 3, 4, 5].reduce((rows, num, index) => {
                        if (index % 3 === 0) rows.push([]);
                        rows[rows.length - 1].push(renderLabButton(num));
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