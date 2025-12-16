import { Complaint } from "../../interfaces/Complaint";
import useFetchData from "../../hooks/useFetchData";
import ComplaintsTable from "../../components/complaints/ComplaintsTable2";


  const SubmittedComplaintsPage  = () => {
      const { data: complaints, isLoading , refetch } = useFetchData<Complaint[]>(
    "/complaints/my-complaints-submitted"
  );
    return (
       <>
      <ComplaintsTable
        complaints={complaints?.data ?? []}
        loading={isLoading}
        refetch={refetch}
        showChangeStatus
      />
    </>
    )
  }
  
  export default SubmittedComplaintsPage;