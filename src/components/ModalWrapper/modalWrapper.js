import React, { useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import ModalWrapperStyles from "./modalWrapper.module.css";
import CloseIcon from "@mui/icons-material/Close";

const ModalWrapper = ({ isOpen, children, closeModal, maxWidth }) => {
    // Modal behavior
    const modalRef = useRef(null);
    const [mouseDownOnBackdrop, setMouseDownOnBackdrop] = useState(false);

    // Get focus on open
    useEffect(() => {
        if (isOpen) {
            modalRef.current?.focus();
        }
    }, [isOpen]);

    const handleBackdropMouseDown = () => {
        setMouseDownOnBackdrop(true);
    }

    const handleBackdropMouseUp = () => {
        if (mouseDownOnBackdrop)
            closeModal();
        setMouseDownOnBackdrop(false);
    }

    return (
        <CSSTransition
            in={isOpen}
            timeout={{ enter: 150, exit: 0 }}
            classNames={{
                enter: ModalWrapperStyles.fadeEnter,
                enterActive: ModalWrapperStyles.fadeEnterActive,
                exit: ModalWrapperStyles.fadeExit,
                exitActive: ModalWrapperStyles.fadeExitActive,
            }}
            nodeRef={modalRef}
            unmountOnExit
        >
            <div className={ModalWrapperStyles.darkBG} onMouseDown={handleBackdropMouseDown} onMouseUp={handleBackdropMouseUp} ref={modalRef}>
                <div
                    className={ModalWrapperStyles.centered}
                    ref={modalRef}
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onMouseUp={(e) => e.stopPropagation()}
                >
                    <div className={ModalWrapperStyles.modal} style={{ maxWidth: maxWidth }} >
                        {children}
                    </div>
                </div>
                <button className={ModalWrapperStyles.closeBtn} onClick={closeModal}>
                    <CloseIcon style={{ color: 'white', marginBottom: "-7px" }} />
                </button>
            </div>
        </CSSTransition>
    );
}

export default ModalWrapper;
