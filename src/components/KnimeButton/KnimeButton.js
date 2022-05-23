import { Button, notification } from 'antd';
import { activateKnime } from '../../services/results';
import { useSelector } from 'react-redux';

export const KnimeButton = ({ isKnime, setKnime }) => {
  const { selectedCategory } = useSelector((s) => s.app);

  const onClick = async () => {
    try {
      const response = await activateKnime(selectedCategory);
      setKnime(true);
      if (response.status === 200)
        return notification.success({
          message: 'The Knime process was started successfully!',
        });
    } catch (e) {
      if (e.response.status === 409) {
        return notification.error({
          message: 'The Knime process was interrupted by an error.',
        });
      }
      if (e.response.status === 404) {
        return notification.error({
          message: 'The resource not found.',
        });
      }
    }
  };

  return (
    <Button disabled={isKnime} onClick={onClick}>
      Use Knime
    </Button>
  );
};
