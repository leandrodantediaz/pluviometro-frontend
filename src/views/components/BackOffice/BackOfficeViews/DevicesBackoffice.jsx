import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow,
  TablePagination, CircularProgress, IconButton, Popover, Button, Dialog, Tooltip
} from '@mui/material';
import { DetailsIcon, EditIcon, DisableIcon, EnableIcon } from '../../../../icons';
import { GET_ALL_DEVICES } from '../../../../data/graphQL/queries/getAllDevices/getAllDevices';
import { DELETE_DEVICE } from '../../../../data/graphQL/mutations/deleteDevices/deleteDevices';
import { EDIT_DEVICE } from '../../../../data/graphQL/mutations/editDevices/editDevices';
import EditDeviceDialogContent from '../EditBackOffice/EditDeviceDialogContent';
import '../backOfficeComponents.scss';

export const DevicesBackoffice = ({ setRefetch }) => {
  const [ page, setPage ] = useState(0);
  const rowsPerPage = 10;
  const [ isUpdated, setIsUpdated ] = useState(false);

  const { data: devicesData, loading: devicesLoading, refetch: refetchDevices } =
    useQuery(GET_ALL_DEVICES, {
      variables: {
        skip: page * rowsPerPage,
        take: rowsPerPage,
      },
    });

  const [ anchorEl, setAnchorEl ] = useState(null);
  const [ selectedDevice, setSelectedDevice ] = useState(null);
  const [ openEditDeviceDialog, setOpenEditDeviceDialog ] = useState(false);

  const [ deleteDevice ] = useMutation(DELETE_DEVICE, {
    onCompleted: () => setIsUpdated(prev => !prev),
  });

  const [ editDevice, { loading: editing } ] = useMutation(EDIT_DEVICE, {
    onCompleted: () => {
      setIsUpdated(prev => !prev);
      handlePopoverClose(); // Cerrar popover al completar la edición
    },
  });

  useEffect(() => {
    refetchDevices();
  }, [ isUpdated, refetchDevices ]);

  useEffect(() => {
    setRefetch(refetchDevices);
  }, [ page, rowsPerPage, refetchDevices, setRefetch ]);

  const handlePopoverOpen = (device, event) => {
    setAnchorEl(event.currentTarget);
    setSelectedDevice(device);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setSelectedDevice(null);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleToggleDeviceStatus = async () => {
    await deleteDevice({ variables: { id: selectedDevice.id } });
    refetchDevices();
    handlePopoverClose();
  };

  const handleEditButtonClick = () => {
    setOpenEditDeviceDialog(true);
  };

  const handleCloseEditDeviceDialog = () => {
    setOpenEditDeviceDialog(false);
  };

  if (devicesLoading) return (
    <div className="circular-progress">
      <CircularProgress />
    </div>
  );

  const devices = devicesData?.allDevices?.items || [];

  return (
    <>
      <TableContainer className="table-container" sx={{ height: '100vh' }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead className="table-head">
            <TableRow>
              <TableCell>N° de serie</TableCell>
              <TableCell>
                <Tooltip title="Etiqueta de Dispositivo" arrow>
                  <span>Etiqueta</span>
                </Tooltip>
              </TableCell>
              <TableCell>Device Name</TableCell>
              <TableCell>Latitud</TableCell>
              <TableCell>Longitud</TableCell>
              <TableCell>Propietario</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {devices.map((device, index) => (
              <TableRow key={index} sx={{ backgroundColor: device.disabled ? '#f5f5f5' : 'inherit' }}>
                <TableCell>{device.serialNumber}</TableCell>
                <TableCell>{device.name}</TableCell>
                <TableCell>{device.userName}</TableCell>
                <TableCell>{device.latitude}</TableCell>
                <TableCell>{device.longitude}</TableCell>
                <TableCell>{device.owner?.fullName}</TableCell>
                <TableCell>
                  <div>
                    <IconButton
                      onClick={(event) => handlePopoverOpen(device, event)}
                      size="small"
                    >
                      <DetailsIcon />
                    </IconButton>
                    <Popover
                      open={Boolean(anchorEl && selectedDevice && selectedDevice.id === device.id)}
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
                        className="device-detail-item"
                        startIcon={<EditIcon strokeWidth={2} sx={{ fontSize: '16px !important' }} />}
                      >
                        Editar
                      </Button>
                      <Button
                        onClick={handleToggleDeviceStatus}
                        color="black"
                        className="user-detail-item"
                        startIcon={device.disabled ? <EnableIcon sx={{ fontSize: '16px !important' }} /> : <DisableIcon sx={{ fontSize: '16px !important' }} />}
                      >
                        {device.disabled ? 'Habilitar' : 'Deshabilitar'}
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
                count={devicesData?.allDevices?.totalCount || 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handlePageChange}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      {openEditDeviceDialog &&
        <Dialog
          open={openEditDeviceDialog}
          onClose={handleCloseEditDeviceDialog}
          maxWidth="sm"
          fullWidth
        >
          <EditDeviceDialogContent
            selectedDevice={selectedDevice}
            handleCloseEditDeviceDialog={handleCloseEditDeviceDialog}
            editDevice={editDevice}
            editing={editing}
            handlePopoverClose={handlePopoverClose}
          />
        </Dialog>
      }
    </>
  );
};
