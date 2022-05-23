import { useDispatch, useSelector } from 'react-redux';
import { Select } from 'antd';
import { setCategoryId } from '../../store/appSlice';

export const CategoryButton = () => {
  const { categories } = useSelector((s) => s.app);
  const dispatch = useDispatch();
  if (!categories.length) return null;

  const onChange = (value) => dispatch(setCategoryId(value));

  return (
    <Select
      defaultValue={categories[0].category || null}
      style={{
        width: '25%',
        marginRight: 'auto',
      }}
      onChange={onChange}
      className="category"
    >
      {categories.map((i) => (
        <Select.Option value={i.id}>{i.category}</Select.Option>
      ))}
    </Select>
  );
};
