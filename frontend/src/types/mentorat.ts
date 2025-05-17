export type Mentee = {
  _id: string;
  full_name?: string;
  email?: string;
  phone?: string;
  topic?: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
};
