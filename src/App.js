import React, { useState } from 'react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [tabs, setTabs] = useState([
    { title: 'Главная', content: 'Контент главной страницы' },
  ]);

  const addTab = (title) => {
    const existingTabIndex = tabs.findIndex((tab) => tab.title === title);

    if (existingTabIndex !== -1) {
      setActiveTab(existingTabIndex);
    } else {
      setTabs([
        ...tabs,
        { title, content: '' },
      ]);
      setActiveTab(tabs.length);
    }
  };

  const closeOtherTabs = (index) => {
    if (index === 0) {
      setTabs([{ title: 'Главная', content: 'Контент главной страницы' }]);
    }
    setActiveTab(index);
  };

  const getContentBoxStyle = (tabTitle) => {
    if (tabTitle.startsWith("Лабораторная работа")) {
      return { width: '1098px', height: '612px' };
    }
    return {};
  };

  return (
      <div className="App">
        <div className="background"></div>

        <div className="tabs-container">
          {tabs.map((tab, index) => (
              <React.Fragment key={index}>
                <div
                    className={`tab ${activeTab === index ? 'active' : ''}`}
                    onClick={() => closeOtherTabs(index)}
                >
                  {tab.title}
                </div>
                {index !== tabs.length - 1 && <div className="arrow">→</div>}
              </React.Fragment>
          ))}
        </div>

        {activeTab === 0 && (
            <div className="content-box">
              <div className="tab-content">
                <div className="main-tab-content">
                  <div className="header-text">
                    Лабораторный практикум<br />по предмету “Управление данными”
                  </div>
                  <div className="main-buttons-container">
                    {[1, 2, 3, 4].map((number) => (
                        <button
                            key={number}
                            className="main-button"
                            onClick={() => addTab(`Лабораторная работа №${number}`)}
                        >
                          <div className="main-button-text">
                            Лабораторная <br /> работа
                          </div>
                          <div className="main-button-number">{number}</div>
                        </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
        )}

        {activeTab !== 0 && (
            <div className="content-box" style={getContentBoxStyle(tabs[activeTab]?.title)}>
              <div className="tab-content">
                <div className="lab-work-title">
                  {tabs[activeTab]?.title}
                </div>
                <p>{tabs[activeTab]?.content}</p>
                <div className="lab-buttons-container">
                  <button className="lab-button">Теория</button>
                  <button className="lab-button">Пример</button>
                </div>
                <button className="lab-button lab-button-variants">Варианты заданий</button>
              </div>
            </div>
        )}

      </div>
  );
}

export default App;