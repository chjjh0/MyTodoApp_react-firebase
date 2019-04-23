import React from 'react';

const TaskDisplay = ({tasks, onDeleteHandler}) => {
    return (
      tasks.map((task) => {
        return (
          <div key={task.id} className="box">
            <div className="level">
                <div className="level-left">
                    <p className="title">{task.todo}</p>
                </div>
                <div className="level-right">
                    <button className="button is-danger" onClick={() => onDeleteHandler(task.id)}>삭제</button>
                </div>
            </div>
          </div>
        )
      })
    )
  }

export default TaskDisplay;