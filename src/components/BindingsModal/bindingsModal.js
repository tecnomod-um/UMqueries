import React, { useState, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import DataModalStyles from "./bindingsModal.module.css";
import CloseIcon from "@mui/icons-material/Close";

function BindingsModal({ nodes = [], isBindingsOpen, setBindingsOpen }) {
    const [computedVariables, setComputedVariables] = useState({});
    const modalRef = useRef(null);

    const handleAddVariable = (varName, expression) => {
        setComputedVariables({
            ...computedVariables,
            [varName]: expression
        });
    };

    const handleClose = () => {
        setBindingsOpen(false);
    };

    const handleSubmit = () => {
        console.log(computedVariables);
        setBindingsOpen(false);
    }

    const getNumericProperties = () => {
        let numericValues = [];
        nodes.forEach(node => {
            if (node.properties) {
                Object.values(node.properties).forEach(property => {
                    if (property.type === "number" && property.data) {
                        numericValues.push(property.data);
                    }
                });
            }
        });
        return numericValues;
    }

    const numericData = getNumericProperties();

    return (
        <CSSTransition
            in={isBindingsOpen}
            timeout={{ enter: 150, exit: 0 }}
            classNames={{
                enter: DataModalStyles.fadeEnter,
                enterActive: DataModalStyles.fadeEnterActive,
                exit: DataModalStyles.fadeExit,
                exitActive: DataModalStyles.fadeExitActive,
            }}
            nodeRef={modalRef}
            unmountOnExit
        >
            <div className={DataModalStyles.darkBG} onClick={handleClose}>
                <div
                    className={DataModalStyles.centered}
                    ref={modalRef}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className={DataModalStyles.modal}>
                        <div className={DataModalStyles.modalHeader}>
                            <h2>Numeric Variables</h2>
                        </div>
                        <button className={DataModalStyles.closeBtn} onClick={handleClose}>
                            <CloseIcon style={{ marginBottom: "-7px" }} />
                        </button>
                        <div className={DataModalStyles.modalContent}>
                            {numericData.map((numericValue, index) => (
                                <div key={index}>
                                    {numericValue}
                                </div>
                            ))}
                            {/* Additional components for user to define new variables based on results */}
                        </div>
                        <div className={DataModalStyles.modalActions}>
                            <div className={DataModalStyles.actionsContainer}>
                                <button
                                    className={DataModalStyles.setBtn}
                                    onClick={handleSubmit}
                                >
                                    Define Variables
                                </button>
                                <button className={DataModalStyles.cancelBtn} onClick={handleClose}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CSSTransition>
    );
}

export default BindingsModal;
