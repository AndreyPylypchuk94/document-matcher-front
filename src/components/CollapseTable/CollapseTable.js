import { Button, Checkbox, Input, Switch, Table, Tag } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { selectWords } from '../../store/selects/results';
import s from './CollapseTable.module.css';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { addLabel, addWord, getLabels, getWords } from '../../store/appSlice';
import { PlusOutlined } from '@ant-design/icons';
import { LabelCollapse } from '../LabelCollapse/LabelCollapse';

export const CollapseTable = ({ label }) => {
  const dispatch = useDispatch();
  const [dataCases, setDataCases] = useState([]);
  const [labelName, setLabelName] = useState(label?.label);
  const { selectedCategory } = useSelector((s) => s.app);

  const onChange = (values, caseId) => {
    setDataCases((cases) => {
      const currentCase = cases.find((i) => i.id === caseId);
      if (currentCase) currentCase.wordIds = values;
      return [...cases];
    });
  };

  const onLabelNameChange = (event) => setLabelName(event.target.value);

  const onAddCase = () => {
    if (!dataCases?.length) {
      return setDataCases([
        {
          id: Math.random().toString(16).slice(2),
          wordIds: [],
        },
      ]);
    }
    setDataCases([
      ...dataCases,
      {
        id: Math.random().toString(16).slice(2),
        wordIds: [],
      },
    ]);
  };

  const onSaveAll = async () => {
    await dispatch(
      addLabel({
        ...label,
        label: labelName,
        cases:
          dataCases?.map((i) => ({
            ...i,
            id: typeof i.id === 'number' ? i.id : undefined,
          })) || [],
      })
    );
    await dispatch(getLabels({ categoryId: selectedCategory }));
  };

  useEffect(() => {
    setDataCases(
      label.cases?.map((i) => ({
        id: i.id,
        wordIds: i.wordIds?.length ? [...i.wordIds] : [],
      }))
    );
  }, [label.cases]);

  return (
    <>
      <LabelCollapse
        labelName={labelName}
        onChange={onLabelNameChange}
        onClick={onSaveAll}
      />

      <Table
        dataSource={dataCases || []}
        rowClassName={s.Row}
        pagination={{
          hideOnSinglePage: true,
        }}
      >
        <Table.Column
          width={250}
          title={() => (
            <div className={s.ShowAll}>
              Cases
              <Button onClick={onAddCase}>Add case</Button>
            </div>
          )}
          render={(_, record, ind) => {
            return `Case ${ind + 1}`;
          }}
        />
        <Table.Column
          title={() => <div className={s.ShowAll}>Words</div>}
          dataIndex="wordIds"
          render={(wordIds, record) => {
            return (
              <WordList
                wordIds={wordIds}
                onChange={(values) => onChange(values, record.id)}
                defaultShowAll={typeof record.id === 'string'}
              />
            );
          }}
        />
      </Table>
    </>
  );
};

const WordList = ({ wordIds, onChange, defaultShowAll = false }) => {
  const words = useSelector(selectWords);
  const { selectedCategory } = useSelector((s) => s.app);

  const [wordValue, setWordValue] = useState('');
  const [isShowAll, setIsShowAll] = useState(defaultShowAll);
  const [filterValue, setFilterValue] = useState('');

  const dispatch = useDispatch();
  const [wordList, setWordList] = useState([]);

  const [newWordId, setNewWordId] = useState(null);

  const wordRef = useRef();

  useEffect(() => {
    const visibleWords = isShowAll
      ? words
      : words.filter((i) => wordIds.includes(i.id));
    if (filterValue) {
      return setWordList(
        visibleWords.filter((i) => i.word.includes(filterValue))
      );
    }
    setWordList(visibleWords);
  }, [filterValue, isShowAll, wordIds, words]);

  // const wordList = isShowAll
  //   ? words
  //   : words.filter((i) => wordIds.includes(i.id));

  const addNewWord = async () => {
    const { payload } = await dispatch(
      addWord({ word: wordValue, regexes: [], categoryId: selectedCategory })
    );
    await dispatch(getWords({ categoryId: selectedCategory }));
    if (payload?.id) {
      setNewWordId(payload.id);
      console.log(payload.id, wordRef.current);
    }
    setIsShowAll(true);
    setWordValue('');
  };

  useLayoutEffect(() => {
    const newIndex = words.findIndex(({ id }) => id === newWordId);
    if (newIndex !== -1) {
      const elem = wordRef.current.children[newIndex];
      const coords = elem.getBoundingClientRect();
      const parentCoords = wordRef.current.getBoundingClientRect();
      // wordRef.current.scrollTo({
      //   top: coords.y - parentCoords.y,
      //   behavior: 'smooth',
      // });
      wordRef.current.scrollTo({
        top: coords.y - parentCoords.y,
        behavior: 'smooth',
      });
      onChange([...wordIds, newWordId]);
      setNewWordId(null);
    }
  }, [newWordId, words]);

  return (
    <>
      <div className={s.Words}>
        <div className={s.Switch}>
          <Switch id="showAll" checked={isShowAll} onChange={setIsShowAll} />
          <label htmlFor="showAll">Show all</label>
        </div>
        <Input
          placeholder="Search words"
          value={filterValue}
          onChange={(event) => setFilterValue(event.target.value)}
        />
        <Input
          placeholder="Add new word"
          value={wordValue}
          onChange={(event) => setWordValue(event.target.value)}
          onPressEnter={addNewWord}
        />
      </div>
      <hr />
      <Checkbox.Group
        ref={wordRef}
        className={s.Container}
        value={wordIds}
        onChange={onChange}
      >
        {wordList.map((i) => (
          <div>
            <Checkbox key={i.id} value={i.id}>
              <div className={s.WordsDiv}>
                {i.word}
                <TagList
                  key={i.id}
                  word={i.word}
                  wordId={i.id}
                  regexes={i.regexes}
                />
              </div>
            </Checkbox>
          </div>
        ))}
      </Checkbox.Group>
    </>
  );
};

const TagList = ({ regexes, wordId, word }) => {
  const dispatch = useDispatch();

  const { selectedCategory } = useSelector((s) => s.app);

  const [isInputVisible, setIsInputVisible] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState(null);
  const [newTagValue, setNewTagValue] = useState('');
  const [editTagValue, setEditTagValue] = useState('');

  const newTagRef = useRef(null);
  const editTagRef = useRef(null);
  const handleSaveInputConfirm = async () => {
    if (newTagValue) {
      await dispatch(
        addWord({
          id: typeof wordId === 'number' ? wordId : undefined,
          word,
          regexes: regexes?.length ? [...regexes, newTagValue] : [newTagValue],
          categoryId: selectedCategory,
        })
      );
      await dispatch(getWords({ categoryId: selectedCategory }));
      setIsInputVisible(false);
      setNewTagValue('');
    }
  };

  const handleEditInputConfirm = async () => {
    if (editTagValue) {
      const newRegexes = regexes.filter((_, ind) => ind !== selectedTagId);
      await dispatch(
        addWord({
          id: wordId,
          word,
          regexes: [...newRegexes, editTagValue],
          categoryId: selectedCategory,
        })
      );
    }
    await dispatch(getWords({ categoryId: selectedCategory }));
    setSelectedTagId(null);
    setEditTagValue('');
  };

  const onDeleteTag = async (regexp) => {
    const newRegexes = regexes.filter((name) => name !== regexp);
    await dispatch(
      addWord({
        id: wordId,
        word,
        regexes: newRegexes,
        categoryId: selectedCategory,
      })
    );
    await dispatch(getWords({ categoryId: selectedCategory }));
  };

  const onNewTag = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setIsInputVisible(true);
  };

  useEffect(() => {
    if (isInputVisible && newTagRef.current) newTagRef.current.focus();
    if (selectedTagId && editTagRef.current) editTagRef.current.focus();
  }, [isInputVisible, selectedTagId]);

  return (
    <div>
      {regexes?.map((regexp, index) => {
        if (selectedTagId === index)
          return (
            <Input
              ref={editTagRef}
              key={regexp}
              size="small"
              className="tag-input"
              value={editTagValue}
              onChange={(value) => setEditTagValue(value.target.value)}
              onBlur={handleEditInputConfirm}
              onPressEnter={handleEditInputConfirm}
            />
          );

        return (
          <TagElement
            onDoubleClick={() => {
              setEditTagValue(regexp);
              setSelectedTagId(index);
            }}
            onClose={(event) => {
              event.stopPropagation();
              event.preventDefault();
              onDeleteTag(regexp);
            }}
            regexp={regexp}
          />
        );
      })}
      {isInputVisible && (
        <Input
          ref={newTagRef}
          type="text"
          size="small"
          className="tag-input"
          value={newTagValue}
          onChange={(value) => setNewTagValue(value.target.value)}
          onBlur={handleSaveInputConfirm}
          onPressEnter={handleSaveInputConfirm}
        />
      )}
      {!isInputVisible && (
        <Tag style={{ background: 'rgba(1,1,1,0.2)' }} onClick={onNewTag}>
          <PlusOutlined /> New RegExp
        </Tag>
      )}
    </div>
  );
};

const TagElement = ({ regexp, onDoubleClick, onClose }) => {
  return (
    <Tag
      closable
      key={regexp}
      style={{ color: 'black' }}
      onClick={(event) => {
        event.stopPropagation();
        event.preventDefault();
      }}
      onClose={onClose}
      onDoubleClick={onDoubleClick}
    >
      {regexp}
    </Tag>
  );
};
