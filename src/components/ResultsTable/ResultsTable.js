import React, { useMemo, useState } from 'react';
import { Button, Input, Select, Table } from 'antd';
import './styles.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  getResults,
  setHumanLabelForm,
  setTextIds,
  setUserReportForm,
} from '../../store/appSlice';
import { selectFormattedTexts } from '../../store/selects/results';
import { Paginator } from '../Paginator/Paginator';

export const ResultsTable = ({ isProcessed, isTableBig, setFilterValue }) => {
  const results = useSelector(selectFormattedTexts);

  const {
    selectedTextIds,
    labels,
    words,
    selectedCategory,
    totalElements,
    page,
  } = useSelector((s) => s.app);

  const [sourceIDFilter, setSourceIDFilter] = useState('');
  const [textFilter, setTextFilter] = useState('');
  const [wordsFilter, setWordsFilter] = useState([]);
  const [labelsFilter, setLabelsFilter] = useState([]);

  const dispatch = useDispatch();
  const onTextFilter = (event) => setTextFilter(event.target.value);
  const onsetSourceIDFilter = (event) => setSourceIDFilter(event.target.value);
  const isAnyFilterInTable = Boolean(
    sourceIDFilter || textFilter || wordsFilter.length || labelsFilter.length
  );
  const filteredResults = useMemo(() => {
    let list = results;
    if (sourceIDFilter) {
      list = list.filter(({ id }) => String(id).includes(sourceIDFilter));
    }
    if (textFilter) {
      list = list.filter(({ value }) => value.includes(textFilter));
    }
    if (wordsFilter.length) {
      list = list.filter(({ wordIds }) =>
        wordIds?.some((id) => wordsFilter.includes(id))
      );
    }
    if (labelsFilter.length) {
      list = list.filter(({ selectedLabelsIds, labelIds }) => {
        if (selectedLabelsIds) {
          return selectedLabelsIds?.some((id) => labelsFilter.includes(id));
        }
        return labelIds?.some((id) => labelsFilter.includes(id));
      });
    }
    return list;
  }, [labelsFilter, results, sourceIDFilter, textFilter, wordsFilter]);
  const formattedString = useMemo(() => {
    const foundWords = words
      .filter((i) => wordsFilter.includes(i.id))
      .map((i) => i.word);
    const foundLabels = labels
      .filter((i) => labelsFilter.includes(i.id))
      .map((i) => i.label);
    return (
      'All filters to table: ' +
      [sourceIDFilter, textFilter, ...foundWords, ...foundLabels]
        .filter((i) => i)
        .join(', ')
    );
  }, [labels, labelsFilter, sourceIDFilter, textFilter, words, wordsFilter]);

  const columns = [
    {
      width: 150,
      className: 'Main',
      title: () => (
        <Input
          placeholder="Source ID"
          value={sourceIDFilter}
          allowClear
          onChange={onsetSourceIDFilter}
        />
      ),
      dataIndex: 'id',
    },
    {
      className: 'Main',
      title: () => (
        <Input
          placeholder="Text"
          value={textFilter}
          allowClear
          onChange={onTextFilter}
        />
      ),
      dataIndex: 'formattedValue',
      render: (value) => <div dangerouslySetInnerHTML={{ __html: value }} />,
    },
    {
      width: 200,
      className: 'Main',
      title: () => (
        <Select
          style={{ width: '100%' }}
          mode="multiple"
          allowClear
          maxTagCount="responsive"
          placeholder="Words found"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          onChange={(values) => setWordsFilter(values)}
        >
          {words.map((i) => (
            <Select.Option key={i.id} value={i.id}>
              {i.word}
            </Select.Option>
          ))}
        </Select>
      ),
      dataIndex: 'words',
      render: (record) => record?.join(', '),
    },
    {
      width: 200,
      className: 'Main',
      title: () => (
        <Select
          style={{ width: '100%' }}
          mode="multiple"
          allowClear
          maxTagCount="responsive"
          placeholder="Labels found"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          onChange={(values) => setLabelsFilter(values)}
        >
          {labels.map((i) => (
            <Select.Option key={i.id} value={i.id}>
              {i.label}
            </Select.Option>
          ))}
        </Select>
      ),
      key: 'labelIds',
      dataIndex: ['labels'],
      render: (text) => (
        <div className="Label buttons">
          {text?.map((label) => (
            <Button
              title={label}
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
                setFilterValue(label || '');
              }}
              className="Label button"
              type="link"
            >
              {label}
            </Button>
          ))}
        </div>
      ),
    },
  ];

  const onCheckProcessed = (selectedRowKeys, records) => {
    const record = records[0] || {};
    const filteredArr =
      record.selectedLabels?.map((o1) => ({
        id: o1.id,
        text: o1.text || null,
      })) || [];
    const filteredCasesArr = record.selectedCases?.filter((o1) =>
      labels.some((o2) => o1.id === o2.id)
    );
    if (filteredCasesArr?.length) {
      const casesId = filteredCasesArr?.map((i) => i.id);
      dispatch(setUserReportForm(casesId));
      console.log(casesId);
    }
    console.log(filteredArr);
    dispatch(setHumanLabelForm(filteredArr));
    dispatch(setTextIds(selectedRowKeys));
  };

  const onCheck = (selectedRowKeys, records) => {
    dispatch(setTextIds(selectedRowKeys));

    const filteredArr = [];

    records.forEach((record) => {
      record.labelIds?.forEach((id) => {
        if (filteredArr.every((i) => i.id !== id)) {
          filteredArr.push({ id, text: null });
        }
      });
    });
    dispatch(setHumanLabelForm(filteredArr));
  };

  const rowSelection = {
    onChange: isProcessed ? onCheckProcessed : onCheck,
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
    const newSelectedId = selectedTextIds.includes(record.id)
      ? selectedTextIds.filter((id) => id !== record.id)
      : [...selectedTextIds, record.id];
    const newResults = results.filter(({ id }) => newSelectedId.includes(id));

    isProcessed
      ? onCheckProcessed(newSelectedId, newResults)
      : onCheck(newSelectedId, newResults);
  };

  return (
    <div
      style={{
        height: totalElements ? 515 : 490,
      }}
    >
      {isAnyFilterInTable && (
        <p
          style={{
            margin: 0,
          }}
        >
          {formattedString}
        </p>
      )}

      <Table
        className={`Main ${isTableBig ? 'Big' : ''}`}
        dataSource={filteredResults}
        columns={columns}
        size="small"
        scroll={{ y: 430, x: true }}
        rowSelection={{
          ...rowSelection,
        }}
        rowKey={(r) => r.id}
        pagination={false}
        rowClassName={(record) =>
          selectedTextIds.includes(record.id) ? 'selected' : ''
        }
        onRow={(record) => {
          return {
            onClick: () => setRecordId(record),
          };
        }}
      />
      {!!totalElements && (
        <Paginator
          totalItems={totalElements}
          page={page}
          onChange={(page) =>
            dispatch(
              getResults({
                page: page - 1,
                processed: true,
                categoryId: selectedCategory,
              })
            )
          }
        />
      )}
    </div>
  );
};
