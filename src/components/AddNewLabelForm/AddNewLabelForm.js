import { useState } from 'react';
import { Button, Input } from 'antd';
import s from './AddNewLabelForm.module.css';
import { useDispatch } from 'react-redux';
import { addLabel, addWord } from '../../store/appSlice';

export const AddNewLabelForm = ({ title, type }) => {
  const [value, setValue] = useState('');

  const dispatch = useDispatch();

  const onChange = (e) => setValue(e.target.value);

  const addNewLabelRequest = () => {
    switch (type) {
      case 'label': {
        dispatch(addLabel(value));
        break;
      }
      case 'word': {
        dispatch(addWord(value));
        break;
      }
    }
    setValue('');
  };

  return (
    <div className={s.Container}>
      <Input value={value} onChange={onChange} />
      <Button className={s.Button} onClick={addNewLabelRequest}>
        Add new {title.toLowerCase()}
      </Button>
    </div>
  );
};
