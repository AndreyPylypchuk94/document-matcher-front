import { Button, Input, Skeleton } from 'antd';
import s from './LabelingComponent.module.css';
import { useDispatch } from 'react-redux';
import { setUserReportForm } from '../../store/appSlice';
import { useMemo } from 'react';

export const UserReportsLabeling = ({
  reports,
  formState,
  disabled,
  value,
  onChange,
}) => {
  const dispatch = useDispatch();

  const filteredReports = useMemo(() => {
    const subString = value.toLowerCase();

    return reports?.filter(({ label }) =>
      label.toLowerCase().includes(subString)
    );
  }, [reports, value]);
  const toggleSelectedIds = (id) => {
    if (!formState.includes(id)) {
      dispatch(setUserReportForm([...formState, id]));
      return;
    }

    dispatch(setUserReportForm(formState.filter((item) => item !== id)));
  };

  return (
    <div disabled={disabled} className={s.Container}>
      <Input
        className={s.Title}
        onChange={onChange}
        value={value}
        placeholder="Enter label's cases to be used"
        style={{ backgroundColor: '#b68acc' }}
      />

      <div className={s.Labels}>
        {filteredReports?.length ? (
          filteredReports.map((item) => {
            return (
              <Button
                key={item.id}
                size="small"
                type={formState.includes(item.id) && 'primary'}
                onClick={() => toggleSelectedIds(item.id)}
              >
                {item.label}
              </Button>
            );
          })
        ) : (
          <>
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </>
        )}
      </div>
    </div>
  );
};
