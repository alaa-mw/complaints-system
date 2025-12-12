export enum ComplaintStatus {
  NEW = 'جديد',
  REJECTED = 'مرفوضة',
  COMPLETED = 'منجزة',
  PROCESSING = 'قيد المعالجة',
}

export const statusEnum = {
  1: ComplaintStatus.NEW,
  2: ComplaintStatus.REJECTED,
  3: ComplaintStatus.COMPLETED,
  4: ComplaintStatus.PROCESSING,
};

export const STATUS_OPTIONS = [
  { id:1, value: "جديد", label: "جديد", color: "primary" },
  { id:4, value: "قيد المعالجة", label: "قيد المعالجة", color: "warning" },
  { id:3, value: "منجزة", label: "منجزة", color: "success" },
  { id:2, value: "مرفوضة", label: "مرفوضة", color: "error" },
];