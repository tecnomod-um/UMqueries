import React, { useState } from "react";
import ModalStyles from "./modal.module.css";
import CloseIcon from '@mui/icons-material/Close';

// Displays the selected node's intrinsic properties
function Modal({ insideData, selectedNode, setIsOpen, addNode }) {

    function getInsideDataFields() {
        function MakeItem(X) {
            return <option>{X}</option>;
        }
        const result = [];
        var input;

        insideData[selectedNode.type].forEach((property) => {
            const isVar = selectedNode.isVar === true;
            const { object, label } = property;

            if (object.includes('uri') || object.includes('link') || object.includes('url')) {
                input = <input type="url" name={label} disabled={!isVar} />;
            } else if (object.includes('numeric') || object.includes('int') || object.includes('integer')) {
                input = <input type="number" name={label} disabled={!isVar} />;
            } else if (Array.isArray(object) || (typeof object === 'string' && object.includes('array'))) {
                input = (
                    <select name={label} disabled={!isVar}>
                        {object.map((X) => MakeItem(X))}
                    </select>
                );
            } else if (typeof object === 'string' && (object.includes('string') || object.includes('text') || object.includes('label'))) {
                input = <input type="text" name={label} disabled={!isVar} />;
            } else if (typeof object === 'string' && object.includes('boolean')) {
                input = (
                    <div>
                        <input type="radio" name={label} value="true" disabled={!isVar} /> True
                        <input type="radio" name={label} value="false" disabled={!isVar} /> False
                    </div>
                );
            } else {
                input = <input type="text" name={label} disabled={!isVar} />;
            }

            result.push(
                <div className={ModalStyles.insideData}>
                    <label>
                        Field: '{label}'
                        {input}
                    </label>
                </div>
            );
        });
        return result;
    }

    return (
        <span>
            <div className={ModalStyles.darkBG} overflowY="auto" onClick={() => setIsOpen(false)} />
            <div className={ModalStyles.centered}>
                <div className={ModalStyles.modal}>
                    <div className={ModalStyles.modalHeader}>
                        <h2>Node '{selectedNode.label}' intrinsic properties</h2>
                    </div>
                    <button className={ModalStyles.closeBtn} onClick={() => setIsOpen(false)}>
                        <CloseIcon style={{ marginBottom: "-7px" }} />
                    </button>
                    <div className={ModalStyles.modalContent}>
                        {getInsideDataFields()}
                    </div>
                    <div className={ModalStyles.modalActions}>
                        <div className={ModalStyles.actionsContainer}>
                            <button style={{
                                background: selectedNode.color
                            }} className={ModalStyles.deleteBtn} onClick={() => { addNode(selectedNode); setIsOpen(false); }}>
                                Set properties
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