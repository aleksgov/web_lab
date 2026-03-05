import React from 'react';
import '../../styles/TabNavigation.css';

const TabNavigation = ({ tabs, activeTab, onTabClick }) => (
    <div className="tabs-container">
        {tabs.map((tab, index) => (
            <React.Fragment key={tab}>
                <div
                    className={`tab ${activeTab === index ? 'active' : ''}`}
                    onClick={() => onTabClick(index)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && onTabClick(index)}
                >
                    {tab}
                </div>
                {index !== tabs.length - 1 && <div className="arrow">→</div>}
            </React.Fragment>
        ))}
    </div>
);

export default TabNavigation;