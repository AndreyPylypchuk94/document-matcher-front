import { Col, Row } from 'antd';
import { ResultsTable } from './components/ResultsTable/ResultsTable';
import { LabelingSystem } from './components/LabelingSystem/LabelingSystem';
import { TextDisplay } from './components/TextDisplayComponent/TextDisplay';
import { TableViewSwitcher } from './components/TableViewSwitcher/TableViewSwitcher';
import s from './styles.module.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLabels, getResults, getWords } from './store/appSlice';
import { ProcessedSwitcher } from './components/ProcessedSwitcher/ProcessedSwitcher';
import { LabelIdsSelect } from './components/labelIdsSelect/LabelIdsSelect';
import { TextSourceSwitcher } from './components/TextSourceSwitcher/TextSourceSwitcher';
import { ChangeTableSizeSwitcher } from './components/СhangeTableSizeSwitcher/СhangeTableSizeSwitcher';
import { SelectedItems } from './components/SelectedItems/SelectedItems';

function App() {
  const [isProcessed, setIsProcessed] = useState(false);
  const [isTableBig, setIsTableBig] = useState(false);

  const [isTableVisible, setIsTableVisible] = useState(true);
  const dispatch = useDispatch();

  const { labels } = useSelector((s) => s.app);

  useEffect(() => {
    dispatch(getWords());
    dispatch(getLabels());
    dispatch(getResults());
  }, []);

  return (
    <div className={s.App}>
      <Row gutter={16} justify="space-between">
        <Col span={19}>
          <div className={s.Col}>
            {!isTableVisible && <TextSourceSwitcher />}
            {isProcessed && <LabelIdsSelect children={labels} />}
            <ChangeTableSizeSwitcher
              onClick={setIsTableBig}
              isTableBig={isTableBig}
            />
            <ProcessedSwitcher
              isProcessed={isProcessed}
              setIsProcessed={setIsProcessed}
            />
            <TableViewSwitcher
              tableHidden={isTableVisible}
              onChange={setIsTableVisible}
            />
          </div>
          <SelectedItems />
          {isTableVisible && (
            <ResultsTable isTableBig={isTableBig} isProcessed={isProcessed} />
          )}
          <TextDisplay height={isTableVisible ? 100 : 560} />
        </Col>
        <Col span={5}>
          <LabelingSystem isProcessed={isProcessed} />
        </Col>
      </Row>
    </div>
  );
}

export default App;
