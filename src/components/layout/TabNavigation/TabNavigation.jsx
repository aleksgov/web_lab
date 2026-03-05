import React from 'react';
import styles from './TabNavigation.module.css';

const TabNavigation = ({ tabs, activeTab, onTabClick }) => (
    <div className={styles.container}>
        {tabs.map((tab, index) => (
            <React.Fragment key={tab}>
                <div
                    className={`${styles.tab} ${activeTab === index ? styles.tabActive : ''}`}
                    onClick={() => onTabClick(index)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && onTabClick(index)}
                >
                    {tab}
                </div>
                {index !== tabs.length - 1 && <div className={styles.arrow}>→</div>}
            </React.Fragment>
        ))}
    </div>
);

export default TabNavigation;