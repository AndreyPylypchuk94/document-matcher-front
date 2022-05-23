import { Pagination } from 'antd';
import s from './Paginator.module.css';

export const Paginator = ({ page, totalItems, onChange }) => {
  return (
    <div className={s.Container}>
      <Pagination
        onChange={(page) => onChange(page)}
        current={page + 1}
        pageSize={10}
        total={totalItems}
      />
      ;
    </div>
  );
};
