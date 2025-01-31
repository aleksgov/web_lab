import React from 'react';
import '../styles/TabNavigation.css';

const TabNavigation = ({ tabs, activeTab, closeOtherTabs }) => {
    return (
        <div className="tabs-container">
            {tabs.map((tab, index) => (
                <React.Fragment key={tab}>
                    <div
                        className={`tab ${activeTab === index ? 'active' : ''}`}
                        onClick={() => closeOtherTabs(index)}
                        role="button"
                        tabIndex={0}
                    >
                        {tab}
                    </div>
                    {index !== tabs.length - 1 && <div className="arrow">→</div>}
                </React.Fragment>
            ))}
        </div>
    );
};

export default TabNavigation;