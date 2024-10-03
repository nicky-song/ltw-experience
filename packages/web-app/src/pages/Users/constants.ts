export const userColumns = [
  {
    title: 'First Name',
    dataIndex: 'firstName',
  },
  {
    title: 'Last Name',
    dataIndex: 'lastName',
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
  {
    title: 'Phone Number',
    dataIndex: 'phoneNumber',
  },
  {
    title: 'Roles',
    dataIndex: 'roles',
    render: (roles: string[]) => roles.join(', '),
  },
  {
    title: 'Active',
    dataIndex: 'active',
    render: (active: boolean) => (active ? 'Yes' : 'No'),
  },
  {
    title: 'Details',
    dataIndex: 'details',
    key: 'details',
  },
];

export const userActivityHeader = [
  { label: 'Course Name', key: 'courseName' },
  { label: 'Status', key: 'status' },
  { label: 'Date invited', key: 'dateInvited' },
  { label: 'Date started', key: 'dateStarted' },
  { label: 'Date completed', key: 'dateCompleted' },
];

export type UserActivity = {
  courseName: string;
  status: string;
  dateInvited: string;
  dateStarted: string;
  dateCompleted: string;
};
