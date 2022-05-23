import { Col, Row } from 'antd';
import { ResultsTable } from './components/ResultsTable/ResultsTable';
import { LabelingSystem } from './components/LabelingSystem/LabelingSystem';
import { TextDisplay } from './components/TextDisplayComponent/TextDisplay';
import { TableViewSwitcher } from './components/TableViewSwitcher/TableViewSwitcher';
import s from './styles.module.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCategories,
  getLabels,
  getResults,
  getWords,
} from './store/appSlice';
import { ProcessedSwitcher } from './components/ProcessedSwitcher/ProcessedSwitcher';
import { TextSourceSwitcher } from './components/TextSourceSwitcher/TextSourceSwitcher';
import { ChangeTableSizeSwitcher } from './components/СhangeTableSizeSwitcher/СhangeTableSizeSwitcher';
import { SelectedItems } from './components/SelectedItems/SelectedItems';
import { KnimeButton } from './components/KnimeButton/KnimeButton';
import { CategoryButton } from './components/CategoryButton/CategoryButton';
import { getKnimeStatus } from './services/results';

function App() {
  const [isProcessed, setIsProcessed] = useState(false);
  const [isTableBig, setIsTableBig] = useState(false);
  const [isKnimeActive, setIsKnimeActive] = useState(false);

  const [isTableVisible, setIsTableVisible] = useState(true);

  const [labelFilterValue, setLabelFilterValue] = useState('');

  const dispatch = useDispatch();

  const { selectedCategory } = useSelector((s) => s.app);

  const checkKnimeStatus = async () => {
    if (!selectedCategory) return;
    const response = await getKnimeStatus(selectedCategory);
    setIsKnimeActive(response);
  };

  useEffect(() => {
    dispatch(getWords());
    dispatch(getCategories());
  }, []);

  useEffect(() => {
    if (!selectedCategory) return;
    dispatch(getLabels({ categoryId: selectedCategory }));
    dispatch(getResults({ categoryId: selectedCategory }));
    setIsProcessed(false);
  }, [selectedCategory]);

  useEffect(() => {
    setIsKnimeActive(false);
    const interval = setInterval(checkKnimeStatus, 5000);
    return () => clearInterval(interval);
  }, [selectedCategory]);

  return (
    <div className={s.App}>
      <Row gutter={16} justify="space-between">
        <Col span={19}>
          <div className={s.Col}>
            {!isTableVisible && <TextSourceSwitcher />}
            <CategoryButton />
            <div>
              Knime process is
              <b style={{ paddingLeft: 3 }}>
                {isKnimeActive ? 'running' : 'not running'}
              </b>
            </div>
            <KnimeButton isKnime={isKnimeActive} setKnime={setIsKnimeActive} />
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
            <ResultsTable
              setFilterValue={setLabelFilterValue}
              isTableBig={isTableBig}
              isProcessed={isProcessed}
            />
          )}
          <TextDisplay
            isProccesed={isProcessed}
            height={isTableVisible ? 100 : 560}
          />
        </Col>
        <Col span={5}>
          <LabelingSystem
            initalValue={labelFilterValue}
            isProcessed={isProcessed}
          />
        </Col>
      </Row>
    </div>
  );
}

export default App;
