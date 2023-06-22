import React, { useEffect, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import ModalStyles from "./modal.module.css";
import CloseIcon from "@mui/icons-material/Close";
import { getCategory } from "../../utils/typeChecker.js";

// Used to define a node's data properties
function Modal({ insideData, selectedNode, isOpen, setIsOpen, setNode }) {
    const modalRef = useRef(null);

    useEffect(() => {
        const handleKeyUp = (event) => {
            if (event.keyCode === 27 && isOpen) {
                setIsOpen(false);
            }
        };
        window.addEventListener("keyup", handleKeyUp);
        return () => {
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [isOpen, setIsOpen]);

    const inputRefs = {};

    function getInsideDataFields() {
        const MakeItem = (X) => <option key={X}>{X}</option>;
        const result = [];
        let input;
        // The type of the property will determine how it will show in the app
        insideData[selectedNode.type]?.forEach((property) => {
            const isVar = selectedNode.varID >= 0 ? true : false;
            const { object, label } = property;
            // TODO if (!isVar) fill fields with actual values (query)
            let value = '';
            let { checkShow, checkTransitive } = false;
            if (selectedNode.properties && selectedNode.properties[label]) {
                value = selectedNode.properties[label].data;
                checkShow = selectedNode.properties[label].show;
                checkTransitive = selectedNode.properties[label].transitive;
            }
            switch (getCategory(object)) {
                case 'link':
                    input = <input className={ModalStyles.input} type="url" key={`${selectedNode.label}-${label}`} id={label} name={label} disabled={!isVar} defaultValue={value} ref={el => (inputRefs[label] = el)} />;
                    break;
                case 'number':
                    input = <input className={ModalStyles.input} type="number" key={`${selectedNode.label}-${label}`} id={label} name={label} disabled={!isVar} defaultValue={value} ref={el => (inputRefs[label] = el)} />;
                    break;
                case 'select':
                    input = (
                        <select className={ModalStyles.input} key={`${selectedNode.label}-${label}`} id={label} name={label} disabled={!isVar} defaultValue={value} ref={el => (inputRefs[label] = el)}>
                            {object.map((X) => MakeItem(X))}
                        </select>
                    );
                    break;
                case 'boolean':
                    input = (
                        <div>
                            <input className={ModalStyles.input} type="radio" key={`${selectedNode.label}-${label}-true`} id={label} name={label} value="true" disabled={!isVar} defaultChecked={value} ref={el => (inputRefs[label] = el)} /> True
                            <input className={ModalStyles.input} type="radio" key={`${selectedNode.label}-${label}-false`} id={label} name={label} value="false" disabled={!isVar} defaultChecked={!value} ref={el => (inputRefs[label] = el)} /> False
                        </div>
                    );
                    break;
                case 'text':
                default:
                    input = <input className={ModalStyles.input} type="text" key={`${selectedNode.label}-${label}`} id={label} name={label} disabled={!isVar} defaultValue={value} ref={el => (inputRefs[label] = el)} />;
                    break;
            }
            result.push(
                <div className={ModalStyles.fieldContainer} key={`${selectedNode.label}-${label}-checkbox`}>
                    <label className={ModalStyles.labelProperty} htmlFor={label}>'{label.toUpperCase()}'</label>
                    {input}
                    <label className={ModalStyles.labelCheckbox} htmlFor={label + "_queriesShow"}>Show in results:</label>
                    <input className={ModalStyles.checkbox} type="checkbox" id={label + "_queriesShow"} name={`${label}_queriesShow`} disabled={!isVar} style={{ display: 'inline-block' }} defaultChecked={checkShow} ref={el => (inputRefs[label + "_queriesShow"] = el)} />
                    <label className={ModalStyles.labelCheckbox} htmlFor={label + "_queriesTransitive"}>Make transitive:</label>
                    <input className={ModalStyles.checkbox} type="checkbox" id={label + "_queriesTransitive"} name={`${label}_queriesTransitive`} disabled={!isVar} style={{ display: 'inline-block' }} defaultChecked={checkTransitive} ref={el => (inputRefs[label + "_queriesTransitive"] = el)} />
                </div>
            );
        });

        return (<div className={ModalStyles.modalContent}>
            {result}
        </div>);
    }

    const handleClose = () => {
        setIsOpen(false);
    };

    if (!selectedNode || !selectedNode.label) {
        return null;
    }
    // Checks each field and updates the value in the current selected node
    const handleSubmit = () => {
        const updatedNode = { ...selectedNode };
        updatedNode.properties = {};

        insideData[selectedNode.type]?.forEach((property) => {
            const { label } = property;
            const inputElement = inputRefs[label];
            if (inputElement) {
                updatedNode.properties[label] = {
                    uri: property.property,
                    data: inputElement.value,
                    show: inputRefs[label + '_queriesShow'].checked,
                    transitive: inputRefs[label + '_queriesTransitive'].checked,
                };
            }
        });
        setNode(updatedNode);
        setIsOpen(false);
    }

    return (
        <CSSTransition
            in={isOpen}
            timeout={150}
            classNames={{
                enter: ModalStyles.fadeEnter,
                enterActive: ModalStyles.fadeEnterActive,
                exit: ModalStyles.fadeExit,
                exitActive: ModalStyles.fadeExitActive,
            }}
            nodeRef={modalRef}
            unmountOnExit
        >
            <div className={ModalStyles.darkBG} onClick={handleClose}>
                <div
                    className={ModalStyles.centered}
                    ref={modalRef}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className={ModalStyles.modal}>
                        <div className={ModalStyles.modalHeader}>
                            <h2>{insideData[selectedNode.type]? `Node '${selectedNode.label}' data properties` : `${selectedNode.label} has no data properties`}</h2>
                        </div>
                        <button className={ModalStyles.closeBtn} onClick={handleClose}>
                            <CloseIcon style={{ marginBottom: "-7px" }} />
                        </button>
                        {getInsideDataFields()}
                        <div className={ModalStyles.modalActions}>
                            <div className={ModalStyles.actionsContainer}>
                                <button
                                    style={{ background: selectedNode.color, }}
                                    className={ModalStyles.setBtn}
                                    onClick={handleSubmit}
                                >
                                    Set properties
                                </button>
                                <button className={ModalStyles.cancelBtn} onClick={handleClose}>
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

export default Modal;
