import React from 'react';

export const ModalContext = React.createContext({
  open: false,
  setIsModalOpen: (isOpen: boolean) => {},
});

export const useModal = () => React.useContext(ModalContext);

export default ModalContext;
