import React from "react";
import ModalStyles from "./modal.module.css";
import CloseIcon from '@mui/icons-material/Close';

// Displays the selected node's intrinsic properties
function Modal({ insideData, selectedNode, setIsOpen, setNode }) {
    const inputRefs = {};

    function getInsideDataFields() {
        function MakeItem(X) {
            return <option key={X}>{X}</option>;
        }
        const result = [];
        let input;
        // The type of the property will determine how it will show in the app
        insideData[selectedNode.type].forEach((property) => {
            const isVar = selectedNode.isVar;
            const { object, label } = property;
            // TODO if (!isVar) fill fields with actual values (query)
            let value = selectedNode[label] ? selectedNode[label] : "";
            if (object.includes('uri') || object.includes('link') || object.includes('url')) {
                input = <input className={ModalStyles.input} type="url" key={label} name={label} disabled={!isVar} defaultValue={value} ref={el => (inputRefs[label] = el)} />;
            } else if (object.includes('numeric') || object.includes('int') || object.includes('integer')) {
                input = <input className={ModalStyles.input} type="number" key={label} name={label} disabled={!isVar} defaultValue={value} ref={el => (inputRefs[label] = el)} />;
            } else if (Array.isArray(object) || (typeof object === 'string' && object.includes('array'))) {
                input = (
                    <select className={ModalStyles.input} key={label} name={label} disabled={!isVar} defaultValue={value} ref={el => (inputRefs[label] = el)}>
                        {object.map((X) => MakeItem(X))}
                    </select>
                );
            } else if (typeof object === 'string' && (object.includes('string') || object.includes('text') || object.includes('label'))) {
                input = <input className={ModalStyles.input} type="text" key={label} name={label} disabled={!isVar} defaultValue={value} ref={el => (inputRefs[label] = el)} />;
            } else if (typeof object === 'string' && object.includes('boolean')) {
                input = (
                    <div>
                        <input className={ModalStyles.input} type="radio" key={label} name={label} value="true" disabled={!isVar} defaultChecked={value} ref={el => (inputRefs[label] = el)} /> True
                        <input className={ModalStyles.input} type="radio" key={label} name={label} value="false" disabled={!isVar} defaultChecked={!value} ref={el => (inputRefs[label] = el)} /> False
                    </div>
                );
            } else {
                input = <input className={ModalStyles.input} type="text" key={label} name={label} disabled={!isVar} defaultValue={value} ref={el => (inputRefs[label] = el)} />;
            }
            result.push(
                <div className={ModalStyles.fieldContainer}>
                    <label className={ModalStyles.labelProperty} htmlFor={label}>'{label.toUpperCase()}'</label>
                    {input}
                    <label className={ModalStyles.labelCheckbox} htmlFor={label + "_queriesShow"}>Show in results:</label>
                    <input className={ModalStyles.checkbox} type="checkbox" name={label + "_queriesShow"} disabled={!isVar} style={{ display: 'inline-block' }} defaultChecked={selectedNode[label + "_queriesShow"]} ref={el => (inputRefs[label + "_queriesShow"] = el)} />
                    <label className={ModalStyles.labelCheckbox} htmlFor={label + "_queriesRecursive"}>Make recursive:</label>
                    <input className={ModalStyles.checkbox} type="checkbox" name={label + "_queriesRecursive"} disabled={!isVar} style={{ display: 'inline-block' }} defaultChecked={selectedNode[label + "_queriesRecursive"]} ref={el => (inputRefs[label + "_queriesRecursive"] = el)} />
                </div>
            );
        });

        return (<div className={ModalStyles.modalContent}>
            {result}
        </div>);
    }

    // Checks each field and updates the value in the current selected node
    function handleSubmit() {
        const updatedNode = { ...selectedNode };
        insideData[selectedNode.type].forEach((property) => {
            const { label } = property;
            const inputElement = inputRefs[label];
            if (inputElement) {
                updatedNode[label] = inputElement.value;
                updatedNode[label + "_queriesShow"] = inputRefs[label + "_queriesShow"].checked;
                updatedNode[label + "_queriesRecursive"] = inputRefs[label + "_queriesRecursive"].checked;
            }
        });
        setNode(updatedNode);
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
                            <button
                                style={{
                                    background: selectedNode.color
                                }}
                                className={ModalStyles.setBtn}
                                onClick={() => {
                                    handleSubmit();
                                    setIsOpen(false);
                                }}
                            >
                                Set properties
                            </button>
                            <button className={ModalStyles.cancelBtn} onClick={() => setIsOpen(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </span>
    );
}

export default Modal;