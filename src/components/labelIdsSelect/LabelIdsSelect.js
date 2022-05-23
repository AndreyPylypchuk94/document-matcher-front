import { Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setLabelsIds } from '../../store/appSlice';

export const LabelIdsSelect = ({ children }) => {
  const dispatch = useDispatch();

  const { selectedLabelsIds } = useSelector((s) => s.app);

  const onChange = (value) => {
    dispatch(setLabelsIds(value));
    // dispatch(getResults({ labelIds: value, processed: true }));
  };

  return (
    <Select
      mode="multiple"
      allowClear
      style={{ width: '20%' }}
      placeholder="Please select"
      maxTagCount="responsive"
      value={selectedLabelsIds}
      onChange={onChange}
    >
      {children?.map((i) => (
        <Select.Option key={i.id} value={i.id}>
          {i.label}
        </Select.Option>
      ))}
    </Select>
  );
};
