import React from "react";
import ModalStyles from "./modal.module.css";
import CloseIcon from '@mui/icons-material/Close';

// Displays the selected node's intrinsic properties
function Modal({ insideData, selectedNode, setIsOpen, addNode }) {

    function getInsideDataFields() {
        function MakeItem(X) {
            return <option key={X}>{X}</option>;
        }
        const result = [];
        let input;
        insideData[selectedNode.type].forEach((property) => {
            const isVar = selectedNode.isVar === true;
            const { object, label } = property;

            if (object.includes('uri') || object.includes('link') || object.includes('url')) {
                input = <input className={ModalStyles.input} type="url" key={label} name={label} disabled={!isVar} />;
            } else if (object.includes('numeric') || object.includes('int') || object.includes('integer')) {
                input = <input className={ModalStyles.input} type="number" key={label} name={label} disabled={!isVar} />;
            } else if (Array.isArray(object) || (typeof object === 'string' && object.includes('array'))) {
                input = (
                    <select className={ModalStyles.input} key={label} name={label} disabled={!isVar}>
                        {object.map((X) => MakeItem(X))}
                    </select>
                );
            } else if (typeof object === 'string' && (object.includes('string') || object.includes('text') || object.includes('label'))) {
                input = <input className={ModalStyles.input} type="text" key={label} name={label} disabled={!isVar} />;
            } else if (typeof object === 'string' && object.includes('boolean')) {
                input = (
                    <div>
                        <input className={ModalStyles.input} type="radio" key={label} name={label} value="true" disabled={!isVar} /> True
                        <input className={ModalStyles.input} type="radio" key={label} name={label} value="false" disabled={!isVar} /> False
                    </div>
                );
            } else {
                input = <input className={ModalStyles.input} type="text" key={label} name={label} disabled={!isVar} />;
            }
            result.push(
                <div className={ModalStyles.fieldContainer}>
                    <label className={ModalStyles.labelProperty} htmlFor={label}>'{label.toUpperCase()}'</label>
                    {input}
                    <label className={ModalStyles.labelCheckbox} htmlFor={label + "_queriesShow"}>Show in results:</label>
                    <input className={ModalStyles.checkbox} type="checkbox" id={label + "_queriesShow"} disabled={!isVar} className={ModalStyles.checkbox} style={{ display: 'inline-block' }} />
                    <label className={ModalStyles.labelCheckbox} htmlFor={label + "_queriesRecursive"}>Make recursive:</label>
                    <input className={ModalStyles.checkbox} type="checkbox" id={label + "_queriesRecursive"} disabled={!isVar} className={ModalStyles.checkbox} style={{ display: 'inline-block' }} />
                </div>
            );
        });

        return (<div className={ModalStyles.modalContent}>
            {result}
        </div>);
    }

    return (
        <span>
            <div className={ModalStyles.darkBG} onClick={() => setIsOpen(false)} />
            <div className={ModalStyles.centered}>
                <div className={ModalStyles.modal}>
                    <div className={ModalStyles.modalHeader}>
                        <h2>Node '{selectedNode.label}' intrinsic properties</h2>
                    </div>
                    <button className={ModalStyles.closeBtn} onClick={() => setIsOpen(false)}>
                        <CloseIcon style={{ marginBottom: "-7px" }} />
                    </button>
                    {getInsideDataFields()}
                    <div className={ModalStyles.modalActions}>
                        <div className={ModalStyles.actionsContainer}>
                            <button style={{
                                background: selectedNode.color
                            }} className={ModalStyles.setBtn} onClick={() => { addNode(selectedNode); setIsOpen(false); }}>
                                Set properties
                            </button>
                            <button className={ModalStyles.cancelBtn}
                                onClick={() => setIsOpen(false)}>
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