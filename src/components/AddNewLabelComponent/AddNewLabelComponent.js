import { LabelsTable } from '../LabelsTable/LabelsTable';
import { AddNewLabelForm } from '../AddNewLabelForm/AddNewLabelForm';

export const AddNewLabelComponent = ({ title, tableData, type, onChange }) => {
  return (
    <>
      <LabelsTable
        onChange={onChange}
        tableData={tableData}
        type={type}
        title={title}
      />
      <AddNewLabelForm type={type} title={title} />
    </>
  );
};
