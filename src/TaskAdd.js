import React from 'react';

const TaskAdd = ({ value, updateBtn, onChangeHandler, onClickHandler, onCancelHandler}) => {
    return (
      <form className="field has-addons">
        <div className="control">
            <input className="input" value={value} onChange={onChangeHandler} onFocus={onChangeHandler}></input>
        </div>
        <div className="btnBox">
            <button className="button is-primary add" onClick={onClickHandler}>{updateBtn ? '수정' : '저장'}</button>
            <button className="button is-danger" onClick={onCancelHandler}>취소</button>
        </div>
      </form>
    )
  }

export default TaskAdd;