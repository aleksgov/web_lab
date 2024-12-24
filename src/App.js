import React, { useState, useEffect } from 'react';
import './App.css';
import { labFiles } from './Globals';

function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [tabs, setTabs] = useState([
    { title: 'Главная', content: 'Контент главной страницы' },
  ]);
  const [theoryContent, setTheoryContent] = useState('');

  useEffect(() => {
    if (activeTab !== 0 && tabs[activeTab]?.title.startsWith('Лабораторная работа')) {
      const labNumber = tabs[activeTab]?.title.split('№')[1].trim();
      const theoryFilePath = labFiles[labNumber]?.theory;

      if (theoryFilePath) {
        fetch(theoryFilePath)
            .then((response) => response.text())
            .then((data) => {
              setTheoryContent(data);
            })
            .catch((error) => console.error('Ошибка при загрузке теории:', error));
      } else {
        console.error(`Файл для лабораторной работы №${labNumber} не найден`);
      }
    }
  }, [activeTab, tabs]);

  const addTab = (title, content = '') => {
    const existingTabIndex = tabs.findIndex((tab) => tab.title === title);

    if (existingTabIndex !== -1) {
      setActiveTab(existingTabIndex);
    } else {
      setTabs([
        ...tabs,
        { title, content },
      ]);
      setActiveTab(tabs.length);
    }
  };

  const closeOtherTabs = (index) => {
    setTabs((prevTabs) => prevTabs.slice(0, index + 1));
    setActiveTab(index);
  };

  const getContentBoxStyle = (tabTitle) => {
    if (tabTitle.startsWith("Лабораторная работа")) {
      return { width: '1098px', height: '612px' };
    }
    return {};
  };

  const handleTheoryClick = () => {
    addTab("Теория", "");
  };

  const handleExampleClick = () => {
    addTab("Пример", "");
  };

  const handleTasksClick = () => {
    addTab("Задачи", "");
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

        {activeTab !== 0 && tabs[activeTab]?.title.startsWith("Лабораторная работа") && (
            <div className="content-box" style={getContentBoxStyle(tabs[activeTab]?.title)}>
              <div className="tab-content">
                <div className="lab-work-title">
                  {tabs[activeTab]?.title}
                </div>
                <p>{tabs[activeTab]?.content}</p>
                <div className="lab-buttons-container">
                  <button className="lab-button" onClick={handleTheoryClick}>Теория</button>
                  <button className="lab-button" onClick={handleExampleClick}>Пример</button>
                </div>
                <button className="lab-button lab-button-variants" onClick={handleTasksClick}>Варианты заданий</button>
              </div>
            </div>
        )}

        {activeTab !== 0 && tabs[activeTab]?.title === 'Теория' && (
            <div className="theory-container">
              <div className="theory-content" dangerouslySetInnerHTML={{__html: theoryContent}}/>
            </div>
        )}
      </div>
  );
}

export default App;
