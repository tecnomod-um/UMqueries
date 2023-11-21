import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { getOperatorTooltip } from "../../utils/typeChecker.js";
import ModalWrapper from '../ModalWrapper/modalWrapper';
import FilterModalStyles from './filtersModal.module.css';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/RemoveCircleOutline';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function FiltersModal({ nodes, bindings, isFiltersOpen, setFiltersOpen, setFilters }) {
    // Temporary structure
    const [graph, setGraph] = useState({ nodes: [], edges: [], bindings: [], filters: [] });
    // Filter definitions
    const [tempFilters, setTempFilters] = useState([]);
    const [activeFilters, setActiveFilters] = useState([]);
    // Filter inputs
    const [firstFilterValue, setFirstFilterValue] = useState('');
    const [secondFilterValue, setSecondFilterValue] = useState('');
    const [isCustomValueSelected, setIsCustomValueSelected] = useState(false);
    const [operator, setComparator] = useState('=');
    const [customFilterValue, setCustomFilterValue] = useState('');
    const [showFilterBuilder, setShowFilterBuilder] = useState(tempFilters.length === 0);

    const operatorLists = useMemo(() => ({
        number: ['<', '<=', '=', '>=', '>'],
        decimal: ['<', '<=', '=', '>=', '>'],
        text: ['=', '⊆'],
        boolean: ['=', '!='],
        datetime: ['<', '<=', '=', '>=', '>'],
        binary: ['=', '!='],
        uri: ['=', '!=', '⊆'],
        select: ['=']
    }), []);

    // Gets all elements that could be useful for a filter definition
    const getFilterableElements = useCallback(() => {
        const filterableElements = [];
        nodes.forEach(node => {
            if (node.properties) {
                Object.entries(node.properties).forEach(([propName, prop]) => {
                    if (prop.data || prop.show) {
                        filterableElements.push({
                            label: propName,
                            value: JSON.stringify({
                                key: prop.uri,
                                category: prop.type,
                                label: propName
                            })
                        });
                    }
                });
            }
        });
        bindings.forEach(binding => {
            const category = getBindingCategory(binding);
            filterableElements.push({
                label: binding.label,
                value: JSON.stringify({
                    key: binding.id,
                    category,
                    label: binding.label
                })
            });
        });
        return filterableElements;
    }, [nodes, bindings]);

    // Resets select values
    const setDefaultValuesToFirstOption = useCallback((setSelectedValue) => {
        setIsCustomValueSelected(false);
        const filterableElements = getFilterableElements();
        if (filterableElements.length > 0) {
            const firstElement = filterableElements[0].value;
            setSelectedValue(JSON.parse(firstElement));
            const category = JSON.parse(firstElement).category || 'text';
            setComparator(operatorLists[category][0]);
        }
    }, [getFilterableElements, operatorLists]);

    // Sets up the selects' default option so thats visually coherent
    useEffect(() => {
        if (!firstFilterValue) setDefaultValuesToFirstOption(setFirstFilterValue);
        if (!secondFilterValue) setDefaultValuesToFirstOption(setSecondFilterValue);
    }, [firstFilterValue, secondFilterValue, setDefaultValuesToFirstOption]);

    // Fading in effect
    useEffect(() => {
        const currentFilterIds = [...graph.filters, ...tempFilters].map(item => item.id);
        setActiveFilters(currentFilterIds);
    }, [graph, tempFilters]);

    // Updates the comparator to the selected element's type
    useEffect(() => {
        const currentElement = getFilterableElements().find(prop => prop.key === firstFilterValue);
        const currentCategory = currentElement?.category || 'text';
        setComparator(operatorLists[currentCategory][0]);
    }, [firstFilterValue, getFilterableElements, operatorLists]);

    // Sets up the builder visibility
    useEffect(() => {
        if (!isFiltersOpen) setShowFilterBuilder(tempFilters.length === 0);
    }, [isFiltersOpen, tempFilters]);

    const handleSubmit = () => {
        setFilters(tempFilters);
        handleClose();
    }

    const handleClose = () => {
        setTempFilters([]);
        setFiltersOpen(false);
    }

    const handleOptionChange = (event, setValue, setCustomInput) => {
        const selectedOptionValue = event.target.value;
        const parsedValue = JSON.parse(selectedOptionValue);
        const isCustomValue = parsedValue.custom;

        setCustomInput && setCustomInput(isCustomValue);
        if (isCustomValue) {
            setValue({ label: "Custom Value", custom: true });
        } else {
            setValue(parsedValue);
        }
    }

    const getBindingCategory = (binding) => {
        if (['>', '<', '>=', '<='].includes(binding.operator))
            return 'boolean';
        return 'number';
    }

    const addFilter = () => {
        const firstValue = firstFilterValue;
        const secondValue = isCustomValueSelected ? { label: customFilterValue, custom: true } : secondFilterValue;
        const newFilter = {
            id: Date.now(),
            firstValue,
            comparator: operator,
            secondValue
        };
        setTempFilters([...tempFilters, newFilter]);
        setFirstFilterValue('');
        setSecondFilterValue('');
        setComparator('=');
        setCustomFilterValue('');
    }

    const handleRemoveFilter = useCallback((filterId) => {
        const updatedActiveFilters = activeFilters.filter(fId => fId !== filterId);
        setActiveFilters(updatedActiveFilters);

        setTimeout(() => {
            const updatedFilters = graph.filters.filter(f => f.id !== filterId);
            const updatedTempFilters = tempFilters.filter(f => f.id !== filterId);
            // setFilters(updatedFilters);
            setTempFilters(updatedTempFilters);
        }, 500);
    }, [activeFilters, graph, tempFilters]);

    const makeItem = (element) => {
        return <option key={element.label} value={element.value}>{element.label}</option>;
    }

    const toggleFilterBuilderVisibility = () => {
        setShowFilterBuilder(!showFilterBuilder);
    }

    const updateCustomValueSelection = (isCustomValue) => {
        setIsCustomValueSelected(isCustomValue);
        if (isCustomValue)
            setSecondFilterValue({ label: "Custom Value", custom: true });
    }

    const filterBuilder = () => {
        const filterableElements = getFilterableElements();
        const hasOptions = filterableElements && filterableElements.length > 0;
        const optionSet = hasOptions ? [
            ...filterableElements.map((item) => makeItem(item))
        ] : [<option key="no-options" value="">{`No options available`}</option>];

        const currentCategory = firstFilterValue?.category || 'text';
        const isNumeric = currentCategory === 'number' || currentCategory === 'decimal';
        const showCustomValueInput = isCustomValueSelected && secondFilterValue?.custom;
        const gridTemplate = showCustomValueInput ?
            "0.8fr 250px 0.5fr 220px 20px 1fr" :
            "0.8fr 250px 0.5fr 250px 1fr";
        return (
            <div className={FilterModalStyles.filterBuilder}>
                <div className={FilterModalStyles.fieldContainer} style={{ gridTemplateColumns: gridTemplate }}>
                    <label className={FilterModalStyles.labelFilter}>Filter</label>
                    <select
                        className={FilterModalStyles.input}
                        value={JSON.stringify(firstFilterValue)}
                        onChange={(e) => handleOptionChange(e, setFirstFilterValue, null)}
                        disabled={!hasOptions}>
                        {optionSet}
                    </select>
                    <select
                        title={getOperatorTooltip(operator)}
                        className={FilterModalStyles.operatorSelector}
                        value={operator}
                        onChange={(e) => setComparator(e.target.value)}
                        disabled={!hasOptions}>
                        {operatorLists[currentCategory].map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                    {showCustomValueInput && (
                        <input
                            className={FilterModalStyles.input}
                            type={isNumeric ? 'number' : 'text'}
                            value={customFilterValue}
                            onChange={(e) => e.target.value ? setCustomFilterValue(e.target.value) : setCustomFilterValue(0)}
                        />
                    )}
                    <select
                        className={FilterModalStyles.input}
                        value={JSON.stringify(secondFilterValue)}
                        onChange={(e) => handleOptionChange(e, setSecondFilterValue, updateCustomValueSelection)}
                        disabled={!hasOptions}>
                        {optionSet}
                        <option key="custom-value" value={JSON.stringify({ label: "Custom Value", custom: true })}>
                            Custom value
                        </option>
                    </select>
                    <button
                        className={FilterModalStyles.addButton}
                        onClick={() => addFilter()}
                        disabled={!hasOptions}>
                        Add
                    </button>
                </div>
            </div>
        );
    }

    const renderFilters = () => {
        const filterElements = getFilterableElements();
        const getLabel = (filterValue, isCustom) => {
            if (isCustom) return filterValue.label;
            const element = filterElements.find(el => JSON.stringify(el.value) === JSON.stringify(filterValue));
            return element ? element.label : filterValue.label;
        }
        return (tempFilters.map((filter, index) => (
            <div key={index} className={`${FilterModalStyles.filterRow} ${activeFilters.includes(filter.id) ? FilterModalStyles.filterRowActive : ''}`}
                style={{ backgroundColor: tempFilters.some(f => f.id === filter.id) ? "#e9e9e9" : "white" }}>
                <div className={FilterModalStyles.expression}>{getLabel(filter.firstValue, false)}</div>
                <div className={FilterModalStyles.operator}>{filter.comparator}</div>
                <div className={FilterModalStyles.expression}>{getLabel(filter.secondValue, filter.secondValue?.custom)}</div>
                <DeleteIcon
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleRemoveFilter(filter.id)} />
            </div>
        )));
    }

    return (
        <ModalWrapper isOpen={isFiltersOpen} closeModal={handleClose} maxWidth={1500}>
            <div className={FilterModalStyles.modalHeader}>
                <h2>Filters</h2>
            </div>
            <button className={FilterModalStyles.closeBtn} onClick={handleClose}>
                <CloseIcon style={{ color: 'white', marginBottom: '-7px' }} />
            </button>
            <div className={`${FilterModalStyles.modalContent} ${showFilterBuilder ? FilterModalStyles.showFilterBuilder : ""}`}>
                {renderFilters()}
                {filterBuilder()}
            </div>
            <div className={FilterModalStyles.modalActions}>
                <button className={FilterModalStyles.setBtn} onClick={handleSubmit}>
                    Set Filters
                </button>
                <button
                    onClick={() => toggleFilterBuilderVisibility()}
                    className={FilterModalStyles.toggleButton}
                >
                    <ExpandMoreIcon style={{ transform: showFilterBuilder ? 'rotate(180deg)' : 'rotate(0)' }} />
                </button>
                <button className={FilterModalStyles.cancelBtn} onClick={handleClose}>
                    Cancel
                </button>
            </div>
        </ModalWrapper>
    );
}

export default FiltersModal;
