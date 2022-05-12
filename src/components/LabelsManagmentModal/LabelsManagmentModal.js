import { Button, Col, Modal, Row } from 'antd';
import useModal from '../../hooks/useModal';
import { AddNewLabelComponent } from '../AddNewLabelComponent/AddNewLabelComponent';
import { useSelector } from 'react-redux';
import { setManagementFormLabel } from '../../store/appSlice';

export const LabelsManagmentModal = () => {
  const { isVisible, openModal, closeModal } = useModal();

  const { words, labels } = useSelector((s) => s.app);

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
        closable={false}
      >
        <Row gutter={24}>
          <Col span={12}>
            <AddNewLabelComponent
              title="Label"
              type="label"
              tableData={labels}
              onChange={setManagementFormLabel}
            />
          </Col>
          <Col span={12}>
            {/*<AddNewLabelComponent*/}
            {/*  title="Label's cases"*/}
            {/*  type="word"*/}
            {/*  tableData={words}*/}
            {/*/>*/}
          </Col>
        </Row>
        {/*<Row gutter={24}>*/}
        {/*  <Col span={12}>*/}
        {/*    <AddNewLabelComponent title="Word" type="word" tableData={words} />*/}
        {/*  </Col>*/}
        {/*  <Col span={12}>*/}
        {/*    <AddNewLabelComponent*/}
        {/*      title="RegExp"*/}
        {/*      type="word"*/}
        {/*      tableData={words}*/}
        {/*    />*/}
        {/*  </Col>*/}
        {/*</Row>*/}
      </Modal>
    </>
  );
};
