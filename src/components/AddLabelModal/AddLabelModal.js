import { Button, Modal } from 'antd';
import useModal from '../../hooks/useModal';
import { LabelsTable } from '../LabelsTable/LabelsTable';
import { AddNewLabelForm } from '../AddNewLabelForm/AddNewLabelForm';
import s from './AddLabelModal.module.css';

export const AddLabelModal = ({ modalName, endpoints }) => {
  const { isVisible, openModal, closeModal } = useModal();

  const onAddLabel = () => {
    // Request to endpoints
  };

  return (
    <div className={s.Container}>
      <Button className={s.Button} onClick={openModal}>
        {modalName}
      </Button>
      <Modal
        title={modalName}
        visible={isVisible}
        footer={null}
        onCancel={closeModal}
      >
        <LabelsTable modalName={modalName} />
        <AddNewLabelForm modalName={modalName} />
      </Modal>
    </div>
  );
};
