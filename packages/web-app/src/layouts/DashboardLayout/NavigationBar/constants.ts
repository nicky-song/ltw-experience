export const roles = [
  {
    key: '0',
    label: 'Super Admin',
    abbreviation: 'SA',
    pathprefix: 'superadmin',
    tabs: [
      {
        label: 'Organizations',
        key: '0',
        path: '/superadmin/organizations',
      },
    ],
  },
  {
    key: '1',
    label: 'Admin',
    abbreviation: 'A',
    pathprefix: 'admin',
    tabs: [
      {
        label: 'Dashboard',
        key: '0',
        path: '/admin/dashboard',
      },
      {
        label: 'Courses',
        key: '1',
        path: '/admin/courses',
      },
      {
        label: 'Users',
        key: '2',
        path: '/admin/users',
        // Per Khoa's designs, we might want this to be a dropdown in the future.
        // children:
        //     [
        //         {
        //             label: 'Item 1',
        //             key: '3'
        //         }
        //     ]
      },
    ],
  },
  {
    key: '2',
    label: 'Learner',
    abbreviation: 'L',
    pathprefix: 'learner',
    tabs: [
      {
        label: 'Dashboard',
        key: '0',
        path: '/learner/dashboard',
      },
      {
        label: 'Courses',
        key: '1',
        path: '/learner/courses',
      },
    ],
  },
];
