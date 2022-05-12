import { Button } from 'antd';

export const ChangeTableSizeSwitcher = ({ isTableBig, onClick }) => {
  const onChange = () => {
    onClick(!isTableBig);
  };

  return (
    <Button onClick={onChange}>
      {isTableBig ? 'Small table' : 'Big table'}
    </Button>
  );
};
