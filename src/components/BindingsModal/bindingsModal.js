import React, { useState, useEffect, useCallback, useMemo } from "react";
import { capitalizeFirst } from "../../utils/stringFormatter.js";
import { getOperatorTooltip } from "../../utils/typeChecker.js";
import ModalWrapper from '../ModalWrapper/modalWrapper';
import BindingModalStyles from "./bindingsModal.module.css";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Modal used in binding definitions
function BindingsModal({ allNodes, bindings, isBindingsOpen, setBindingsOpen, setBindings }) {
    // Binding definitions
    const [tempBindings, setTempBindings] = useState([]);
    const [activeBindings, setActiveBindings] = useState([]);
    // Binding builder inputs
    const [operator, setOperator] = useState('+');
    const [firstCustomValue, setFirstCustomValue] = useState(0);
    const [secondCustomValue, setSecondCustomValue] = useState(0);
    const [firstBuilderValue, setFirstBuilderValue] = useState("");
    const [secondBuilderValue, setSecondBuilderValue] = useState("");
    const [bindingName, setBindingName] = useState("");
    const [isAbsolute, setIsAbsolute] = useState(false);
    const [showInResults, setShowInResults] = useState(false);
    // Modal element configurations
    const [error, showError] = useState(false);
    const [showBindingBuilder, setShowBindingBuilder] = useState(bindings.length === 0);
    const [showFirstCustomInput, setFirstCustomInput] = useState(false);
    const [showSecondCustomInput, setSecondCustomInput] = useState(false);
    const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

    const operatorLists = useMemo(() => (['+', '-', '*', '/', '>', '<', '>=', '<=']), []);

    // Gets all elements that could be useful for a binding definition, including other bindings
    const getNumericProperties = useCallback(() => {
        const nodeNumericValues = (allNodes ?? []).flatMap(node => {
            return Object.entries(node.properties)
                .filter(([key, property]) => property.type === "number")
                // Value is needed to reconstruct the option from select
                .map(([key, property]) => ({
                    label: capitalizeFirst(`${key} ${node.label}`),
                    key: key,
                    nodeLabel: node.label,
                    isVar: node.varID >= 0,
                    isFromNode: true,
                    nodeId: node.id,
                    propertyUri: property.uri,
                    value: JSON.stringify({
                        label: capitalizeFirst(`${key} ${node.label}`),
                        key: key,
                        nodeLabel: node.label,
                        isVar: node.varID > 0,
                        isFromNode: true,
                        nodeId: node.id,
                        propertyUri: property.uri,
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
    }, [allNodes, bindings, tempBindings]);

    // Resets select values
    const setDefaultValuesToFirstOption = useCallback((setSelectedValue) => {
        const numericProperties = getNumericProperties(allNodes, tempBindings);
        setSelectedValue(numericProperties[0]);
    }, [allNodes, tempBindings, getNumericProperties]);

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
        let [updatedBindings, updatedTempBindings] = removeBindingAndDependencies(bindingId, bindings, tempBindings);
        const updatedActiveBindings = [...updatedBindings, ...updatedTempBindings].map(b => b.id);
        setActiveBindings(updatedActiveBindings);
        setTimeout(() => {
            setBindings(updatedBindings);
            setTempBindings(updatedTempBindings);
        }, 500);
    }, [bindings, tempBindings, setBindings, removeBindingAndDependencies]);

    // Detects the viewport size for element configs
    useEffect(() => {
        const handleResize = () => {
            setViewportWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Updates bindings on node removal
    useEffect(() => {
        const bindingsToRemove = bindings.filter(binding =>
            (binding.firstValue.isFromNode && !allNodes.some(node => node.id === binding.firstValue.nodeId)) ||
            (binding.secondValue.isFromNode && !allNodes.some(node => node.id === binding.secondValue.nodeId))
        );
        bindingsToRemove.forEach(binding =>
            handleRemoveVariable(binding.id)
        );
    }, [allNodes, bindings, handleRemoveVariable]);

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

    const usesRestrictedOperator = (binding) => {
        return ['>', '<'].includes(binding.operator);
    }

    // Creates the value's structure from the element it refers to
    const findValueInfo = (value) => {
        if (value.isFromNode) {
            return {
                label: value.label,
                key: value.key,
                nodeLabel: value.nodeLabel,
                isVar: value.isVar,
                isFromNode: true,
                nodeId: value.nodeId,
                propertyUri: value.propertyUri,
            };
        }
        const foundBinding = [...bindings, ...tempBindings].find(binding => binding.id === value.bindingId);
        if (foundBinding) {
            return {
                label: foundBinding.label,
                isFromNode: false,
                isCustom: false,
                bindingId: foundBinding.id,
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
            showInResults: showInResults,
            isAbsolute: isAbsolute
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

    const handleOperatorChange = (e) => {
        setOperator(e.target.value);
    }

    const toggleBindingBuilderVisibility = () => {
        setShowBindingBuilder(!showBindingBuilder);
    }

    const getGridTemplate = (viewportWidth, showFirstCustomInput, showSecondCustomInput) => {
        const baseTemplate = viewportWidth <= 768 ? "100px 30px" : "0.8fr 100px 0.5fr";
        let middleTemplate = viewportWidth <= 768 ? "150px 42px 150px" : "150px 42px 150px 1fr";

        if (showFirstCustomInput && showSecondCustomInput)
            middleTemplate = viewportWidth <= 768 ? "120px 20px 42px 120px 20px" : "120px 20px 42px 120px 20px 1fr";
        else if (showFirstCustomInput)
            middleTemplate = viewportWidth <= 768 ? "120px 20px 42px 150px" : "120px 20px 42px 150px 1fr";
        else if (showSecondCustomInput)
            middleTemplate = viewportWidth <= 768 ? "150px 42px 120px 20px" : "150px 42px 120px 20px 1fr";
        const endTemplate = viewportWidth <= 768 ? "20px 20px 60px" : "20px 1fr 20px 1fr";

        return `${baseTemplate} ${middleTemplate} ${endTemplate}`;
    }

    // Binding builder interface definition
    function bindingBuilder() {
        const numericProperties = getNumericProperties(allNodes, tempBindings);
        const hasOptions = numericProperties && numericProperties.length > 0;
        const optionSet = hasOptions ? [
            ...numericProperties.map((item) => makeItem(item)),
            <option key="custom-value" value={JSON.stringify({ custom: true })}>
                Custom value
            </option>
        ] : [<option key="no-options" value="">{`No options available`}</option>];

        return (
            <div className={BindingModalStyles.bindingBuilder}>
                <div className={BindingModalStyles.fieldContainer} style={{ gridTemplateColumns: getGridTemplate(viewportWidth, showFirstCustomInput, showSecondCustomInput) }}>
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
                    <label className={BindingModalStyles.labelEquals}>{viewportWidth <= 768 ? "=" : "equals"}</label>
                    {showFirstCustomInput && (
                        <input
                            type="number"
                            value={firstCustomValue}
                            onChange={(e) => e.target.value ? setFirstCustomValue(parseInt(e.target.value, 10)) : setFirstCustomValue(0)}
                            className={BindingModalStyles.input}
                        />
                    )}
                    <select
                        className={BindingModalStyles.input}
                        value={showFirstCustomInput ? JSON.stringify({ custom: true }) : JSON.stringify(firstBuilderValue)}
                        onChange={(e) => handleOptionChange(e, setFirstBuilderValue, setFirstCustomInput)}
                        disabled={!hasOptions}>
                        {optionSet}
                    </select>
                    <select
                        title={getOperatorTooltip(operator)}
                        className={BindingModalStyles.operatorSelector}
                        value={operator}
                        onChange={handleOperatorChange}
                        disabled={!hasOptions}>
                        {operatorLists.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                    {showSecondCustomInput && (
                        <input
                            type="number"
                            value={secondCustomValue}
                            onChange={(e) => e.target.value ? setSecondCustomValue(parseInt(e.target.value, 10)) : setSecondCustomValue(0)}
                            className={BindingModalStyles.input}
                        />
                    )}
                    <select
                        className={BindingModalStyles.input}
                        value={showSecondCustomInput ? JSON.stringify({ custom: true }) : JSON.stringify(secondBuilderValue)}
                        onChange={(e) => handleOptionChange(e, setSecondBuilderValue, setSecondCustomInput)}
                        disabled={!hasOptions}
                    >
                        {optionSet}
                    </select>

                    <label className={BindingModalStyles.labelCheckbox}>Show in results</label>
                    <input
                        className={BindingModalStyles.checkbox}
                        type="checkbox"
                        style={{ display: 'inline-block' }}
                        checked={showInResults}
                        disabled={!hasOptions}
                        onChange={e => setShowInResults(e.target.checked)} />
                    <label className={BindingModalStyles.labelCheckbox}>Absolute</label>
                    <input
                        type="checkbox"
                        style={{ display: 'inline-block' }}
                        checked={isAbsolute}
                        disabled={!hasOptions}
                        onChange={(e) => setIsAbsolute(e.target.checked)}
                        className={BindingModalStyles.checkbox}
                    />
                    <button className={BindingModalStyles.addButton} onClick={() => addBinding()} disabled={!hasOptions}>
                        {viewportWidth <= 768 ? <AddCircleOutlineIcon /> : "Add binding"}
                    </button>
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
                        const sourceIndex = sourceList.findIndex(item => item.id === binding.id);
                        const updatedBindings = [...sourceList];
                        updatedBindings[sourceIndex] = {
                            ...updatedBindings[sourceIndex],
                            showInResults: !updatedBindings[sourceIndex].showInResults
                        };
                        if (binding.source === 'bindings')
                            setBindings(updatedBindings);
                        else
                            setTempBindings(updatedBindings);
                    }}
                />
                <label className={BindingModalStyles.labelCheckbox}>Absolute</label>
                <input
                    className={BindingModalStyles.checkbox}
                    type="checkbox"
                    style={{ display: 'inline-block' }}
                    checked={binding.isAbsolute}
                    onChange={() => {
                        const sourceList = binding.source === 'bindings' ? bindings : tempBindings;
                        const sourceIndex = sourceList.findIndex(item => item.id === binding.id);
                        const updatedBindings = [...sourceList];
                        updatedBindings[sourceIndex] = {
                            ...updatedBindings[sourceIndex],
                            isAbsolute: !updatedBindings[sourceIndex].isAbsolute
                        };
                        if (binding.source === 'bindings')
                            setBindings(updatedBindings);
                        else
                            setTempBindings(updatedBindings);
                    }}
                />
                <button className={BindingModalStyles.bindingRemove} onClick={() => handleRemoveVariable(binding.id, binding.source)}>
                    <DeleteIcon />
                </button>
            </div>
        ));
    }

    return (
        <ModalWrapper isOpen={isBindingsOpen} closeModal={handleClose} maxWidth={1500}>
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
                        <ExpandMoreIcon style={{ transform: showBindingBuilder ? 'rotate(180deg)' : 'rotate(0)' }} />
                    </button>
                    <button className={BindingModalStyles.cancelBtn} onClick={handleClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </ModalWrapper>
    );
}

export default BindingsModal;
