import { LabelsTable } from '../LabelsTable/LabelsTable';
import { AddNewLabelForm } from '../AddNewLabelForm/AddNewLabelForm';
import { useState } from 'react';
import { AddNewFormSelect } from '../AddNewLabelForm/AddNewFormSelect';

export const AddNewLabelComponent = ({
  title,
  tableData,
  tableType,
  type,
  onChange,
  items,
  selectedId,
}) => {
  const [isEdit, setIsEdit] = useState(false);

  return (
    <>
      <LabelsTable
        onChange={onChange}
        tableData={tableData}
        tableType={tableType}
        type={type}
        title={title}
        selectedId={selectedId}
        setIsEdit={setIsEdit}
      />
      {tableType === 'cases' && <AddNewFormSelect items={items} />}
      {tableType !== 'cases' && (
        <AddNewLabelForm
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          selectedId={selectedId}
          type={type}
          title={title}
        />
      )}
    </>
  );
};
