import React from 'react';

const TaskTab = ({ taskContent, taskContentRef }) => {
    return (
        <div className="theory-container">
            <div ref={taskContentRef} className="theory-content" dangerouslySetInnerHTML={{ __html: taskContent }} />
        </div>
    );
};

export default TaskTab;