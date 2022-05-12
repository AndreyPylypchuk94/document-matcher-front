import { LabelsManagmentModal } from '../LabelsManagmentModal/LabelsManagmentModal';
import { Button, Card, Tabs } from 'antd';
import { TrashText } from '../TrashText/TrashText';
import { useDispatch, useSelector } from 'react-redux';
import { getResults, resetForm } from '../../store/appSlice';
import s from './LabelingSystem.module.css';
import { useMemo, useState } from 'react';
import { selectTextsSelector } from '../../store/selects/results';
import { HumanLabeling } from '../LabelingComponent/HumanLabeling';
import { UserReportsLabeling } from '../LabelingComponent/UserReportsLabeling';
import { sendResult } from '../../services/results';

export const LabelingSystem = ({ isProcessed }) => {
  const { labelForm, selectedText, labels } = useSelector((s) => s.app);
  const selectedTexts = useSelector(selectTextsSelector);
  const dispatch = useDispatch();

  const [activeKey, setActiveKey] = useState('1');

  const humanLabels = useMemo(
    () =>
      labels.filter((i) =>
        selectedTexts.some(({ categoryId }) => i.categoryId === categoryId)
      ),
    [selectedTexts, labels]
  );
  const reportsLabels = useMemo(
    () =>
      humanLabels
        .filter((i) => labelForm.human.some((item) => item.id === i.id))
        .reduce((arr, obj) => {
          if (obj.cases) return arr.concat(obj);
          return arr;
        }, [])
        .map((i) => ({ id: i?.id, label: `Case ${i?.id}` })),
    [labelForm.human, humanLabels]
  );
  const isObjectEmpty = Boolean(
    !labelForm.human.length && !labelForm.report.length && !labelForm.isTrash
  );

  const send = async () => {
    if (isObjectEmpty) return;
    await sendResult(
      selectedTexts.map(({ id }) => {
        return {
          id,
          labels: labelForm.human,
          caseIds: labelForm.report,
          trash: labelForm.isTrash,
        };
      })
    );
    setActiveKey('1');
    dispatch(resetForm());
    if (isProcessed) {
      dispatch(getResults({ processed: true }));
      return;
    }
    dispatch(getResults());
  };
  return (
    <Card
      title="Assign label"
      extra={<LabelsManagmentModal />}
      bodyStyle={{ padding: '2px 8px' }}
    >
      <div className={s.Container} disabled={!selectedTexts.length}>
        <Tabs activeKey={activeKey} onChange={(key) => setActiveKey(key)}>
          <Tabs.TabPane tab="Human labeling" key="1">
            <HumanLabeling
              labels={selectedTexts.length ? humanLabels : null}
              formState={labelForm.human}
              disabled={labelForm.isTrash}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Cases" key="2">
            <UserReportsLabeling
              reports={labelForm.human.length ? reportsLabels : null}
              formState={labelForm.report}
              disabled={labelForm.isTrash}
            />
          </Tabs.TabPane>
        </Tabs>
        <TrashText />
        <Button
          disabled={isObjectEmpty}
          onClick={send}
          style={{
            width: '100%',
          }}
          type="primary"
        >
          Send
        </Button>
      </div>
    </Card>
  );
};
