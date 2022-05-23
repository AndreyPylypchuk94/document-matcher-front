import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getResults, resetForm } from '../../store/appSlice';

export const ProcessedSwitcher = ({ isProcessed, setIsProcessed }) => {
  const dispatch = useDispatch();

  const { selectedCategory } = useSelector((s) => s.app);

  const onClick = () => {
    setIsProcessed(!isProcessed);
    dispatch(resetForm());
    dispatch(
      getResults({ processed: !isProcessed, categoryId: selectedCategory })
    );
  };

  return (
    <Button onClick={onClick}>
      {isProcessed ? 'Hide processed' : 'View processed'}
    </Button>
  );
};
