import { Button, Input, Skeleton } from 'antd';
import s from './LabelingComponent.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { setHumanLabelForm } from '../../store/appSlice';
import { useMemo } from 'react';

export const HumanLabeling = ({
  labels,
  formState,
  disabled,
  value,
  onChange,
}) => {
  const dispatch = useDispatch();
  const { subText } = useSelector((s) => s.app);

  const humanLabels = useMemo(() => {
    const subString = value.toLowerCase();

    return labels?.filter(({ label }) =>
      label.toLowerCase().includes(subString)
    );
  }, [labels, value]);

  const toggleSelectedIds = (id) => {
    if (!formState.some((i) => i.id === id)) {
      dispatch(
        setHumanLabelForm([
          ...formState,
          {
            id,
            text: subText,
          },
        ])
      );
      return;
    }
    dispatch(setHumanLabelForm(formState.filter((item) => item.id !== id)));
  };

  return (
    <div disabled={disabled} className={s.Container}>
      <Input
        className={s.Title}
        style={{ backgroundColor: '#ffcc99' }}
        placeholder="Enter human labeling"
        value={value}
        onChange={onChange}
      />
      <div className={s.Labels}>
        {humanLabels?.length ? (
          humanLabels.map((item, ind) => {
            return (
              <Button
                key={item.id || ind}
                size="small"
                type={formState.some((i) => i.id === item.id) && 'primary'}
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
