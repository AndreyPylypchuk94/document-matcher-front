import { Button, Input } from 'antd';
import s from './LabelCollapse.module.css';

export const LabelCollapse = ({ labelName, onChange, onClick }) => {
  return (
    <div className={s.Container}>
      <div className={s.Form}>
        <label htmlFor="labelName">Label name</label>
        <Input id="labelName" value={labelName} onChange={onChange} />
      </div>
      <Button onClick={onClick}>Save all changes</Button>
    </div>
  );
};
