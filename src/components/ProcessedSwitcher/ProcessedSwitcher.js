import { Button } from 'antd';
import { useDispatch } from 'react-redux';
import { getResults } from '../../store/appSlice';

export const ProcessedSwitcher = ({ isProcessed, setIsProcessed }) => {
  const dispatch = useDispatch();

  const onClick = () => {
    setIsProcessed(!isProcessed);
    dispatch(getResults({ processed: !isProcessed }));
  };

  return (
    <Button onClick={onClick}>
      {isProcessed ? 'Hide processed' : 'View processed'}
    </Button>
  );
};
