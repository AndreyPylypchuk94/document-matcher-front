import { Button, Col, Collapse, Input, Modal, Row, Select } from 'antd';
import useModal from '../../hooks/useModal';
import { useDispatch, useSelector } from 'react-redux';
import { CollapseTable } from '../CollapseTable/CollapseTable';
import s from './LabelsManagmentModal.module.css';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { addLabel, getLabels } from '../../store/appSlice';

export const LabelsManagmentModal = () => {
  const { isVisible, openModal, closeModal } = useModal();
  const dispatch = useDispatch();
  const { labels, categories, selectedCategory } = useSelector((s) => s.app);
  const [labelName, setLabelName] = useState('');
  const [labelCategory, setLabelCategory] = useState(null);

  const [newId, setNewId] = useState(null);

  const [openPanels, setOpenPanels] = useState([]);

  const labelRef = useRef();

  const [labelFilter, setLabelFilter] = useState('');

  const addNewLabel = async () => {
    const { payload } = await dispatch(
      addLabel({
        label: labelName,
        categoryId: labelCategory,
      })
    );

    await dispatch(getLabels({ categoryId: selectedCategory }));

    setNewId(payload.id);
    setLabelFilter('');
    setLabelCategory(null);
    setLabelName('');
  };

  const filteredLabels = useMemo(
    () =>
      labels.filter((i) =>
        i.label.toLowerCase().includes(labelFilter.toLowerCase())
      ),
    [labelFilter, labels]
  );

  useLayoutEffect(() => {
    const newIndex = labels.findIndex(({ id }) => id === newId);
    if (newIndex !== -1) {
      const elem =
        labelRef.current.querySelectorAll('.ant-collapse-item')[newIndex];
      const coords = elem.getBoundingClientRect();

      const parentCoords = labelRef.current.getBoundingClientRect();
      setOpenPanels([...openPanels, newId]);
      labelRef.current.scrollTo({
        top: coords.y - parentCoords.y,
        behavior: 'smooth',
      });
      setNewId(null);
    }
  }, [newId, labels]);

  return (
    <>
      <Button style={{ width: '100%' }} onClick={openModal}>
        Labels Management
      </Button>
      <Modal
        visible={isVisible}
        footer={null}
        className={s.Modal}
        onCancel={closeModal}
        destroyOnClose
        closable={false}
      >
        <Row gutter={24}>
          <Col span={24}>
            <>
              <div className={s.Input}>
                <div className={s.SearchLabel}>
                  <Input
                    placeholder="Search label"
                    value={labelFilter}
                    onChange={(event) => setLabelFilter(event.target.value)}
                  />
                </div>
                <div className={s.NewLabel}>
                  <Input
                    placeholder="Add new label"
                    value={labelName}
                    onChange={(event) => setLabelName(event.target.value)}
                    onPressEnter={addNewLabel}
                  />
                  <Select
                    disabled={!labelName}
                    placeholder="Select category"
                    value={labelCategory}
                    allowClear
                    onChange={(labelCategory) =>
                      setLabelCategory(labelCategory)
                    }
                  >
                    {categories?.map(({ id, category }) => (
                      <Select.Option key={id} value={id}>
                        {category}
                      </Select.Option>
                    ))}
                  </Select>
                  <Button disabled={!labelCategory} onClick={addNewLabel}>
                    Add label
                  </Button>
                </div>
              </div>
              <div className={s.Collapse} ref={labelRef}>
                <Collapse activeKey={openPanels} onChange={setOpenPanels}>
                  {filteredLabels.map((label) => (
                    <Collapse.Panel header={label.label} key={label.id}>
                      <CollapseTable label={label} />
                    </Collapse.Panel>
                  ))}
                </Collapse>
              </div>
            </>
          </Col>
        </Row>
      </Modal>
    </>
  );
};
