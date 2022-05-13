import { Button, Table } from 'antd';
import './LabelsTable.css';

export const LabelsTable = ({
  title,
  tableData,
  tableType,
  type,
  onChange,
  selectedId,
  setIsEdit,
}) => {
  return (
    <Table
      size={'small'}
      className="Table"
      dataSource={tableData || []}
      rowKey={(r) => r.id}
      locale={{
        emptyText: 'Nothing was selected.',
      }}
      pagination={{
        showSizeChanger: false,
        pageSize: 6,
        hideOnSinglePage: true,
        responsive: true,
      }}
      onRow={(record) => {
        return {
          onClick: () => {
            if (typeof onChange === 'function') onChange(record.id);
          },

          // switch (tableType) {
          //   case 'labels': {
          //     dispatch(onChange({ ...managementForm, labelId: render.id }));
          //     break;
          //   }
          //   case 'cases': {
          //     dispatch(onChange({ ...managementForm, caseId: render.id }));
          //     break;
          //   }
          // }
        };
      }}
      rowClassName={(record) => (record.id === selectedId ? 'selected' : '')}
    >
      <Table.Column
        title={title}
        dataIndex={type}
        className="LabelTable"
        align="CENTER"
      />
      <Table.Column
        title="ACTION"
        width={90}
        dataIndex={type}
        className="LabelTable"
        align="CENTER"
        render={(_, render) => (
          <Button
            type="link"
            onClick={() => {
              setIsEdit(true);
            }}
          >
            Edit
          </Button>
        )}
      />
    </Table>
  );
};
