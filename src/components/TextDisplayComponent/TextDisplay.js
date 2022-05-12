import s from './TextDisplay.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { message } from 'antd';
import { useEffect, useMemo, useRef } from 'react';
import { setSubText, setTextIds } from '../../store/appSlice';
import { selectTextsSelector } from '../../store/selects/results';

export const TextDisplay = ({ height }) => {
  const selectedTexts = useSelector(selectTextsSelector);
  const { selectedTextIds, results } = useSelector((s) => s.app);
  const alertMessages = useRef(false);
  const dispatch = useDispatch();

  const setSelectedText = () => {
    if (selectedTexts.length > 1) {
      alertMessages.current = true;
      dispatch(setSubText(''));
      message.info({
        content: 'Word processing does not work in multichoice mode.',
      });
      return;
    }
    dispatch(setSubText(window.getSelection().toString()));
  };
  const text = useMemo(
    () => selectedTexts.map((text) => text.formattedValue).join('<br/>'),
    [selectedTexts]
  );

  useEffect(() => {
    if (selectedTexts.length > 1) {
      dispatch(setSubText(window.getSelection().toString()));
    }
    if (selectedTexts.length === 1) {
      dispatch(setSubText(selectedTexts[0].value));
    }
  }, [selectedTexts]);

  useEffect(() => {
    if (height !== 560) return;
    if (!selectedTextIds.length) {
      return dispatch(setTextIds([...selectedTextIds, results[0].id]));
    }
  }, [height]);

  return (
    <div
      style={{
        minHeight: height,
      }}
      className={s.Container}
      onMouseUp={setSelectedText}
      onDoubleClick={setSelectedText}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
};
