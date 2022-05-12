import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import s from './SelectedItems.module.css';

export const SelectedItems = () => {
  const { labelForm, labels } = useSelector((s) => s.app);

  const human = useMemo(
    () =>
      labels
        .filter(({ id }) => labelForm.human.some((i) => i.id === id))
        .map((i) => i.label),
    [labelForm]
  );

  const report = useMemo(
    () => labelForm.report.map((i) => `Case ${i}`).join(', '),
    [labelForm.report]
  );
  return (
    <div className={s.Container}>
      <div>
        {!!human.length && `Selected labels:`}
        {!!human.length && <p>{human.join(', ')}</p>}
      </div>

      <div>
        {!!report.length && `Selected cases:`}
        {!!report.length && <p>{report}</p>}
      </div>
    </div>
  );
};
