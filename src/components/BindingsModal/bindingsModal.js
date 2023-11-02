import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { capitalizeFirst } from "../../utils/stringFormatter.js";
import { CSSTransition } from "react-transition-group";
import BindingModalStyles from "./bindingsModal.module.css";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from '@mui/icons-material/RemoveCircleOutline';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Modal used in binding definitions
function BindingsModal({ activeGraphId, graphs, bindings, isBindingsOpen, setBindingsOpen, setBindings }) {
    const modalRef = useRef(null);
    const [operator, setOperator] = useState('+');
    const [firstCustomValue, setFirstCustomValue] = useState(0);
    const [secondCustomValue, setSecondCustomValue] = useState(0);
    const [showFirstCustomInput, setFirstCustomInput] = useState(false);
    const [showSecondCustomInput, setSecondCustomInput] = useState(false);
    const [activeBindings, setActiveBindings] = useState([]);
    const [firstBuilderValue, setFirstBuilderValue] = useState("");
    const [secondBuilderValue, setSecondBuilderValue] = useState("");
    const [tempBindings, setTempBindings] = useState([]);
    const [bindingName, setBindingName] = useState("");
    const [showInResults, setShowInResults] = useState(false);
    const [error, showError] = useState(false);
    const [showBindingBuilder, setShowBindingBuilder] = useState(bindings.length === 0);
    const operatorList = useMemo(() => (['+', '-', '*', '/', '>', '<']), []);


    const activeGraph = graphs.find(graph => graph.id === activeGraphId);
    const activeGraphIndex = graphs.findIndex(graph => graph.id === activeGraphId);
    const nodes = activeGraph.nodes;
    
    // Gets all elements that could be useful for a binding definition, including other bindings
    const getNumericProperties = useCallback(() => {
        const nodeNumericValues = (nodes ?? []).flatMap(node => {
            return Object.entries(node.properties)
                .filter(([key, property]) => property.type === "number")
                .map(([key, property]) => ({
                    label: capitalizeFirst(`${key} ${node.label}`),
                    isFromNode: true,
                    nodeId: node.id,
                    propertyUri: property.uri,
                    value: JSON.stringify({
                        label: capitalizeFirst(`${key} ${node.label}`),
                        isFromNode: true,
                        nodeId: node.id,
                        propertyUri: property.uri
                    })
                }));
        });
        const combinedBindingsValues = [...bindings, ...tempBindings].filter(binding => !usesRestrictedOperator(binding))
            .map(binding => ({
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

    // Resets select values
    const setDefaultValuesToFirstOption = useCallback((setSelectedValue) => {
        const numericProperties = getNumericProperties(nodes, tempBindings);
        setSelectedValue(numericProperties[0]);
    }, [nodes, tempBindings, getNumericProperties]);

    // Recursively removes a binding tree
    const removeBindingAndDependencies = useCallback((bindingId, bindingArray, tempBindingArray) => {
        if (firstBuilderValue && firstBuilderValue.bindingId === bindingId)
            setDefaultValuesToFirstOption(setFirstBuilderValue);
        if (secondBuilderValue && secondBuilderValue.bindingId === bindingId)
            setDefaultValuesToFirstOption(setSecondBuilderValue);
        let updatedBindings = bindingArray.filter(b => b.id !== bindingId);
        let updatedTempBindings = tempBindingArray.filter(b => b.id !== bindingId);
        const dependentBindings = [...updatedBindings, ...updatedTempBindings].filter(binding =>
            binding.firstValue.bindingId === bindingId || binding.secondValue.bindingId === bindingId);
        for (const dependentBinding of dependentBindings)
            [updatedBindings, updatedTempBindings] = removeBindingAndDependencies(dependentBinding.id, updatedBindings, updatedTempBindings);
        return [updatedBindings, updatedTempBindings];
    }, [firstBuilderValue, secondBuilderValue, setDefaultValuesToFirstOption]);

    // Remove and update bindings
    const handleRemoveVariable = useCallback((bindingId) => {
        const updatedActiveBindings = activeBindings.filter(bId => bId !== bindingId);
        setActiveBindings(updatedActiveBindings);

        setTimeout(() => {
            let [updatedBindings, updatedTempBindings] = removeBindingAndDependencies(bindingId, bindings, tempBindings);
            setBindings(updatedBindings);
            setTempBindings(updatedTempBindings);
        }, 500);
    }, [bindings, tempBindings, setBindings, setTempBindings, removeBindingAndDependencies, activeBindings]);

    // Updates bindings on node removal
    useEffect(() => {
        const bindingsToRemove = bindings.filter(binding =>
            (binding.firstValue.isFromNode && !nodes.some(node => node.id === binding.firstValue.nodeId)) ||
            (binding.secondValue.isFromNode && !nodes.some(node => node.id === binding.secondValue.nodeId))
        );
        bindingsToRemove.forEach(binding =>
            handleRemoveVariable(binding.id)
        );
    }, [nodes, bindings, handleRemoveVariable]);

    // Sets up the builder visibility
    useEffect(() => {
        if (!isBindingsOpen) setShowBindingBuilder(bindings.length === 0);
    }, [isBindingsOpen, bindings]);

    // Fading in effect
    useEffect(() => {
        const currentBindingIds = [...bindings, ...tempBindings].map(item => item.id);
        setActiveBindings(currentBindingIds);
    }, [bindings, tempBindings]);

    // Sets up the selects' default option so thats visually coherent
    useEffect(() => {
        if (!firstBuilderValue) setDefaultValuesToFirstOption(setFirstBuilderValue);
        if (!secondBuilderValue) setDefaultValuesToFirstOption(setSecondBuilderValue);
    }, [firstBuilderValue, secondBuilderValue, setDefaultValuesToFirstOption]);

    const makeItem = (element) => {
        return <option key={element.label} value={element.value}>{element.label}</option>;
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
            case '>':
                return 'greater than';
            case '<':
                return 'less than';
            default:
                return '';
        }
    }

    const usesRestrictedOperator = (binding) => {
        return ['>', '<'].includes(binding.operator);
    }

    // Creates the value's structure from the element it refers to
    const findValueInfo = (value) => {
        if (value.isFromNode) {
            return {
                isFromNode: true,
                isCustom: false,
                nodeId: value.nodeId,
                property: value.propertyUri,
                label: value.label,
            };
        }
        const foundBinding = [...bindings, ...tempBindings].find(binding => binding.id === value.bindingId);
        if (foundBinding) {
            return {
                isFromNode: false,
                isCustom: false,
                bindingId: foundBinding.id,
                label: foundBinding.label,
            };
        }
    }

    const addBinding = () => {
        showError(false);
        if ((!bindingName.trim()) || ([...bindings, ...tempBindings].some(b => b.label === bindingName))) {
            showError(true);
            return;
        }
        const firstValueInfo = showFirstCustomInput ? { isFromNode: false, isCustom: true, value: firstCustomValue, label: `Custom value (${firstCustomValue})` } : findValueInfo(firstBuilderValue);
        const secondValueInfo = showSecondCustomInput ? { isFromNode: false, isCustom: true, value: secondCustomValue, label: `Custom value (${secondCustomValue})` } : findValueInfo(secondBuilderValue);
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

    const isValueInTempBindings = (value) => {
        return tempBindings.some(binding => binding.id === (value?.bindingId || -1));
    }

    const handleClose = () => {
        if (isValueInTempBindings(firstBuilderValue))
            setDefaultValuesToFirstOption(setFirstBuilderValue);
        if (isValueInTempBindings(secondBuilderValue))
            setDefaultValuesToFirstOption(setSecondBuilderValue);
        setTempBindings([]);
        setBindingsOpen(false);
    }

    const handleSubmit = () => {
        setBindings([...bindings, ...tempBindings]);
        handleClose();
    }

    const handleOptionChange = (event, setValue, setCustomInput) => {
        const value = JSON.parse(event.target.options[event.target.selectedIndex].value);
        if (value.custom) {
            setCustomInput(true);
        } else {
            setCustomInput(false);
            setValue(value);
        }
    }

    const toggleBindingBuilderVisibility = () => {
        setShowBindingBuilder(!showBindingBuilder);
    }

    // Binding builder interface definition
    function bindingBuilder() {
        const numericProperties = getNumericProperties(nodes, tempBindings);
        const hasOptions = numericProperties && numericProperties.length > 0;
        const optionSet = hasOptions
            ? [
                ...numericProperties.map((item) => makeItem(item)),
                <option key="custom-value" value={JSON.stringify({ custom: true })}>
                    Custom value
                </option>
            ]
            : [<option key="no-options" value="">{`No options available`}</option>];
        let gridTemplate = "0.8fr 100px 0.5fr 150px 42px 150px 1fr 20px 1fr";
        if (showFirstCustomInput && showSecondCustomInput) {
            gridTemplate = "0.8fr 100px 0.5fr 105px 35px 42px 105px 35px 1fr 20px 1fr";
        } else if (showFirstCustomInput) {
            gridTemplate = "0.8fr 100px 0.5fr 105px 35px 42px 150px 1fr 20px 1fr";
        } else if (showSecondCustomInput) {
            gridTemplate = "0.8fr 100px 0.5fr 150px 42px 105px 35px 1fr 20px 1fr";
        }
        return (
            <div className={BindingModalStyles.bindingBuilder}>
                <div className={BindingModalStyles.fieldContainer} style={{ gridTemplateColumns: gridTemplate }}>
                    <label className={BindingModalStyles.labelVarname}>Variable</label>
                    <span className={BindingModalStyles.inputWrapper}>
                        <input
                            className={BindingModalStyles.input}
                            type="text"
                            value={bindingName}
                            disabled={!hasOptions}
                            onChange={e => setBindingName(e.target.value)} />
                        {error && <CloseIcon className={BindingModalStyles.errorIcon} />}
                    </span>
                    <label className={BindingModalStyles.labelEquals}>equals</label>
                    <select
                        className={BindingModalStyles.input}
                        value={showFirstCustomInput ? JSON.stringify({ custom: true }) : JSON.stringify(firstBuilderValue)}
                        onChange={(e) => handleOptionChange(e, setFirstBuilderValue, setFirstCustomInput)}
                        disabled={!hasOptions}>
                        {optionSet}
                    </select>
                    {showFirstCustomInput && (
                        <input
                            type="number"
                            value={firstCustomValue}
                            onChange={(e) => e.target.value ? setFirstCustomValue(parseInt(e.target.value, 10)) : setFirstCustomValue(0)}
                            className={BindingModalStyles.input}
                        />
                    )}
                    <button
                        title={getOperatorTooltip(operator)}
                        className={BindingModalStyles.operatorButton}
                        onClick={() => setOperator(getNewOperator(operator))}
                    >
                        {operator}
                    </button>
                    <select
                        className={BindingModalStyles.input}
                        value={showSecondCustomInput ? JSON.stringify({ custom: true }) : JSON.stringify(secondBuilderValue)}
                        onChange={(e) => handleOptionChange(e, setSecondBuilderValue, setSecondCustomInput)}
                        disabled={!hasOptions}
                    >
                        {optionSet}
                    </select>
                    {showSecondCustomInput && (
                        <input
                            type="number"
                            value={secondCustomValue}
                            onChange={(e) => e.target.value ? setSecondCustomValue(parseInt(e.target.value, 10)) : setSecondCustomValue(0)}
                            className={BindingModalStyles.input}
                        />
                    )}
                    <label className={BindingModalStyles.labelCheckbox}>Show in results:</label>
                    <input
                        className={BindingModalStyles.checkbox}
                        type="checkbox"
                        style={{ display: 'inline-block' }}
                        checked={showInResults}
                        disabled={!hasOptions}
                        onChange={e => setShowInResults(e.target.checked)} />
                    <button className={BindingModalStyles.addButton} onClick={() => addBinding()} disabled={!hasOptions}>Add binding</button>
                </div>
            </div>
        );
    }

    // Defined bindings interface definition
    const renderBindings = () => {
        const allBindings = [
            ...bindings.map(item => ({ ...item, source: 'bindings' })),
            ...tempBindings.map(item => ({ ...item, source: 'tempBindings' }))
        ];
        return allBindings.map((binding, index) => (
            <div
                key={binding.id}
                className={`${BindingModalStyles.bindingRow} ${activeBindings.includes(binding.id) ? BindingModalStyles.bindingRowActive : ''}`}
                style={{ backgroundColor: binding.source === 'tempBindings' ? "#e9e9e9" : "white" }}>
                <div className={BindingModalStyles.bindingName}>{binding.label}</div>
                <div className={BindingModalStyles.bindingExpression}>
                    {binding.firstValue.label} {binding.operator} {binding.secondValue.label}
                </div>
                <label className={BindingModalStyles.labelCheckbox}>Show in results:</label>
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
                    }} />
                <button className={BindingModalStyles.bindingRemove} onClick={() => handleRemoveVariable(binding.id, binding.source)}>
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
