import { useEffect } from "react";
import useFetchDataWithParams from "../../hooks/useFetchDataWithParams";
import { ComplaintsPaginationResponse } from "../../interfaces/Complaint";
import useFetchData from "../../hooks/useFetchData";
import GovernmentToolbar, {
  Government,
} from "../../components/GovernementToolbar";
import ComplaintsFilters from "../../components/complaints/ComplaintsFilters";
import ComplaintsTable from "../../components/complaints/ComplaintsTable2";

const ComplaintsPage = () => {
  const {
    data: complaintsResponse,
    isLoading,
    queryParams,
    setQueryParams,
    refetch,
  } = useFetchDataWithParams<ComplaintsPaginationResponse>(
    "/complaints/all-complaints",
    { page: 1, limit: 10, status: "", governmentId: "" }
  );

  useEffect(() => {
    console.log("compl", complaintsResponse);
  }, [complaintsResponse]);
  const { data: governments } = useFetchData<Government[]>("/government/all");

  const handleGovernmentChange = (governmentId: string) => {
    // map special ids to empty string (no filter)
    const mappedId =
      governmentId === "all" || governmentId === "none" ? "" : governmentId;
    setQueryParams((prev) => ({
      ...prev,
      governmentId: mappedId,
      page: 1,
    }));
  };

  return (
    <>
      <GovernmentToolbar
        governments={governments?.data ?? []}
        selectedGovernment={queryParams.governmentId}
        onGovernmentChange={handleGovernmentChange}
      />
      <ComplaintsFilters
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        complaintsResponse={complaintsResponse}
      />

      <ComplaintsTable
        complaints={complaintsResponse?.data.data ?? []}
        loading={isLoading}
        refetch={refetch}
      />
    </>
  );
};

export default ComplaintsPage;
