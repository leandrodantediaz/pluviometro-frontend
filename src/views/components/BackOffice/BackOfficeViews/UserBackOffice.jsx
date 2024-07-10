import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  IconButton, Table, TableBody, TableCell, TableContainer, TableFooter,
  TableHead, TableRow, TablePagination, Button, Popover, CircularProgress
} from '@mui/material';
import { DetailsIcon, EditIcon, TrashIcon, EnableIcon, DisableIcon } from '../../../../icons';
import { GET_ALL_USERS } from '../../../../data/graphQL/queries/getAllUsers/getAllUsers';
import { DELETE_USER } from '../../../../data/graphQL/mutations/deleteUser/deleteUser';
import { GET_ALL_PLANS } from '../../../../data/graphQL/queries/getAllPlans/getAllPlans';
import EditUserDialogContent from '../EditBackOffice/EditUserDialogContent';
import ConfirmHardDeleteUserDialog from '../ConfirmHardDeleteDialog/ConfirmHardDeleteUserDialog'; 

export const UserBackOffice = ({ setRefetch }) => {
  const [ page, setPage ] = useState(0);
  const rowsPerPage = 10;
  const [ isUpdated, setIsUpdated ] = useState(false);

  const { data: usersData, loading: usersLoading, refetch: refetchUsers } = useQuery(GET_ALL_USERS, {
    variables: {
      skip: page * rowsPerPage,
      take: rowsPerPage,
    },
  });

  const { data: plansData } = useQuery(GET_ALL_PLANS, {
    variables: {
      filterInput: { disabled: { eq: false } },
      skip: 0,
      take: 100,
    },
  });

  const [ deleteUser ] = useMutation(DELETE_USER, {
    onCompleted: () => setIsUpdated(prev => !prev),
  });

  const [ anchorEl, setAnchorEl ] = useState(null);
  const [ selectedUser, setSelectedUser ] = useState(null);
  const [ openDeleteUserConfirmation, setOpenDeleteUserConfirmation ] = useState(false);

  const handlePopoverOpen = (user, event) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleToggleUserStatus = async () => {
    await deleteUser({ variables: { id: selectedUser.id } });
    handlePopoverClose();
  };

  const [ openEditUserDialog, setOpenEditUserDialog ] = useState(false);

  const handleEditButtonClick = () => {
    setOpenEditUserDialog(true);
  };

  const handleCloseEditUserDialog = () => {
    setOpenEditUserDialog(false);
  };

  useEffect(() => {
    refetchUsers();
  }, [ isUpdated ]);

  useEffect(() => {
    setRefetch(refetchUsers);
  }, [ page, rowsPerPage, refetchUsers, setRefetch ]);

  if (usersLoading) return (
    <div className="circular-progress">
      <CircularProgress />
    </div>
  );

  const handleOpenDeleteUserConfirmation = () => {
    setOpenDeleteUserConfirmation(true);
  };

  return (
    <>
      <TableContainer className="table-container" sx={{ height: '100vh' }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead className="table-head">
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Plan</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usersData?.allUsers?.items
              .filter(user => user.rol?.displayName !== 'SuperAdministrador')
              .map((user, index) => (
                <TableRow key={index} style={{ backgroundColor: user.disabled ? '#f0f0f0' : 'white' }}>
                  <TableCell>{user.fullName.split(' ')[0]}</TableCell>
                  <TableCell>{user.fullName.split(' ')[1]}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{plansData?.allPlans?.items.find(plan => plan.id === user.planId)?.name}</TableCell>
                  <TableCell>{user.rol?.displayName || 'Sin rol'}</TableCell>
                  <TableCell>
                    <div>
                      <IconButton
                        onClick={(event) => handlePopoverOpen(user, event)}
                        size="small"
                      >
                        <DetailsIcon />
                      </IconButton>
                      <Popover
                        open={Boolean(anchorEl && selectedUser?.id === user.id)}
                        anchorEl={anchorEl}
                        onClose={handlePopoverClose}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'left',
                        }}
                        slotProps={{
                          paper: { className: 'detail-container' }
                        }}
                      >
                        <Button
                          onClick={handleEditButtonClick}
                          color="black"
                          className="user-detail-item"
                          startIcon={<EditIcon strokeWidth={2} sx={{ fontSize: '16px !important' }} />}
                        >
                          Editar
                        </Button>
                        <Button
                          onClick={handleOpenDeleteUserConfirmation}
                          color="black"
                          className="user-detail-item"
                          startIcon={<TrashIcon sx={{ fontSize: '16px !important' }} />}
                        >
                          Eliminar
                        </Button>
                        <Button
                          onClick={handleToggleUserStatus}
                          color="black"
                          className="user-detail-item"
                          startIcon={user.disabled ? <EnableIcon sx={{ fontSize: '16px !important' }} /> : <DisableIcon sx={{ fontSize: '16px !important' }} />}
                        >
                          {user.disabled ? 'Habilitar' : 'Deshabilitar'}
                        </Button>
                      </Popover>
                    </div>
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

      {openEditUserDialog && (
        <EditUserDialogContent
          openEditUserDialog={openEditUserDialog}
          handleCloseEditUserDialog={handleCloseEditUserDialog}
          selectedUser={selectedUser}
          setIsUpdated={setIsUpdated}
        />
      )}

      <ConfirmHardDeleteUserDialog
        openDeleteUserConfirmation={openDeleteUserConfirmation}
        handleCloseDeleteUserConfirmation={() => setOpenDeleteUserConfirmation(false)}
        selectedUser={selectedUser}
        refetchUsers={refetchUsers}
      />
    </>
  );
};
