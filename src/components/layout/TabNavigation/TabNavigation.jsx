import React from 'react';
import styles from './TabNavigation.module.css';

const TabNavigation = ({ tabs, activeTab, onTabClick, onTabClose }) => (
    <nav className={styles.tabBar} role="tablist">
        {tabs.map((tab, index) => (
            <div
                key={`${tab.title}-${tab.labNumber ?? 'home'}`}
                className={`${styles.tab} ${activeTab === index ? styles.tabActive : ''}`}
                onClick={() => onTabClick(index)}
                role="tab"
                aria-selected={activeTab === index}
                tabIndex={activeTab === index ? 0 : -1}
                onKeyDown={(e) => e.key === 'Enter' && onTabClick(index)}
            >
                <span className={styles.tabTitle}>{tab.title}</span>
                {index !== 0 && (
                    <span
                        className={styles.closeBtn}
                        onClick={(e) => { e.stopPropagation(); onTabClose(index); }}
                        role="button"
                        aria-label={`Закрыть вкладку «${tab.title}»`}
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') { e.stopPropagation(); onTabClose(index); }
                        }}
                    >
                        ×
                    </span>
                )}
            </div>
        ))}
    </nav>
);

export default TabNavigation;
