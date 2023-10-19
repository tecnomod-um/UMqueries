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
    const [error, showError] = useState(false);
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

    const toggleBindingBuilderVisibility = () => {
        setShowBindingBuilder(!showBindingBuilder);
    }

    const makeItem = (element) => {
        return <option key={element.label} value={element.value}>{element.label}</option>;
    }

    const handleOptionChange = (event, setValue) => {
        const value = JSON.parse(event.target.options[event.target.selectedIndex].value);
        setValue(value);
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
                bindingId: foundBinding.id,
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
        showError(false);
        if ((!bindingName.trim()) || ([...bindings, ...tempBindings].some(b => b.label === bindingName))) {
            showError(true);
            return;
        }
        const firstValueInfo = findNodeInfo(firstBuilderValue);
        const secondValueInfo = findNodeInfo(secondBuilderValue);

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
        setBindings([...bindings, ...tempBindings]);
        handleClose();
    }

    const removeBindingAndDependencies = (bindingId, bindingArray, tempBindingArray) => {
        if (firstBuilderValue && firstBuilderValue.bindingId === bindingId)
            setDefaultValuesToFirstOption(setFirstBuilderValue);
        if (secondBuilderValue && secondBuilderValue.bindingId === bindingId)
            setDefaultValuesToFirstOption(setSecondBuilderValue);
        let updatedBindings = bindingArray.filter(b => b.id !== bindingId);
        let updatedTempBindings = tempBindingArray.filter(b => b.id !== bindingId);

        const dependentBindings = [...updatedBindings, ...updatedTempBindings].filter(binding =>
            binding.firstValue.bindingId === bindingId || binding.secondValue.bindingId === bindingId
        );
        for (const dependentBinding of dependentBindings) {
            [updatedBindings, updatedTempBindings] = removeBindingAndDependencies(dependentBinding.id, updatedBindings, updatedTempBindings);
        }
        return [updatedBindings, updatedTempBindings];
    }

    const handleRemoveVariable = (bindingId, source) => {
        let [updatedBindings, updatedTempBindings] = removeBindingAndDependencies(bindingId, bindings, tempBindings);
        setBindings(updatedBindings);
        setTempBindings(updatedTempBindings);
    }


    function bindingBuilder() {
        const numericProperties = getNumericProperties(nodes, tempBindings);
        const hasOptions = numericProperties && numericProperties.length > 0;
        const optionSet = hasOptions
            ? numericProperties.map((item) => makeItem(item))
            : [<option key="no-options" value="">{`No options available`}</option>];

        return (
            <div className={BindingModalStyles.bindingBuilder}>
                <div className={BindingModalStyles.fieldContainer}>
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
                        value={JSON.stringify(firstBuilderValue)}
                        onChange={(e) => handleOptionChange(e, setFirstBuilderValue)}
                        disabled={!hasOptions}
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
                        onChange={(e) => handleOptionChange(e, setSecondBuilderValue)}
                        disabled={!hasOptions}
                    >
                        {optionSet}
                    </select>
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

    const renderBindings = () => {
        const allBindings = [
            ...bindings.map(item => ({ ...item, source: 'bindings' })),
            ...tempBindings.map(item => ({ ...item, source: 'tempBindings' }))
        ];

        return allBindings.map((binding, index) => (
            <div
                key={binding.id}
                className={BindingModalStyles.bindingRow}
                style={{ backgroundColor: binding.source === 'tempBindings' ? "#e9e9e9" : "white" }}
            >
                <div className={BindingModalStyles.bindingName}>{binding.label}</div>
                <div className={BindingModalStyles.bindingExpression}>
                    {binding.firstValue.label} {binding.operator} {binding.secondValue.label}
                </div>
                <label className={BindingModalStyles.showInResultsLabel}>Show in results:</label>
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