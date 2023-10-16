import React, { useEffect, useRef, useState, useMemo } from "react";
import { CSSTransition } from "react-transition-group";
import DataModalStyles from "./dataModal.module.css";
import CloseIcon from "@mui/icons-material/Close";
import { getCategory } from "../../utils/typeChecker.js";

// Used to define a node's data properties
function DataModal({ insideData, selectedNode, isDataOpen, setDataOpen, setNode }) {
    const [operators, setOperators] = useState({});
    const modalRef = useRef(null);
    const inputRefs = {};
    const operatorLists = useMemo(() => ({
        number: ['=', '>', '<', '<=', '>='],
        text: ['=', '⊆'],
    }), []);

    const getOperatorTooltip = (operator) => {
        switch (operator) {
            case '=':
                return 'is equal to value';
            case '>':
                return 'is greater than value';
            case '<':
                return 'is lesser than value';
            case '<=':
                return 'is lesser than or equal to value';
            case '>=':
                return 'is greater than or equal to value';
            case '⊆':
                return 'contains value';
            default:
                return '';
        }
    }

    const getNewOperator = (currentOperator, type) =>
        operatorLists[type][(operatorLists[type].indexOf(currentOperator) + 1) % operatorLists[type].length];

    const categorize = (type) => {
        if (['number', 'decimal', 'datetime'].includes(type)) return 'number';
        if (['link', 'text', 'uri'].includes(type)) return 'text';
        return null;
    };

    useEffect(() => {
        const initialOperators = {};
        if (selectedNode?.properties) {
            insideData[selectedNode.type]?.forEach((property) => {
                const { label } = property;
                const category = categorize(getCategory(property.type));
                if (category && selectedNode.properties[label]) {
                    initialOperators[label] =
                        selectedNode.properties[label].operator ?? operatorLists[category][0];
                }
            });
            setOperators(initialOperators);
        }
    }, [insideData, selectedNode, operatorLists]);

    useEffect(() => {
        const handleKeyUp = (event) => {
            if (event.keyCode === 27 && isDataOpen) {
                setDataOpen(false);
            }
        };
        window.addEventListener("keyup", handleKeyUp);
        return () => {
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [isDataOpen, setDataOpen]);

    function getInsideDataFields() {
        const MakeItem = (X) => <option key={X}>{X}</option>;
        const result = [];
        let input;
        // The type of the property will determine how it will show in the app
        insideData[selectedNode.type]?.forEach((property) => {
            const isVar = selectedNode.varID >= 0 ? true : false;
            const { type, label } = property;
            // TODO if (!isVar) fill fields with actual values (query)
            let value = '';
            let { checkShow, checkTransitive } = false;
            if (selectedNode.properties && selectedNode.properties[label]) {
                value = selectedNode.properties[label].data;
                checkShow = selectedNode.properties[label].show;
                checkTransitive = selectedNode.properties[label].transitive;
            }
            const operator = operators[label] || '=';
            switch (getCategory(type)) {
                case 'link':
                    input = (
                        <span className={DataModalStyles.inputWrapper}>
                            <input className={DataModalStyles.input} type="url" key={`${selectedNode.label}-${label}`} id={label} name={label} disabled={!isVar} defaultValue={value} ref={el => (inputRefs[label] = el)} />
                            <button title={getOperatorTooltip(operator)} className={DataModalStyles.operatorButton} onClick={() => setOperators({ ...operators, [label]: getNewOperator(operator, 'text') })}>{operator}</button>
                        </span>
                    );
                    break;
                case 'number':
                    input = (
                        <span className={DataModalStyles.inputWrapper}>
                            <input className={DataModalStyles.input} type="number" key={`${selectedNode.label}-${label}`} id={label} name={label} disabled={!isVar} defaultValue={value} ref={el => (inputRefs[label] = el)} />
                            <button title={getOperatorTooltip(operator)} className={DataModalStyles.operatorButton} onClick={() => setOperators({ ...operators, [label]: getNewOperator(operator, 'number') })}>{operator}</button>
                        </span>
                    );
                    break;
                case 'decimal':
                    input = (
                        <span className={DataModalStyles.inputWrapper}>
                            <input className={DataModalStyles.input} type="number" step="any" key={`${selectedNode.label}-${label}`} id={label} name={label} disabled={!isVar} defaultValue={value} ref={el => (inputRefs[label] = el)} />
                            <button title={getOperatorTooltip(operator)} className={DataModalStyles.operatorButton} onClick={() => setOperators({ ...operators, [label]: getNewOperator(operator, 'number') })}>{operator}</button>
                        </span>
                    );
                    break;
                case 'datetime':
                    input = (
                        <span className={DataModalStyles.inputWrapper}>
                            <input className={DataModalStyles.input} type="datetime-local" key={`${selectedNode.label}-${label}`} id={label} name={label} disabled={!isVar} defaultValue={value} ref={el => (inputRefs[label] = el)} />
                            <button title={getOperatorTooltip(operator)} className={DataModalStyles.operatorButton} onClick={() => setOperators({ ...operators, [label]: getNewOperator(operator, 'number') })}>{operator}</button>
                        </span>
                    );
                    break;
                case 'select':
                    input = (
                        <select className={DataModalStyles.input} key={`${selectedNode.label}-${label}`} id={label} name={label} disabled={!isVar} defaultValue={value} ref={el => (inputRefs[label] = el)}>
                            {type.map((X) => MakeItem(X))}
                        </select>
                    );
                    break;
                case 'boolean':
                    input = (
                        <div>
                            <input className={DataModalStyles.input} type="radio" key={`${selectedNode.label}-${label}-true`} id={label} name={label} value="true" disabled={!isVar} defaultChecked={value} ref={el => (inputRefs[label] = el)} /> True
                            <input className={DataModalStyles.input} type="radio" key={`${selectedNode.label}-${label}-false`} id={label} name={label} value="false" disabled={!isVar} defaultChecked={!value} ref={el => (inputRefs[label] = el)} /> False
                        </div>
                    );
                    break;
                case 'binary':
                    input = <input className={DataModalStyles.input} type="file" key={`${selectedNode.label}-${label}`} id={label} name={label} disabled={!isVar} defaultValue={value} ref={el => (inputRefs[label] = el)} />
                    break;
                case 'uri':
                    input = (
                        <span className={DataModalStyles.inputWrapper}>
                            <input className={DataModalStyles.input} type="url" key={`${selectedNode.label}-${label}`} id={label} name={label} disabled={!isVar} defaultValue={value} ref={el => (inputRefs[label] = el)} />
                            <button title={getOperatorTooltip(operator)} className={DataModalStyles.operatorButton} onClick={() => setOperators({ ...operators, [label]: getNewOperator(operator, 'text') })}>{operator}</button>
                        </span>
                    );
                    break;
                case 'text':
                default:
                    input = (
                        <span className={DataModalStyles.inputWrapper}>
                            <input className={DataModalStyles.input} type="text" key={`${selectedNode.label}-${label}`} id={label} name={label} disabled={!isVar} defaultValue={value} ref={el => (inputRefs[label] = el)} />
                            <button title={getOperatorTooltip(operator)} className={DataModalStyles.operatorButton} onClick={() => setOperators({ ...operators, [label]: getNewOperator(operator, 'text') })}>{operator}</button>
                        </span>
                    );
                    break;
            }
            result.push(
                <div className={DataModalStyles.fieldContainer} key={`${selectedNode.label}-${label}-row`}>
                    <label className={DataModalStyles.labelProperty} htmlFor={label}>{label}</label>
                    {input}
                    <label className={DataModalStyles.labelCheckbox} htmlFor={label + "_queriesShow"}>Show in results:</label>
                    <input className={DataModalStyles.checkbox} type="checkbox" id={label + "_queriesShow"} name={`${label}_queriesShow`} disabled={!isVar} style={{ display: 'inline-block' }} defaultChecked={checkShow} ref={el => (inputRefs[label + "_queriesShow"] = el)} />
                    <label className={DataModalStyles.labelCheckbox} htmlFor={label + "_queriesTransitive"}>Make transitive:</label>
                    <input className={DataModalStyles.checkbox} type="checkbox" id={label + "_queriesTransitive"} name={`${label}_queriesTransitive`} disabled={!isVar} style={{ display: 'inline-block' }} defaultChecked={checkTransitive} ref={el => (inputRefs[label + "_queriesTransitive"] = el)} />
                </div>
            );
        });

        return (<div className={DataModalStyles.modalContent}>
            {result}
        </div>);
    }

    const handleClose = () => {
        setDataOpen(false);
    }

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
                    type: getCategory(property.type),
                    transitive: inputRefs[label + '_queriesTransitive'].checked,
                };
            }
            if (operators[label]) {
                updatedNode.properties[label].operator = operators[label];
            }
        });
        setNode(updatedNode);
        setDataOpen(false);
    }

    return (
        <CSSTransition
            in={isDataOpen}
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
                        <div
                            className={DataModalStyles.modalHeader}
                            style={{ background: selectedNode.color }} // Set the background color
                        >
                            <h2
                                title={insideData[selectedNode.type] ? `Node '${selectedNode.label}' data properties` : `${selectedNode.label} has no data properties`}
                            >
                                {insideData[selectedNode.type] ? `Node '${selectedNode.label}' data properties` : `${selectedNode.label} has no data properties`}
                            </h2>
                        </div>
                        <button className={DataModalStyles.closeBtn} onClick={handleClose}>
                            <CloseIcon style={{ marginBottom: "-7px" }} />
                        </button>
                        {getInsideDataFields()}
                        <div className={DataModalStyles.modalActions}>
                            <div className={DataModalStyles.actionsContainer}>
                                <button
                                    style={{ background: selectedNode.color, }}
                                    className={DataModalStyles.setBtn}
                                    onClick={handleSubmit}
                                >
                                    Set properties
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

export default DataModal;
