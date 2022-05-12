import { Select } from 'antd';
import { useDispatch } from 'react-redux';
import { getResults } from '../../store/appSlice';

export const LabelIdsSelect = ({ children }) => {
  const dispatch = useDispatch();

  const onChange = (value) => {
    dispatch(getResults({ labelIds: value, processed: true }));
  };

  return (
    <Select
      mode="multiple"
      allowClear
      style={{ width: '20%' }}
      placeholder="Please select"
      maxTagCount="responsive"
      onChange={onChange}
    >
      {children.map((i) => (
        <Select.Option key={i.id}>{i.label}</Select.Option>
      ))}
      123
    </Select>
  );
};
