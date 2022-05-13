import { Button, Col, Collapse, Input, Modal, Row } from 'antd';
import useModal from '../../hooks/useModal';
import { useDispatch, useSelector } from 'react-redux';
import { CollapseTable } from '../CollapseTable/CollapseTable';
import s from './LabelsManagmentModal.module.css';
import { useState } from 'react';
import { addLabel } from '../../store/appSlice';

export const LabelsManagmentModal = () => {
  const { isVisible, openModal, closeModal } = useModal();
  const dispatch = useDispatch();
  const { labels, managementForm } = useSelector((s) => s.app);

  const [labelName, setLabelName] = useState('');

  const addNewLabel = () => {
    dispatch(
      addLabel({
        label: labelName,
      })
    );
    setLabelName('');
  };

  return (
    <>
      <Button style={{ width: '100%' }} onClick={openModal}>
        Labels Management
      </Button>
      <Modal
        visible={isVisible}
        footer={null}
        width={800}
        onCancel={closeModal}
        destroyOnClose
        closable={false}
      >
        <Row gutter={24}>
          <Col span={24}>
            <>
              <div className={s.Input}>
                <Input
                  placeholder="Add new label"
                  value={labelName}
                  onChange={(event) => setLabelName(event.target.value)}
                  onPressEnter={addNewLabel}
                />
                <Button onClick={addNewLabel}>Add label</Button>
              </div>
              <Collapse defaultActiveKey={['1']}>
                {labels.map((label) => (
                  <Collapse.Panel header={label.label} key={label.id}>
                    <CollapseTable label={label} />
                  </Collapse.Panel>
                ))}
              </Collapse>
            </>
          </Col>
        </Row>
      </Modal>
    </>
  );
};
