import { Button, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import s from './AddNewLabelForm.module.css';
import { addLabel } from '../../store/appSlice';
import { useEffect, useState } from 'react';

export const AddNewFormSelect = ({ items }) => {
  const { managementForm, words } = useSelector((s) => s.app);
  const [wordIds, setWordIds] = useState([]);
  const dispatch = useDispatch();
  const send = async () => {
    await dispatch(
      addLabel({
        id: managementForm.labelId,
        cases: [{ id: managementForm.caseId, wordIds: wordIds }],
      })
    );
  };

  const onChange = (values) => {
    setWordIds(values);
  };

  useEffect(() => setWordIds(items.map((i) => i.id)), [items]);
  return (
    <div className={s.Container}>
      <Select
        mode="multiple"
        style={{ width: '80%' }}
        maxTagCount="responsive"
        placeholder="Select words for case"
        value={wordIds}
        disabled={!managementForm.caseId && !wordIds.length}
        onChange={onChange}
      >
        {words.map((i) => (
          <Select.Option key={i.id} value={i.id}>
            {i.word}
          </Select.Option>
        ))}
      </Select>
      <Button
        onClick={send}
        disabled={!managementForm.caseId}
        style={{ width: '80%' }}
      >
        Add
      </Button>
    </div>
  );
};
