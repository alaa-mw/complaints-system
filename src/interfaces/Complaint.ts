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
  version?: number;
  versions?: ComplaintVersion[];
}

export interface ComplaintDetailsResponse {
  data: ComplaintDetails;
  message: string;
  status: string;
}

export interface ComplaintsPaginationResponse {
  data: Complaint[];
  page: number;
  totalPages: number;
  total: number;
  limit: number;
}

export interface Attachment {
  id: number;
  file_path: string;
  file_type: string;
  public_id: string;
  attachable_type: string;
  attachable_id: number;
  created_at: string;
  updated_at: string;
}

export interface ComplaintVersion {
  id: number;
  location: string;
  description: string;
  status: string;
  version: number;
  changed_at: string;
  attachments: Attachment[];
}