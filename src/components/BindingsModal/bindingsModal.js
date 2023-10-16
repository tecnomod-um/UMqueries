import React, { useState, useEffect, useRef, useMemo } from "react";
import { CSSTransition } from "react-transition-group";
import { addSpaceChars } from "../../utils/stringFormatter"
import BindingModalStyles from "./bindingsModal.module.css";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from '@mui/icons-material/RemoveCircleOutline';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Modal used in binding definitions
function BindingsModal({ nodes, isBindingsOpen, setBindingsOpen }) {
    const [bindings, setBindings] = useState([]);
    const [operator, setOperator] = useState('+');
    const [selectedValue1, setSelectedValue1] = useState("");
    const [selectedValue2, setSelectedValue2] = useState("");
    const [tempBindings, setTempBindings] = useState([]);
    const [bindingName, setBindingName] = useState("");
    const [showInResults, setShowInResults] = useState(false);
    const [showBindingBuilder, setShowBindingBuilder] = useState(bindings.length === 0);
    const modalRef = useRef(null);
    const operatorList = useMemo(() => (['+', '-', '*', '/']), []);

    useEffect(() => {
        if (!isBindingsOpen) setShowBindingBuilder(bindings.length === 0);
    }, [isBindingsOpen, bindings])

    const handleClose = () => {
        setBindings(tempBindings);
        setBindingsOpen(false);
    }

    const toggleBindingBuilderVisibility = () => {
        setShowBindingBuilder(!showBindingBuilder);
    }

    const MakeItem = (X) => <option key={X.label} value={X.value}>{X.label}</option>;

    const handleOptionChange = (event, element) => {
        const selectedValue = event.target.value;

        switch (element) {
            case 1:
                setSelectedValue1(selectedValue);
                break;
            case 2:
            default:
                setSelectedValue2(selectedValue);
                break;
        }
        if (element === 1 && !selectedValue1) {
            setSelectedValue1(event.target[0]?.value);
        } else if (element === 2 && !selectedValue2) {
            setSelectedValue2(event.target[0]?.value);
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

    const addBinding = () => {
        if (!bindingName.trim()) {
            alert('Binding name cannot be empty.');
            return;
        }
        if (tempBindings.some(b => b.varName === bindingName)) {
            alert('Binding with the same name already exists.');
            return;
        }
        const newBinding = {
            varName: bindingName,
            expression: `${addSpaceChars(selectedValue1)} ${operator} ${addSpaceChars(selectedValue2)}`,
            showInResults: false,
            temporary: true
        };
        setTempBindings(prev => [...prev, newBinding]);
    }


    const handleSubmit = () => {
        const finalizedBindings = tempBindings.map(binding => {
            return { ...binding, temporary: false };
        });
        setBindings(finalizedBindings);
        setBindingsOpen(false);
    }


    const handleRemoveVariable = (index) => {
        const updatedVariables = [...tempBindings];
        updatedVariables.splice(index, 1);
        setTempBindings(updatedVariables);
    }

    const getNumericProperties = (nodes, tempBindings) => {
        const numericValues = [];
        [...tempBindings].forEach(binding => {
            numericValues.push({ label: binding.varName, value: `binding___${binding.varName}` });
        });
        nodes?.forEach(node => {
            Object.keys(node.properties).forEach((key) => {
                if (node.properties[key].type === "number") {
                    const optionLabel = `${node.label}'s ${key}`;
                    numericValues.push({ label: optionLabel, value: `${node.id}___${node.properties[key].uri}` });
                }
            });
        });
        return numericValues;
    }


    const createOptionElements = (numericProperties) => {
        if (numericProperties.length === 0) {
            return <option disabled>No options available</option>;
        }
        return numericProperties.map((item) => (
            <MakeItem key={item.value} {...item} />
        ));
    }

    function bindingBuilder() {
        const numericProperties = getNumericProperties(nodes, tempBindings);

        if (numericProperties.length > 0) {
            if (!selectedValue1) setSelectedValue1(numericProperties[0].value);
            if (!selectedValue2) setSelectedValue2(numericProperties[0].value);
        }

        const optionSet = createOptionElements(numericProperties);

        return (
            <div className={BindingModalStyles.fieldContainer}>
                <label className={BindingModalStyles.labelVarname}>Variable</label>
                <span className={BindingModalStyles.inputWrapper}>
                    <input
                        className={BindingModalStyles.input}
                        type="text"
                        value={bindingName}
                        onChange={e => setBindingName(e.target.value)}
                    />
                </span>
                <label className={BindingModalStyles.labelEquals}>equals</label>
                <select
                    className={BindingModalStyles.input}
                    value={selectedValue1}
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
                    value={selectedValue2}
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
                    onChange={e => setShowInResults(e.target.checked)}
                />
                <button className={BindingModalStyles.addButton} onClick={() => addBinding()}>Add binding</button>
            </div>
        );
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
                            <div>
                                {tempBindings.map((binding, index) => (
                                    <div key={index} className={BindingModalStyles.bindingRow} style={{ backgroundColor: binding.temporary ? "#e9e9e9" : "white" }}>
                                        <div className={BindingModalStyles.bindingName}>{binding.varName}</div>
                                        <div className={BindingModalStyles.bindingExpression}>{binding.expression}</div>
                                        <input
                                            className={BindingModalStyles.checkbox}
                                            type="checkbox"
                                            style={{ display: 'inline-block' }}
                                            checked={binding.showInResults}
                                            onChange={() => {
                                                const updatedBindings = [...tempBindings];
                                                updatedBindings[index].showInResults = !updatedBindings[index].showInResults;
                                                setTempBindings(updatedBindings);
                                            }}
                                        />
                                        <button className={BindingModalStyles.bindingRemove} onClick={() => handleRemoveVariable(index)}>
                                            <DeleteIcon />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className={BindingModalStyles.bindingBuilder}>
                                {bindingBuilder()}
                            </div>
                        </div>
                        <button className={BindingModalStyles.closeBtn} onClick={handleClose}>
                            <CloseIcon style={{ color: 'white', marginBottom: "-7px" }} />
                        </button>
                        <div className={BindingModalStyles.modalActions}>
                            <div className={BindingModalStyles.actionsContainer}>
                                <button
                                    className={BindingModalStyles.setBtn}
                                    onClick={handleSubmit}
                                >
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
    );
}

export default BindingsModal;