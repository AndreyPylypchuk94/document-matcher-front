import { Table } from 'antd';
import './LabelsTable.css';

export const LabelsTable = ({ title, tableData, type, onChange }) => {
  return (
    <Table
      scroll={{ y: 250 }}
      size={'small'}
      className="Table"
      dataSource={tableData || []}
      rowKey={title}
      locale={{
        emptyText: 'Nothing was selected.',
      }}
      pagination={{
        showSizeChanger: false,
        hideOnSinglePage: true,
        responsive: true,
      }}
      onRow={(render) => {
        return {
          onClick: () => {
            console.log(render);
          },
        };
      }}
    >
      <Table.Column
        title={title}
        dataIndex={type}
        className="LabelTable"
        align="CENTER"
      />
    </Table>
  );
};
