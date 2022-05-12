import { Button, Skeleton } from 'antd';
import s from './LabelingComponent.module.css';
import { useDispatch, useSelector } from 'react-redux';

export const LabelingComponent = ({
  title,
  color,
  data,
  callback,
  state,
  type,
}) => {
  const dispatch = useDispatch();
  const { subText, selectedText } = useSelector((s) => s.app);

  const toggleSelectedIds = (id) => {
    if (type === 'cases') {
      if (!state.includes(id)) {
        dispatch(callback([...state, id]));
        return;
      }

      dispatch(callback(state.filter((item) => item !== id)));
      return;
    }

    if (!state.some((i) => i.id === id)) {
      dispatch(
        callback([
          ...state,
          {
            id,
            text: subText || '',
          },
        ])
      );
      return;
    }

    dispatch(callback(state.filter((item) => item.id !== id)));
  };

  return (
    <div>
      <div className={s.Title} style={{ backgroundColor: color }}>
        {title}
      </div>
      <div className={s.Labels}>
        {data !== null ? (
          data.map((item, ind) => {
            return (
              <Button
                key={item?.id || ind}
                size={'small'}
                type={
                  (state.some((i) => i?.id === item?.id) ||
                    state.includes(item?.id)) &&
                  'primary'
                }
                onClick={() => toggleSelectedIds(item?.id ?? null)}
              >
                {item?.label ?? `Case ${ind + 1}`}
              </Button>
            );
          })
        ) : (
          <Skeleton />
        )}
      </div>
    </div>
  );
};
