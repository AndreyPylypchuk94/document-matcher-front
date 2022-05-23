import { Button } from 'antd';
import s from './TextSourceSwitcher.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { setTextIds } from '../../store/appSlice';

export const TextSourceSwitcher = () => {
  const { selectedTextIds, results } = useSelector((s) => s.app);
  const dispatch = useDispatch();

  const currentItemIndex = results.findIndex(
    (i) => i.id === selectedTextIds[0]
  );
  const disabledPrevious = currentItemIndex <= 0;
  const disabledNext = currentItemIndex === results.length - 1;
  const onNext = () => {
    dispatch(setTextIds([results[currentItemIndex + 1].id]));
  };

  const onPrevious = () => {
    dispatch(setTextIds([results[currentItemIndex - 1].id]));
  };

  return (
    <div className={s.Container}>
      <Button
        onClick={onPrevious}
        disabled={disabledPrevious}
        style={{ marginRight: 10 }}
      >
        Previous source
      </Button>
      <Button onClick={onNext} disabled={disabledNext}>
        Next source
      </Button>
    </div>
  );
};
