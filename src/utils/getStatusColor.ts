import { STATUS_OPTIONS } from "../static/statusEnum";

export  const getStatusColor = (status: string) => {
    const statusOption = STATUS_OPTIONS.find((opt) => opt.value === status);
    return statusOption?.color || "default";
  };