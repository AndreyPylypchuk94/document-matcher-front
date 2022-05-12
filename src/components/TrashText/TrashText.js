import { Switch } from 'antd';
import s from './TrashText.module.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  setHumanLabelForm,
  setTrashForm,
  setUserReportForm,
} from '../../store/appSlice';

export const TrashText = () => {
  const { labelForm } = useSelector((s) => s.app);
  const dispatch = useDispatch();

  const onChange = (e) => {
    dispatch(setHumanLabelForm([]));
    dispatch(setUserReportForm([]));
    dispatch(setTrashForm(e));
  };
  return (
    <div className={s.Container}>
      <Switch checked={labelForm.isTrash} onChange={onChange} />
      <p>This text is trash.</p>
    </div>
  );
};
