import React from 'react';
import ModalStyles from "./modal.module.css";
import CloseIcon from '@mui/icons-material/Close';

function Modal({ insideData, selectedNode, setIsOpen }) {
    return (
        <span>
            <div className={ModalStyles.darkBG} onClick={() => setIsOpen(false)} />
            <div className={ModalStyles.centered}>
                <div className={ModalStyles.modal}>
                    <div className={ModalStyles.modalHeader}>
                        <h5 className={ModalStyles.heading}>Node '{selectedNode.label}' intrinsic properties</h5>
                    </div>
                    <button className={ModalStyles.closeBtn} onClick={() => setIsOpen(false)}>
                        <CloseIcon style={{ marginBottom: "-7px" }} />
                    </button>
                    <div className={ModalStyles.modalContent}>
                        (Node data and fields will go here)
                    </div>
                    <div className={ModalStyles.modalActions}>
                        <div className={ModalStyles.actionsContainer}>
                            <button className={ModalStyles.deleteBtn} onClick={() => setIsOpen(false)}>
                                Done
                            </button>
                            <button
                                className={ModalStyles.cancelBtn}
                                onClick={() => setIsOpen(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </span>
    );
};

export default Modal;