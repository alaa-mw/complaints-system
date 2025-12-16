import ComplaintsTable from "../../components/complaints/ComplaintsTable2";
import useFetchData from "../../hooks/useFetchData";
import { Complaint } from "../../interfaces/Complaint";
const GovComplaintsPage = () => {
  const {
    data: complaints,
    isLoading,
    refetch,
  } = useFetchData<Complaint[]>("/complaints/my-entity-complaints");

    

  return (
    <>
      <ComplaintsTable
        complaints={complaints?.data ?? []}
        loading={isLoading}
        refetch={refetch}
        showMarkInProgress
      />
    </>
  );
};

export default GovComplaintsPage;
