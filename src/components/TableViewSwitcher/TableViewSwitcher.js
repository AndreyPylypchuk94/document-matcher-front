import { Button } from 'antd';
import { useSelector } from 'react-redux';
import { selectTextsSelector } from '../../store/selects/results';

export const TableViewSwitcher = ({ tableHidden, onChange }) => {
  const selectedTexts = useSelector(selectTextsSelector);

  const changeState = () => {
    onChange(!tableHidden);
  };

  return (
    <div>
      <Button disabled={selectedTexts.length > 1} onClick={changeState}>
        {!tableHidden ? 'Open table' : 'Hide table'}
      </Button>
    </div>
  );
};
