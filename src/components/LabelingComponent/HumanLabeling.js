import { Button, Input, Skeleton } from 'antd';
import s from './LabelingComponent.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { setHumanLabelForm } from '../../store/appSlice';
import { useMemo, useState } from 'react';

export const HumanLabeling = ({ labels, formState, disabled }) => {
  const dispatch = useDispatch();

  const [text, setText] = useState('');
  const { subText } = useSelector((s) => s.app);

  const humanLabels = useMemo(() => {
    const subString = text.toLowerCase();

    return labels?.filter(({ label }) =>
      label.toLowerCase().includes(subString)
    );
  }, [labels, text]);

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

  const onChange = (e) => {
    setText(e.target.value);
  };

  return (
    <div disabled={disabled} className={s.Container}>
      <Input
        className={s.Title}
        style={{ backgroundColor: '#ffcc99' }}
        placeholder="Enter human labeling"
        value={text}
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
