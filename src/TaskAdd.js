import React from 'react';

const TaskAdd = ({ value, onChangeHandler, onClickHandler}) => {
    return (
      <form className="field has-addons">
        <div className="control is-expanded">
            <input className="input" value={value} onChange={onChangeHandler}></input>
        </div>
        <div className="control">
            <button className="button is-primary" onClick={onClickHandler}>저장</button>
        </div>
      </form>
    )
  }

export default TaskAdd;