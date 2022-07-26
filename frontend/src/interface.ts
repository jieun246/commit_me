export interface Accounts {
    user_id: string;
    name: string;
    iamge_url: string;
    github_address: string;
    attendances: number;
    commits: number;
    pulls: number;
    comments: number;
  }
  
  export interface Attendances {
    user_id: string;
    attendance_date: Date | string;
  }
  
  export type AttendancesResponse = Attendances[];
  
  export type AccountResponse = Accounts[];
  