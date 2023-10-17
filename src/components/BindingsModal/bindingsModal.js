import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { CSSTransition } from "react-transition-group";
import BindingModalStyles from "./bindingsModal.module.css";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from '@mui/icons-material/RemoveCircleOutline';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Modal used in binding definitions
function BindingsModal({ nodes, isBindingsOpen, setBindingsOpen }) {
    const modalRef = useRef(null);
    const [bindings, setBindings] = useState([]);
    const [operator, setOperator] = useState('+');
    const [firstBuilderValue, setFirstBuilderValue] = useState("");
    const [secondBuilderValue, setSecondBuilderValue] = useState("");
    const [tempBindings, setTempBindings] = useState([]);
    const [bindingName, setBindingName] = useState("");
    const [showInResults, setShowInResults] = useState(false);
    const [showBindingBuilder, setShowBindingBuilder] = useState(bindings.length === 0);
    const operatorList = useMemo(() => (['+', '-', '*', '/']), []);

    const getNumericProperties = useCallback(() => {
        const nodeNumericValues = (nodes ?? []).flatMap(node => {
            return Object.entries(node.properties)
                .filter(([key, property]) => property.type === "number")
                .map(([key, property]) => ({
                    label: `${node.label}'s ${key}`,
                    isFromNode: true,
                    nodeId: node.id,
                    propertyUri: property.uri,
                    value: JSON.stringify({
                        label: `${node.label}'s ${key}`,
                        isFromNode: true,
                        nodeId: node.id,
                        propertyUri: property.uri
                    })
                }));
        });

        const combinedBindingsValues = bindings.concat(tempBindings).map(binding => ({
            label: binding.label,
            isFromNode: false,
            bindingId: binding.id,
            value: JSON.stringify({
                label: binding.label,
                isFromNode: false,
                bindingId: binding.id
            })
        }));

        return [...nodeNumericValues, ...combinedBindingsValues];
    }, [nodes, bindings, tempBindings]);

    const setDefaultValuesToFirstOption = useCallback((setSelectedValue) => {
        const numericProperties = getNumericProperties(nodes, tempBindings);
        setSelectedValue(numericProperties[0]);
    }, [nodes, tempBindings, getNumericProperties]);

    useEffect(() => {
        if (!isBindingsOpen) setShowBindingBuilder(bindings.length === 0);
    }, [isBindingsOpen, bindings]);

    useEffect(() => {
        if (!firstBuilderValue) setDefaultValuesToFirstOption(setFirstBuilderValue);
        if (!secondBuilderValue) setDefaultValuesToFirstOption(setSecondBuilderValue);
    }, [firstBuilderValue, secondBuilderValue, setDefaultValuesToFirstOption]);

    const handleClose = () => {
        setTempBindings([]);
        setBindingsOpen(false);
    }

    const toggleBindingBuilderVisibility = () => {
        setShowBindingBuilder(!showBindingBuilder);
    }

    const makeItem = (element) => {
        return <option key={element.label} value={element.value}>{element.label}</option>;
    }

    const handleOptionChange = (event, element) => {
        const value = JSON.parse(event.target.options[event.target.selectedIndex].value);
        switch (element) {
            case 1:
                setFirstBuilderValue(value);
                break;
            case 2:
                setSecondBuilderValue(value);
                break;
            default:
                break;
        }
    }

    const getNewOperator = (currentOperator) =>
        operatorList[(operatorList.indexOf(currentOperator) + 1) % operatorList.length];

    const getOperatorTooltip = (operator) => {
        switch (operator) {
            case '+':
                return 'plus';
            case '-':
                return 'minus';
            case '*':
                return 'multiplied by';
            case '/':
                return 'divided by';
            default:
                return '';
        }
    }

    const findNodeInfo = (value) => {
        if (!value.isFromNode) {
            const foundBinding = [...bindings, ...tempBindings].find(binding => binding.id === value.bindingId);
            return {
                isFromNode: false,
                label: foundBinding.label,
            };
        } else {
            const node = nodes.find(n => n.id === value.nodeId);
            return {
                isFromNode: true,
                nodeId: value.nodeId,
                property: value.propertyUri,
                label: `${node.label}'s ${value.propertyUri}`,
            };
        }
    }

    const addBinding = () => {
        if (!bindingName.trim()) {
            alert('Binding name cannot be empty.');
            return;
        }
        if (tempBindings.some(b => b.label === bindingName)) {
            alert('Binding with the same name already exists.');
            return;
        }

        const firstValueInfo = findNodeInfo(firstBuilderValue);
        const secondValueInfo = findNodeInfo(secondBuilderValue);

        if (!firstValueInfo || !secondValueInfo) {
            alert('Failed to create binding due to an internal error.');
            return;
        }
        const newBinding = {
            id: Date.now(),
            label: bindingName,
            operator: operator,
            firstValue: firstValueInfo,
            secondValue: secondValueInfo,
            showInResults: showInResults
        }

        setTempBindings(prev => [...prev, newBinding]);
    }

    const handleSubmit = () => {
        setBindings(tempBindings);
        handleClose();
    }

    const handleRemoveVariable = (index, source) => {
        const sourceList = source === 'bindings' ? bindings : tempBindings;
        const removedValue = JSON.stringify(sourceList[index]);
        if (removedValue === JSON.stringify(firstBuilderValue)) {
            console.log("removed");
            setDefaultValuesToFirstOption(setFirstBuilderValue);
        }
        if (removedValue === JSON.stringify(secondBuilderValue)) {
            console.log("removed");
            setDefaultValuesToFirstOption(setSecondBuilderValue);
        }
        const updatedVariables = [...sourceList];
        updatedVariables.splice(index, 1);
        if (source === 'bindings') {
            setBindings(updatedVariables);
        } else {
            setTempBindings(updatedVariables);
        }
    }

    function bindingBuilder() {
        const numericProperties = getNumericProperties(nodes, tempBindings);
        const optionSet = numericProperties.map((item) => makeItem(item));

        return (
            <div className={BindingModalStyles.bindingBuilder}>
                <div className={BindingModalStyles.fieldContainer}>
                    <label className={BindingModalStyles.labelVarname}>Variable</label>
                    <span className={BindingModalStyles.inputWrapper}>
                        <input
                            className={BindingModalStyles.input}
                            type="text"
                            value={bindingName}
                            onChange={e => setBindingName(e.target.value)} />
                    </span>
                    <label className={BindingModalStyles.labelEquals}>equals</label>
                    <select
                        className={BindingModalStyles.input}
                        value={JSON.stringify(firstBuilderValue)}
                        onChange={(e) => handleOptionChange(e, 1)}
                    >
                        {optionSet}
                    </select>
                    <button
                        title={getOperatorTooltip(operator)}
                        className={BindingModalStyles.operatorButton}
                        onClick={() => setOperator(getNewOperator(operator))}
                    >
                        {operator}
                    </button>
                    <select
                        className={BindingModalStyles.input}
                        value={JSON.stringify(secondBuilderValue)}
                        onChange={(e) => handleOptionChange(e, 2)}
                    >
                        {optionSet}
                    </select>
                    <label className={BindingModalStyles.labelCheckbox}>Show in results:</label>
                    <input
                        className={BindingModalStyles.checkbox}
                        type="checkbox"
                        style={{ display: 'inline-block' }}
                        checked={showInResults}
                        onChange={e => setShowInResults(e.target.checked)} />
                    <button className={BindingModalStyles.addButton} onClick={() => addBinding()}>Add binding</button>
                </div>
            </div>
        );
    }

    const renderBindings = () => {
        const allBindings = [
            ...bindings.map(item => ({ ...item, source: 'bindings' })),
            ...tempBindings.map(item => ({ ...item, source: 'tempBindings' }))
        ];

        return allBindings.map((binding, index) => (
            <div
                key={binding.id}
                className={BindingModalStyles.bindingRow}
                style={{ backgroundColor: binding.source === 'tempBindings' ? "#e9e9e9" : "white" }}>
                <div className={BindingModalStyles.bindingName}>{binding.label}</div>
                <div className={BindingModalStyles.bindingExpression}>
                    {binding.firstValue.label} {binding.operator} {binding.secondValue.label}
                </div>
                <input
                    className={BindingModalStyles.checkbox}
                    type="checkbox"
                    style={{ display: 'inline-block' }}
                    checked={binding.showInResults}
                    onChange={() => {
                        const sourceList = binding.source === 'bindings' ? bindings : tempBindings;
                        const updatedBindings = [...sourceList];
                        updatedBindings[index].showInResults = !updatedBindings[index].showInResults;
                        if (binding.source === 'bindings') {
                            setBindings(updatedBindings);
                        } else {
                            setTempBindings(updatedBindings);
                        }
                    }}
                />
                <button className={BindingModalStyles.bindingRemove} onClick={() => handleRemoveVariable(index, binding.source)}>
                    <DeleteIcon />
                </button>
            </div>
        ));
    }

    return (
        <CSSTransition
            in={isBindingsOpen}
            timeout={{ enter: 150, exit: 0 }}
            classNames={{
                enter: BindingModalStyles.fadeEnter,
                enterActive: BindingModalStyles.fadeEnterActive,
                exit: BindingModalStyles.fadeExit,
                exitActive: BindingModalStyles.fadeExitActive,
            }}
            nodeRef={modalRef}
            unmountOnExit
        >
            <div className={BindingModalStyles.darkBG} onClick={handleClose}>
                <div
                    className={BindingModalStyles.centered}
                    ref={modalRef}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className={BindingModalStyles.modal}>
                        <div className={BindingModalStyles.modalHeader}>
                            <h2 title={"Bindings and variables"}>Bindings and variables</h2>
                        </div>
                        <div className={`${BindingModalStyles.modalContent} ${showBindingBuilder ? BindingModalStyles.showBindingBuilder : ""}`}>
                            {renderBindings()}
                            {bindingBuilder()}
                        </div>
                        <button className={BindingModalStyles.closeBtn} onClick={handleClose}>
                            <CloseIcon style={{ color: 'white', marginBottom: "-7px" }} />
                        </button>
                        <div className={BindingModalStyles.modalActions}>
                            <div className={BindingModalStyles.actionsContainer}>
                                <button
                                    className={BindingModalStyles.setBtn}
                                    onClick={handleSubmit}>
                                    Set bindings
                                </button>
                                <button
                                    onClick={() => toggleBindingBuilderVisibility()}
                                    className={BindingModalStyles.toggleButton}
                                >
                                    <ExpandMoreIcon
                                        style={{ transform: showBindingBuilder ? 'rotate(180deg)' : 'rotate(0)' }}
                                    />
                                </button>
                                <button className={BindingModalStyles.cancelBtn} onClick={handleClose}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CSSTransition>
    )
}

export default BindingsModal;