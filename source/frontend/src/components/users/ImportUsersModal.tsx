import React from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

interface Props {
  visible: boolean;
  newUsers: number;
  newRecords: number;
  onClose: () => void;
}

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalBackground = styled.div`
  background: white;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
`;

const ImportUsersModal: React.FC<Props> = ({
  visible,
  onClose,
  newUsers,
  newRecords,
}) => {
  if (!visible) return null;

  return createPortal(
    <ModalContainer onClick={(e) => e.stopPropagation()}>
      <div onClick={onClose}>
        <ModalBackground>
          <button onClick={onClose}>X</button>
          <h1>Import Users</h1>
          New Users: {newUsers}
          New Records: {newRecords}
          <button onClick={onClose}>Import</button>
        </ModalBackground>
      </div>
    </ModalContainer>,
    document.body,
  );
};

export default ImportUsersModal;
