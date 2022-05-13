import { useEffect, useMemo, useState } from 'react';
import { Button, Input } from 'antd';
import s from './AddNewLabelForm.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { addLabel, addWord } from '../../store/appSlice';

export const AddNewLabelForm = ({
  title,
  type,
  selectedId,
  isEdit,
  setIsEdit,
}) => {
  const { labels } = useSelector((s) => s.app);

  const valueById = useMemo(
    () => labels.filter((i) => i.id === selectedId)[0],
    [labels, selectedId]
  );
  const [value, setValue] = useState(isEdit ? valueById.label : '');
  const dispatch = useDispatch();

  const onChange = (e) => setValue(e.target.value);

  const addNewLabelRequest = () => {
    setIsEdit(false);
    setValue('');
    switch (type) {
      case 'label': {
        dispatch(addLabel({ label: value, id: valueById.id }));
        break;
      }
      case 'word': {
        dispatch(addWord(value));
        break;
      }
    }
  };

  useEffect(() => {
    if (isEdit) setValue(valueById.label);
  }, [isEdit, selectedId, valueById]);

  return (
    <div className={s.Container}>
      <Input value={value} onChange={onChange} />
      <Button className={s.Button} onClick={addNewLabelRequest}>
        {isEdit
          ? `Change label name: ${valueById.label}`
          : `Add new ${title.toLowerCase()}`}
      </Button>
    </div>
  );
};
