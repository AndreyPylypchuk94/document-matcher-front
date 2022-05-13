import React from 'react';
import { Table } from 'antd';
import './styles.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  resetForm,
  setHumanLabelForm,
  setTextIds,
  setUserReportForm,
} from '../../store/appSlice';
import { selectFormattedTexts } from '../../store/selects/results';

export const ResultsTable = ({ isProcessed, isTableBig }) => {
  const results = useSelector(selectFormattedTexts);

  const { selectedText, selectedTextIds, labels } = useSelector((s) => s.app);

  const dispatch = useDispatch();

  const columns = [
    {
      className: 'Main',
      title: 'Source ID',
      dataIndex: 'id',
    },
    {
      className: 'Main',
      title: 'Text',
      dataIndex: 'formattedValue',
      render: (value) => <div dangerouslySetInnerHTML={{ __html: value }} />,
    },
    {
      className: 'Main',
      title: 'Words found',
      dataIndex: 'words',
    },
    {
      className: 'Main',
      title: 'Labels found',
      key: 'labelIds',
      dataIndex: 'labels',
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      if (selectedRowKeys < selectedTextIds) {
        dispatch(resetForm());
      }
      dispatch(setTextIds(selectedRowKeys));
    },
    getCheckboxProps: (record) => ({
      disabled:
        isProcessed &&
        selectedTextIds.length === 1 &&
        !selectedTextIds.includes(record.id),
    }),
    selectedRowKeys: selectedTextIds,
  };

  const setRecordId = (record) => {
    if (
      isProcessed &&
      selectedTextIds.length === 1 &&
      !selectedTextIds.includes(record.id)
    )
      return;

    if (selectedTextIds.includes(record.id)) {
      if (isProcessed) {
        const filteredArr = record.selectedLabels?.filter((o1) =>
          labels.some((o2) => o1.id === o2.id)
        );
        const filteredCasesArr = record.selectedCases?.filter((o1) =>
          labels.some((o2) => o1.id === o2.id)
        );
        if (filteredCasesArr?.length) {
          const casesId = filteredCasesArr?.map((i) => i.id);
          dispatch(setUserReportForm(casesId));
        }
        dispatch(setHumanLabelForm(filteredArr));
      }
      dispatch(resetForm());
      dispatch(setTextIds(selectedTextIds.filter((id) => id !== record.id)));
      return;
    }

    if (isProcessed) {
      const filteredArr = record.selectedLabels?.filter((o1) =>
        labels.some((o2) => o1.id === o2.id)
      );
      dispatch(setHumanLabelForm(filteredArr));

      const filteredCasesArr = record.selectedCases?.filter((o1) =>
        labels.some((o2) => o1.id === o2.id)
      );
      if (filteredCasesArr?.length) {
        const casesId = filteredCasesArr?.map((i) => i.id);
        dispatch(setUserReportForm(casesId));
      }
    }

    dispatch(setTextIds([...selectedTextIds, record.id]));
  };

  return (
    <Table
      className={`Main ${isTableBig ? 'Big' : ''}`}
      dataSource={results}
      columns={columns}
      size="small"
      // scroll={isTableBig ? { y: 200 } : {}}
      rowSelection={{
        ...rowSelection,
      }}
      rowKey={(r) => r.id}
      pagination={false}
      rowClassName={(record) =>
        record.id === selectedText.id ? 'selected' : ''
      }
      onRow={(record) => {
        return {
          onClick: () => setRecordId(record),
        };
      }}
    />
  );
};
