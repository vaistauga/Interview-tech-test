import { useAccountContext } from '@/contexts/AccountContext';
import { set } from 'lodash';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { useDeleteUser, useImportUsers, useUsers } from '../../hooks';
import { User } from '../../types/User';
import ImportUsersModal from './ImportUsersModal';

const TableContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  border-radius: 8px 8px 0 0;
  flex-shrink: 0;
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  .p-input-icon-left {
    position: relative;

    .pi-search {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: #6c757d;
      z-index: 1;
    }

    .p-inputtext {
      padding-left: 2.5rem;
      border-radius: 6px;
      border: 1px solid #ced4da;
      padding: 0.75rem 1rem 0.75rem 2.5rem;
      font-size: 0.95rem;
      width: 300px;

      &:focus {
        border-color: #e94f37;
        box-shadow: 0 0 0 0.2rem rgba(233, 79, 55, 0.25);
      }
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const DataTableWrapper = styled.div`
  flex: 1;
  overflow: hidden;

  .p-datatable {
    height: 100%;

    .p-datatable-wrapper {
      height: calc(100% - 60px); // Account for pagination
      overflow: auto;
    }

    .p-datatable-thead > tr > th {
      background: #495057;
      color: white;
      border-color: #495057;
      font-weight: 600;
      padding: 1rem;
      position: sticky;
      top: 0;
      z-index: 1;
    }

    .p-datatable-tbody > tr {
      &:nth-child(even) {
        background: #f8f9fa;
      }

      &:hover {
        background: #e9ecef;
      }

      td {
        padding: 1rem;
        border-bottom: 1px solid #dee2e6;
      }
    }

    .p-paginator {
      background: #f8f9fa;
      border-top: 1px solid #dee2e6;
      padding: 1rem;
      border-radius: 0 0 8px 8px;
    }
  }
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
`;

const ActionButton = styled(Button as any)`
  &.p-button {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    padding: 0;

    &.p-button-success {
      background-color: #e94f37;
      border-color: #e94f37;

      &:hover {
        background-color: #d63384;
        border-color: #d63384;
      }
    }

    &.p-button-danger {
      background-color: #dc3545;
      border-color: #dc3545;

      &:hover {
        background-color: #c82333;
        border-color: #bd2130;
      }
    }
  }
`;

const ErrorMessage = styled.div`
  padding: 2rem;
  text-align: center;
  color: #dc3545;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  margin: 1rem;
`;

export const UserDataTable: React.FC = () => {
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
  const [filters, setFilters] = useState({
    global: {
      value: null as string | null,
      matchMode: FilterMatchMode.CONTAINS,
    },
  });
  const [showUserImportModal, setShowUserImportModal] = useState(false);
  const [newRecords, setNewRecords] = useState(0);
  const [newUsers, setNewUsers] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useRef<Toast>(null);
  const { selectedAccount } = useAccountContext();

  // React Query hooks
  const {
    data: users = [],
    isLoading,
    error,
    refetch,
  } = useUsers(selectedAccount?.id ?? '');
  const deleteUserMutation = useDeleteUser();
  const importUsersMutation = useImportUsers();

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const _filters = { ...filters };
    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUserMutation.mutateAsync(userId);
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'User deleted successfully',
          life: 3000,
        });
      } catch (error) {
        console.error('Failed to delete user:', error);
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete user',
          life: 3000,
        });
      }
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    if (
      !allowedTypes.includes(file.type) &&
      !file.name.match(/\.(csv|xlsx|xls)$/i)
    ) {
      toast.current?.show({
        severity: 'error',
        summary: 'Invalid File Type',
        detail: 'Please select a CSV or Excel file (.csv, .xlsx, .xls)',
        life: 5000,
      });
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.current?.show({
        severity: 'error',
        summary: 'File Too Large',
        detail: 'File size must be less than 10MB',
        life: 5000,
      });
      return;
    }

    try {
      const result = await importUsersMutation.mutateAsync({
        accountId: selectedAccount?.id ?? '',
        file,
      });

      if (result.success) {
        toast.current?.show({
          severity: 'success',
          summary: 'Import Successful',
          detail: result.message,
          life: 5000,
        });
        setShowUserImportModal(true);
        setNewRecords(result.totalRecordsInFile);
        setNewUsers(result.totalNewRecords);
      } else {
        toast.current?.show({
          severity: 'error',
          summary: 'Import Failed',
          detail: result.message || 'Failed to import users',
          life: 5000,
        });
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Import Error',
        detail: 'An error occurred while importing users',
        life: 5000,
      });
    } finally {
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const renderHeader = () => {
    return (
      <TableHeader>
        <SearchContainer>
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Search users..."
            />
          </span>
        </SearchContainer>
        <ButtonGroup>
          <Button
            icon="pi pi-download"
            label="Excel Template"
            onClick={() => window.open('/users-import-template.xlsx', '_blank')}
            className="p-button-outlined p-button-secondary"
            tooltip="Download Excel template"
            tooltipOptions={{ position: 'top' }}
          />
          <Button
            icon="pi pi-upload"
            label="Import"
            onClick={handleImportClick}
            loading={importUsersMutation.isLoading}
            className="p-button-outlined p-button-secondary"
            disabled={importUsersMutation.isLoading}
            tooltip="Import users from CSV or Excel file"
            tooltipOptions={{ position: 'top' }}
          />
        </ButtonGroup>
        <HiddenFileInput
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
          onChange={handleFileSelect}
        />
      </TableHeader>
    );
  };

  const nameBodyTemplate = (rowData: User) => {
    return `${rowData.firstName} ${rowData.lastName}`;
  };

  const groupsBodyTemplate = (rowData: User) => {
    return rowData?.groups?.map((group) => group.name).join(', ') || '';
  };

  const activeBodyTemplate = (rowData: User) => {
    return rowData.isActive ? (
      <span className="p-tag p-tag-success">Active</span>
    ) : (
      <span className="p-tag p-tag-danger">Inactive</span>
    );
  };

  const actionBodyTemplate = (rowData: User) => {
    return (
      <ActionButtonsContainer>
        <ActionButton
          icon="pi pi-pencil"
          className="p-button-success p-button-rounded"
          onClick={() => console.log('Edit user:', rowData.id)}
          tooltip="Edit User"
          tooltipOptions={{ position: 'top' }}
        />
        <ActionButton
          icon="pi pi-trash"
          className="p-button-danger p-button-rounded"
          onClick={() => handleDeleteUser(rowData.id)}
          tooltip="Delete User"
          tooltipOptions={{ position: 'top' }}
          loading={deleteUserMutation.isLoading}
        />
      </ActionButtonsContainer>
    );
  };

  if (error) {
    return (
      <TableContainer>
        <Toast ref={toast} />
        <ErrorMessage>
          <h3>Error loading users</h3>
          <p>
            {error instanceof Error
              ? error.message
              : 'An unexpected error occurred'}
          </p>
          <Button
            label="Retry"
            onClick={() => refetch()}
            className="p-button-outlined"
          />
        </ErrorMessage>
      </TableContainer>
    );
  }

  const header = renderHeader();

  return (
    <TableContainer>
      <ImportUsersModal
        visible={showUserImportModal}
        onClose={() => setShowUserImportModal(false)}
        newRecords={newRecords}
        newUsers={newUsers}
      />
      <Toast ref={toast} />
      {header}
      <DataTableWrapper>
        <DataTable
          value={users}
          loading={isLoading}
          filters={filters}
          globalFilterFields={[
            'firstName',
            'lastName',
            'email',
            'phoneNumber',
            'company.name',
            'address.city',
          ]}
          emptyMessage="No users found."
          paginator
          rows={15}
          rowsPerPageOptions={[10, 15, 25, 50]}
          tableStyle={{ minWidth: '50rem' }}
          className="p-datatable-gridlines"
          scrollable
          scrollHeight="flex"
        >
          <Column
            body={nameBodyTemplate}
            header="Name"
            sortable
            sortField="firstName"
            style={{ minWidth: '12rem' }}
          />
          <Column
            field="username"
            header="Username"
            sortable
            style={{ minWidth: '16rem' }}
          />
          <Column
            field="email"
            header="Email"
            sortable
            style={{ minWidth: '16rem' }}
          />
          <Column
            field="branch.name"
            header="Branch"
            sortable
            style={{ minWidth: '16rem' }}
          />
          <Column
            body={groupsBodyTemplate}
            header="Groups"
            sortable
            style={{ minWidth: '16rem', textAlign: 'center' }}
          />
          <Column
            field="updatedAt"
            header="Updated"
            sortable
            style={{ minWidth: '14rem' }}
          />
          <Column
            field="isActive"
            header="Active"
            sortable
            style={{ minWidth: '12rem' }}
            body={activeBodyTemplate}
          />
          <Column
            field="role.name"
            header="Role"
            sortable
            style={{ minWidth: '14rem' }}
          />
          <Column
            field="meta.managerEmail"
            header="Manager's Email"
            sortable
            style={{ minWidth: '10rem' }}
          />
          <Column
            body={actionBodyTemplate}
            header="Actions"
            exportable={false}
            style={{ minWidth: '8rem', textAlign: 'center' }}
          />
        </DataTable>
      </DataTableWrapper>
    </TableContainer>
  );
};
