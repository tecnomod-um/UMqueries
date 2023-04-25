import React, { useState } from "react";
import ModalStyles from "./modal.module.css";
import CloseIcon from '@mui/icons-material/Close';

function Modal({ insideData, selectedNode, setIsOpen, addNode }) {

    function isArray(what) {
        return Object.prototype.toString.call(what) === '[object Array]';
    }

    function getInsideDataFields() {

        function MakeItem(X) {
            return <option>{X}</option>;
        }
        var result = [];
        var input = {};

        insideData[selectedNode.type].forEach(property => {
            switch (property.object) {
                case 'uri':
                    input = (<input type="url" name={property.label} disabled={selectedNode.isVar === true ? false : true} />);
                    break;
                case 'string' || 'text':
                    input = (<input type="text" name={property.label} disabled={selectedNode.isVar === true ? false : true} />);
                    break;
                case 'numeric' || 'int' || 'integer':
                    input = (<input type="number" name={property.label} disabled={selectedNode.isVar === true ? false : true} />);
                    break;
                /*
            case isArray(property.object):
                input = <select name={property.label} disabled={selectedNode.isVar === true ? false : true}>{property.object.map(X => { return MakeItem(X) }}</select>;
                break;
                */
                default:
                    input = (<input type="text" name={property.label} disabled={selectedNode.isVar === true ? false : true} />);
                    break;
            }
            result.push(
                <div className={ModalStyles.insideData} >
                    <label>
                        Field: '{property.label}'
                        {input}
                    </label>

                </div>)
        })
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