export interface Complaint {
  id: number;
  reference_number: string;
  location: string;
  description: string;
  status: ComplaintStatus;
  complaintType: ComplaintType;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

type ComplaintStatus = 'جديد' | 'قيد المعالجة' | 'منجزة' | 'مرفوضة' ;

// export enum ComplaintStatus {
//     NEW = 'جديد',
//     REJECTED = 'مرفوضة',
//     Completed = 'منجزة',
//     PROCESSING = 'قيد المعالجة',
// }

interface ComplaintType {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  governmentEntity: GovernmentEntity;
}

export interface GovernmentEntity {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}



// ================
// types/complaint.ts
export interface User {
  id: number;
  full_name: string;
  role: 'employee' | 'user' | 'admin';
}

export interface RequestReply {
  id: number;
  text: string;
  complaintType: 'info_request' | 'citizen_reply' | 'employee_note';
  created_at: string;
  user: User;
}

export interface ComplaintDetails {
  id: number;
  reference_number: string;
  location: string;
  description: string;
  status: string;
  created_at: string;
  attachments: string[];
  requestsAndReplies: RequestReply[];
  employee_notes: RequestReply[];
}

export interface ComplaintDetailsResponse {
  data: ComplaintDetails;
  message: string;
  status: string;
}