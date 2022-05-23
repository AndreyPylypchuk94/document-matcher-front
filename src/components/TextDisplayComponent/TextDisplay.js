import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo } from 'react';
import { setSubText, setTextIds } from '../../store/appSlice';
import {
  selectSubTextSelector,
  selectTextsSelector,
} from '../../store/selects/results';
import s from './TextDisplay.module.css';

export const TextDisplay = ({ height, isProccesed }) => {
  const selectedTexts = useSelector(selectTextsSelector);
  const selectedSubText = useSelector(selectSubTextSelector);
  const { selectedTextIds, results } = useSelector((s) => s.app);
  const dispatch = useDispatch();

  const setSelectedText = () => {
    if (selectedTexts.length > 1) {
      dispatch(setSubText(''));
      return;
    }
    dispatch(setSubText(window.getSelection().toString()));
  };
  const text = useMemo(
    () => selectedTexts.map((text) => text.formattedValue).join('<br/>'),
    [selectedTexts]
  );

  const processedText = useMemo(
    () => selectedTexts.map((text) => text.formattedSubValue).join('<br/>'),
    [selectedTexts]
  );

  useEffect(() => {
    if (selectedTexts.length > 1) {
      dispatch(setSubText(window.getSelection().toString()));
    }

    if (isProccesed) {
      const prevItem = selectedTexts
        .map((results) => results.selectedLabels.map((a) => a?.text).join(''))
        .join('');
      dispatch(setSubText(prevItem));
    }
  }, [dispatch, isProccesed, selectedTexts]);

  useEffect(() => {
    if (height !== 560) return;
    if (!selectedTextIds.length) {
      return dispatch(setTextIds([...selectedTextIds, results[0].id]));
    }
  }, [height]);

  useEffect(() => {
    if (height === 560) {
      dispatch(setTextIds([results[0].id]));
    }
  }, [results]);

  return (
    <div
      className={s.Container}
      style={{
        height: height,
        userSelect: selectedTexts.length > 1 || isProccesed ? 'none' : 'auto',
      }}
    >
      <div
        className={s.Text}
        onMouseUp={setSelectedText}
        onDoubleClick={setSelectedText}
        dangerouslySetInnerHTML={{ __html: isProccesed ? processedText : text }}
      />
      <div
        className={s.Background}
        onMouseUp={setSelectedText}
        onDoubleClick={setSelectedText}
        dangerouslySetInnerHTML={{ __html: selectedSubText }}
      />
    </div>
  );
};
