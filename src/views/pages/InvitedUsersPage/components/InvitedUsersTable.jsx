import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_USERS } from '../../../../data/graphQL/queries/getAllUsers/getAllUsers';
import { 
  Skeleton, TableFooter, TablePagination, 
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow
} from '@mui/material';
import UserService from '../../../../data/services/UserService';
import { InvitedUsersTableDetailsCell } from './InvitedUsersTableDetailCell';

export const InvitedUsersTable = ({ setRefetch }) => {
  const [ page, setPage ] = useState(0);
  const rowsPerPage = 10;

  const currentUser = UserService.getUser();
  const isAdminUser = currentUser?.rolId === 2;
  const currentUserOwnerId = isAdminUser ? currentUser?.id : currentUser?.userOwnerId;

  const { data: usersData, loading, refetch } = useQuery(GET_ALL_USERS, {
    variables: {
      filterInput: {
        rol: { name: { in: [ 'Colaborator', 'Guest' ] } },
        disabled: { eq: false },
        userOwner: { id: { eq: currentUserOwnerId } } 
      },
      skip: page * rowsPerPage,
      take: rowsPerPage,
    },
  });

  useEffect(() => {
    refetch();
    setRefetch(refetch); 
  }, [ page, rowsPerPage, refetch, setRefetch ]);
  
  const [ selectedUser, setSelectedUser ] = useState(null);

  const handleChangeSelectedUser = (user) => {
    setSelectedUser(user);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  if (loading) return <InvitedUsersTableSkeleton />;

  const users = usersData?.allUsers?.items || [];

  return (
    <>
      <TableContainer
        className="users-table-container"
      >
        <Table stickyHeader aria-label="invited-users-table">
          <TableHead className="users-table-head">
            <TableRow>
              <TableCell>Usuario</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((user, index) => (
              <TableRow key={index}>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.rol.displayName}</TableCell>
                <TableCell>
                  <InvitedUsersTableDetailsCell
                    refetchUsers={refetch}
                    handleChangeSelectedUser={handleChangeSelectedUser}
                    selectedUser={selectedUser}
                    currentCellUser={user}    
                    isCurrentUser={currentUser.id === user.id}             
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[ rowsPerPage ]}
                count={usersData?.allUsers?.totalCount || 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handlePageChange}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );
};

const InvitedUsersTableSkeleton = () => (
  <TableContainer className="users-table-container">
    <Table stickyHeader aria-label="invited-users-table-skeleton">
      <TableHead className="users-table-head">
        <TableRow>
          <TableCell>Usuario</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Rol</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {[ 1, 2, 3, 4, 5 ].map((index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton
                variant="rectangular"
                width={'100%'}
                height={20}
                className="invited-users-cell-skeleton"
              />
            </TableCell>
            <TableCell>
              <Skeleton
                variant="rectangular"
                width={'100%'}
                height={20}
                className="invited-users-cell-skeleton"
              />   
            </TableCell>
            <TableCell>
              <Skeleton
                variant="rectangular"
                width={'100%'}
                height={20}
                className="invited-users-cell-skeleton"
              />   
            </TableCell>
            <TableCell>
              <Skeleton
                variant="rectangular"
                width={'100%'}
                height={20}
                className="invited-users-cell-skeleton"
              />   
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);
