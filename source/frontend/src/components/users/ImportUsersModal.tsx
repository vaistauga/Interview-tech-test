import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { usersClient } from '@/clients';
import { useImportUsers } from '@/hooks/users';

interface JobStatusResult {
  jobId: string;
  createdAt: string;
  progress: number;
  status: string;
  result: {
    totalUserRows: number;
    newUsers: number;
    fileId: string;
  };
  finishedAt: string;
}

interface Props {
  visible: boolean;
  jobId?: string;
  accountId: string;
  onClose: () => void;
}

const ImportUsersModal: React.FC<Props> = ({
  visible,
  jobId,
  accountId,
  onClose,
}) => {
  const [jobStatus, setJobStatus] = useState<JobStatusResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentJobIdRef = useRef<string | undefined>(undefined);
  const importUsers = useImportUsers();

  const handleImportUsers = async () => {
    if (!jobStatus?.result?.fileId) return;

    try {
      await importUsers.mutateAsync({
        accountId,
        fileId: jobStatus.result.fileId,
      });
      onClose();
    } catch (err) {
      console.error('Failed to import users:', err);
      setError('Failed to import users');
    }
  };

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const pollJobStatus = async (jobIdToPoll: string) => {
    try {
      const status = await usersClient.getJobStatus(jobIdToPoll);

      // Only update state if this is still the current job
      if (currentJobIdRef.current === jobIdToPoll) {
        setJobStatus(status);

        if (status.status === 'completed' || status.status === 'failed') {
          stopPolling();
        }
      }
    } catch (err) {
      console.error('Error fetching job status:', err);
      if (currentJobIdRef.current === jobIdToPoll) {
        setError('Failed to fetch job status');
        stopPolling();
      }
    }
  };

  const startPolling = (jobIdToStart: string) => {
    // Stop any existing polling first
    stopPolling();

    currentJobIdRef.current = jobIdToStart;
    setError(null);

    // Initial poll
    pollJobStatus(jobIdToStart);

    // Set up interval
    intervalRef.current = setInterval(() => {
      pollJobStatus(jobIdToStart);
    }, 1000);
  };

  useEffect(() => {
    if (!visible || !jobId) {
      stopPolling();
      setJobStatus(null);
      setError(null);
      currentJobIdRef.current = undefined;
      return;
    }

    // Only start polling if we have a new jobId or weren't already polling this job
    if (currentJobIdRef.current !== jobId) {
      startPolling(jobId);
    }

    return () => {
      stopPolling();
    };
  }, [visible, jobId]);

  if (!visible) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '8px',
          padding: '20px',
          maxWidth: '500px',
          width: '90%',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '15px',
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
          }}
        >
          ×
        </button>

        <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Import Status</h2>

        {error ? (
          <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>
        ) : jobStatus ? (
          <div>
            {jobStatus.result ? (
              <div
                style={{
                  marginTop: '20px',
                  padding: '20px',
                  background: '#f5f5f5',
                  borderRadius: '8px',
                  textAlign: 'center',
                }}
              >
                <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>
                  Import Results
                </h3>
                <div style={{ fontSize: '18px', marginBottom: '15px' }}>
                  <strong>Total Rows:</strong> {jobStatus.result.totalUserRows}
                </div>
                <div style={{ fontSize: '18px', color: '#4caf50' }}>
                  <strong>New Users:</strong> {jobStatus.result.newUsers}
                </div>
                <button
                  onClick={handleImportUsers}
                  disabled={importUsers.isLoading}
                  style={{
                    marginTop: '20px',
                    padding: '12px 24px',
                    backgroundColor: '#4caf50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: importUsers.isLoading ? 'not-allowed' : 'pointer',
                    opacity: importUsers.isLoading ? 0.6 : 1,
                    transition: 'all 0.2s ease',
                  }}
                >
                  {importUsers.isLoading ? 'Importing...' : 'Import Users'}
                </button>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ fontSize: '16px', color: '#666' }}>
                  Processing import...
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>Loading job status...</div>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default ImportUsersModal;
