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
      setTabs([{ title: 'Главная', content: 'Контент главной страницы' }]); // Оставляем только главную вкладку
    }
    setActiveTab(index); 
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
              <div className="buttons-container">
                {[1, 2, 3, 4].map((number) => (
                  <div key={number} className="button" onClick={() => addTab(`Лабораторная работа №${number}`)}>
                    <div className="button-background"></div>
                    <div className="button-text">
                      Лабораторная <br /> работа
                    </div>
                    <div className="button-number">{number}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab !== 0 && (
        <div className="content-box">
          <div className="tab-content">
            <h2>{tabs[activeTab]?.title}</h2>
            <p>{tabs[activeTab]?.content}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
