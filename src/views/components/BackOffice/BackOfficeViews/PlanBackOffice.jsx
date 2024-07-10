import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  IconButton,
  Popover,
  Button,
} from '@mui/material';
import { GET_ALL_PLANS } from '../../../../data/graphQL/queries/getAllPlans/getAllPlans';
import { DELETE_PLAN } from '../../../../data/graphQL/mutations/deletePlans/deletePlan';
import { EDIT_PLAN } from '../../../../data/graphQL/mutations/editPlan/editPlan';
import { DetailsIcon, TrashIcon, EditIcon, DisableIcon, EnableIcon } from '../../../../icons';
import EditPlansDialogContent from '../EditBackOffice/EditPlansDialogContent';
import ConfirmHardDeletePlanDialog from '../ConfirmHardDeleteDialog/confirmHardDeletePlanDialog';
import '../backOfficeComponents.scss';

export const PlanBackOffice = ({ setRefetch }) => {
  const [ page, setPage ] = useState(0);
  const rowsPerPage = 10;

  const { data: plansData, loading: plansLoading, refetch: refetchPlans } = useQuery(GET_ALL_PLANS, {
    variables: {
      skip: page * rowsPerPage,
      take: rowsPerPage,
    },
  });

  const [ deletePlanMutation ] = useMutation(DELETE_PLAN);
  const [ editPlanMutation, { loading: editLoading } ] = useMutation(EDIT_PLAN);

  const [ anchorEl, setAnchorEl ] = useState(null);
  const [ selectedPlan, setSelectedPlan ] = useState(null);
  const [ openEditPlanDialog, setOpenEditPlanDialog ] = useState(false);
  const [ formData, setFormData ] = useState({ name: '', maxAllowedUsers: 0 });

  const [ openDeletePlanConfirmation, setOpenDeletePlanConfirmation ] = useState(false);

  useEffect(() => {
    refetchPlans();
    setRefetch(refetchPlans);
  }, [ page, rowsPerPage, refetchPlans, setRefetch ]);

  const handlePopoverOpen = (plan, event) => {
    setAnchorEl(event.currentTarget);
    setSelectedPlan(plan);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setSelectedPlan(null);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleHardDeletePlan = async (plan) => {
    setSelectedPlan(plan);
    setOpenDeletePlanConfirmation(true);
  };

  const handleCloseDeletePlanConfirmation = () => {
    setOpenDeletePlanConfirmation(false);
    setSelectedPlan(null);
  };

  const handleDisablePlan = async (planId) => {
    await deletePlanMutation({ variables: { id: planId } });
    refetchPlans();
    handlePopoverClose();
  };

  const handleEditButtonClick = (plan) => {
    setSelectedPlan(plan);
    setFormData({ name: plan.name, maxAllowedUsers: plan.maxAllowedUsers });
    setOpenEditPlanDialog(true);
  };

  const handleCloseEditPlanDialog = () => {
    setOpenEditPlanDialog(false);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => { return { ...prev, [name]: value }; });
  };

  const handleEditPlanSubmit = async (event) => {
    event.preventDefault();
    await editPlanMutation({
      variables: {
        id: selectedPlan.id,
        name: formData.name,
        maxAllowedUsers: parseInt(formData.maxAllowedUsers, 10),
      },
    });
    refetchPlans();
    handleCloseEditPlanDialog();
  };

  if (plansLoading) {
    return (
      <div className="circular-progress">
        <CircularProgress />
      </div>
    );
  }

  const plans = plansData?.allPlans?.items || [];
  return (
    <>
      <TableContainer className="table-container" sx={{ height: '100vh' }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead className="table-head">
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Máximo de usuarios invitados</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plans.map((plan, index) => (
              <TableRow key={index} style={{ backgroundColor: plan.disabled ? '#f0f0f0' : 'transparent' }}>
                <TableCell>{plan.name}</TableCell>
                <TableCell>{plan.maxAllowedUsers}</TableCell>
                <TableCell>
                  <div>
                    <IconButton onClick={(event) => handlePopoverOpen(plan, event)} size="small">
                      <DetailsIcon />
                    </IconButton>

                    <Popover
                      open={Boolean(anchorEl && selectedPlan?.id === plan.id)}
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
                        paper: { className: 'detail-container' },
                      }}
                    >
                      <Button
                        onClick={() => handleEditButtonClick(plan)}
                        color="black"
                        className="user-detail-item"
                        startIcon={<EditIcon strokeWidth={2} sx={{ fontSize: '16px !important' }} />}
                      >
                        Editar
                      </Button>
                      <Button
                        onClick={() => handleHardDeletePlan(plan)}
                        color="black"
                        className="user-detail-item"
                        startIcon={<TrashIcon sx={{ fontSize: '16px !important' }} />}
                      >
                        Eliminar
                      </Button>
                      <Button
                        onClick={() => handleDisablePlan(plan.id)}
                        color="black"
                        className="user-detail-item"
                        startIcon={plan.disabled ? <EnableIcon sx={{ fontSize: '16px !important' }} /> : <DisableIcon sx={{ fontSize: '16px !important' }} />}
                      >
                        {plan.disabled ? 'Habilitar' : 'Deshabilitar'}
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
                count={plansData?.allPlans?.totalCount || 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handlePageChange}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      <EditPlansDialogContent
        open={openEditPlanDialog}
        handleClose={handleCloseEditPlanDialog}
        handleSubmit={handleEditPlanSubmit}
        formData={formData}
        handleFormChange={handleFormChange}
        loading={editLoading}
      />

      <ConfirmHardDeletePlanDialog
        openDeletePlanConfirmation={openDeletePlanConfirmation}
        handleCloseDeletePlanConfirmation={handleCloseDeletePlanConfirmation}
        selectedPlan={selectedPlan}
        refetchPlans={refetchPlans}
      />
    </>
  );
};
