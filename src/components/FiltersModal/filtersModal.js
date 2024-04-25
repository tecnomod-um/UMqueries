import { React, useState, useCallback, useEffect, useMemo } from 'react';
import { getOperatorTooltip } from "../../utils/typeChecker.js";
import ModalWrapper from '../ModalWrapper/modalWrapper';
import FilterModalStyles from './filtersModal.module.css';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function FiltersModal({ allNodes, allBindings, isFiltersOpen, setFiltersOpen, filters, setFilters }) {
    // Filter definitions
    const [tempFilters, setTempFilters] = useState([]);
    const [activeFilters, setActiveFilters] = useState([]);
    // Filter inputs
    const [firstFilterValue, setFirstFilterValue] = useState('');
    const [secondFilterValue, setSecondFilterValue] = useState('');
    const [operator, setComparator] = useState('=');
    const [customFilterValue, setCustomFilterValue] = useState('');
    // Modal element configurations
    const [showFilterBuilder, setShowFilterBuilder] = useState(tempFilters.length === 0);
    const [isCustomValueSelected, setIsCustomValueSelected] = useState(false);
    const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

    const operatorLists = useMemo(() => ({
        number: ['<', '<=', '=', '>=', '>'],
        decimal: ['<', '<=', '=', '>=', '>'],
        text: ['=', '⊆'],
        boolean: ['=', '!='],
        datetime: ['<', '<=', '=', '>=', '>'],
        binary: ['=', '!='],
        link: ['=', '!=', '⊆'],
        uri: ['=', '!=', '⊆'],
        select: ['=']
    }), []);

    // Check if a filter is valid
    const isFilterValid = useMemo(() => {
        return (filter) => {
            const checkElementValidity = (value) => {
                if (value.custom)
                    return true;
                else if (value.nodeType)
                    return value.ids.some(nodeId => allNodes.some(node => node.ids.includes(nodeId)));
                else if (value.bindingLabel)
                    return allBindings.some(binding => binding.id === value.key);
                return false;
            };
            return checkElementValidity(filter.firstValue) && checkElementValidity(filter.secondValue);
        };
    }, [allNodes, allBindings]);

    // Gets all elements that could be useful for a filter definition
    const getFilterableElements = useCallback(() => {
        const filterableElements = [];
        allNodes.forEach(node => {
            if (node.properties) {
                Object.entries(node.properties).forEach(([propName, prop]) => {
                    if (prop.data || prop.show || prop.as) {
                        // TODO Always showing node.ids[0] makes no sense. Specific node filtering needs implementation
                        const label = prop.as || `${propName} ${node.label}${node.varID < 0 ? ` ${node.ids[0]}` : ''}`;
                        if (!filterableElements.some(element => element.label === label)) {
                            filterableElements.push({
                                label: label,
                                value: JSON.stringify({
                                    key: prop.uri,
                                    category: prop.type,
                                    nodeType: node.type,
                                    ids: node.ids,
                                    nodeVarID: node.varID,
                                    asLabel: prop.as,
                                    label: label
                                })
                            });
                        }
                    }
                });
            }
        });
        allBindings.forEach(binding => {
            const category = getBindingCategory(binding);
            filterableElements.push({
                label: binding.label,
                value: JSON.stringify({
                    key: binding.id,
                    category,
                    bindingLabel: binding.label,
                    label: binding.label
                })
            });
        });
        return filterableElements;
    }, [allNodes, allBindings]);

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

    const updateFilterNodeIds = useCallback((value) => {
        if (value.nodeType) {
            const existingNodeIds = allNodes.flatMap(node => node.ids);
            value.ids = value.ids.filter(nodeId => existingNodeIds.includes(nodeId));
        }
    }, [allNodes]);

    // Sets up the selects' default option so thats visually coherent
    useEffect(() => {
        if (!firstFilterValue) setDefaultValuesToFirstOption(setFirstFilterValue);
        if (!secondFilterValue) setDefaultValuesToFirstOption(setSecondFilterValue);
    }, [firstFilterValue, secondFilterValue, setDefaultValuesToFirstOption]);

    // Update filters when nodes or bindings change
    useEffect(() => {
        const updatedFilters = filters.map(filter => {
            updateFilterNodeIds(filter.firstValue);
            updateFilterNodeIds(filter.secondValue);
            return filter;
        }).filter(isFilterValid);
        const updatedTempFilters = tempFilters.map(filter => {
            updateFilterNodeIds(filter.firstValue);
            updateFilterNodeIds(filter.secondValue);
            return filter;
        }).filter(isFilterValid);
        if (updatedFilters.length !== filters.length || updatedTempFilters.length !== tempFilters.length) {
            setFilters(updatedFilters);
            setTempFilters(updatedTempFilters);
        }
    }, [allNodes, allBindings, filters, tempFilters, setFilters, isFilterValid, updateFilterNodeIds]);

    // Detects the viewport size for element configs
    useEffect(() => {
        const handleResize = () => {
            setViewportWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // If a numeric comparator value is selected, update with the first available numeric value
    useEffect(() => {
        const isNumericOperator = ['<', '<=', '>=', '>'].includes(operator);
        const firstValueCategory = firstFilterValue?.category || 'text';
        if (isNumericOperator && (firstValueCategory === 'number' || firstValueCategory === 'decimal')) {
            const numericOptions = getFilterableElements().filter(item => ['number', 'decimal'].includes(JSON.parse(item.value).category));
            if (numericOptions.length > 0)
                setSecondFilterValue(JSON.parse(numericOptions[0].value));
        }
    }, [operator, firstFilterValue, getFilterableElements]);

    // Fading in effect
    useEffect(() => {
        const currentFilterIds = [...filters, ...tempFilters].map(item => item.id);
        setActiveFilters(currentFilterIds);
    }, [filters, tempFilters]);

    // Updates the comparator to the selected element's type
    useEffect(() => {
        const currentElement = getFilterableElements().find(prop => prop.key === firstFilterValue);
        const currentCategory = currentElement?.category || 'text';
        setComparator(operatorLists[currentCategory][0]);
    }, [firstFilterValue, getFilterableElements, operatorLists]);

    // Sets up the builder visibility
    useEffect(() => {
        if (!isFiltersOpen) setShowFilterBuilder(filters.length === 0);
    }, [isFiltersOpen, filters, tempFilters]);

    const handleSubmit = () => {
        setFilters([...filters, ...tempFilters]);
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

        if (isCustomValue)
            setValue({ label: "Custom Value", custom: true });
        else
            setValue(parsedValue);
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
            const updatedFilters = filters.filter(f => f.id !== filterId);
            const updatedTempFilters = tempFilters.filter(f => f.id !== filterId);
            setFilters(updatedFilters);
            setTempFilters(updatedTempFilters);
        }, 500);
    }, [activeFilters, filters, tempFilters, setFilters]);

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

    const getGridTemplate = (viewportWidth, showCustomValueInput) => {
        if (viewportWidth <= 768)
            return showCustomValueInput ? "250px 45px 220px 20px 60px" : "250px 45px 250px 60px";
        else
            return showCustomValueInput ? "0.8fr 250px 0.5fr 220px 20px 1fr" : "0.8fr 250px 0.5fr 250px 1fr";
    }

    // Filter builder interface definition
    const filterBuilder = () => {
        const filterableElements = getFilterableElements();
        const hasOptions = filterableElements && filterableElements.length > 0;
        const isNumericOperator = ['<', '<=', '>=', '>'].includes(operator);

        const firstOptionSet = hasOptions ? [
            ...filterableElements.map((item) => makeItem(item))
        ] : [<option key="no-options" value="">{`No options available`}</option>];

        const secondOptionSet = hasOptions ?
            isNumericOperator ? [
                ...filterableElements.filter(item => JSON.parse(item.value).category === 'number' || JSON.parse(item.value).category === 'decimal').map((item) => makeItem(item))] : [
                ...filterableElements.map((item) => makeItem(item))
            ]
            : [<option key="no-options" value="">{`No options available`}</option>];

        const currentCategory = firstFilterValue?.category || 'text';
        const isNumeric = currentCategory === 'number' || currentCategory === 'decimal';

        const showCustomValueInput = isCustomValueSelected && secondFilterValue?.custom;

        return (
            <div className={FilterModalStyles.filterBuilder}>
                <div className={FilterModalStyles.fieldContainer} style={{ gridTemplateColumns: getGridTemplate(viewportWidth, showCustomValueInput) }}>
                    <label className={FilterModalStyles.labelFilter}>Filter</label>
                    <select
                        className={FilterModalStyles.input}
                        value={JSON.stringify(firstFilterValue)}
                        onChange={(e) => handleOptionChange(e, setFirstFilterValue, null)}
                        disabled={!hasOptions}>
                        {firstOptionSet}
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
                        {secondOptionSet}
                        <option key="custom-value" value={JSON.stringify({ label: "Custom Value", custom: true })}>
                            Custom value
                        </option>
                    </select>
                    <button
                        className={FilterModalStyles.addButton}
                        onClick={() => addFilter()}
                        disabled={!hasOptions}>
                        {viewportWidth <= 768 ? <AddCircleOutlineIcon /> : "Add"}
                    </button>
                </div>
            </div>
        );
    }

    // Defined filters interface definition
    const renderFilters = () => {
        const filterElements = getFilterableElements();
        const getLabel = (filterValue, isCustom) => {
            if (isCustom) return filterValue.label;
            const element = filterElements.find(el => JSON.stringify(el.value) === JSON.stringify(filterValue));
            return element ? element.label : filterValue.label;
        }
        const allFilters = [
            ...filters.map(item => ({ ...item, source: 'graph' })),
            ...tempFilters.map(item => ({ ...item, source: 'tempFilters' }))
        ];
        return (allFilters.map((filter, index) => (
            <div key={filter.id} className={`${FilterModalStyles.filterRow} ${activeFilters.includes(filter.id) ? FilterModalStyles.filterRowActive : ''}`}
                style={{ backgroundColor: filter.source === 'tempFilters' ? "#e9e9e9" : "white" }}>
                <div className={FilterModalStyles.expression}>{getLabel(filter.firstValue, false)}</div>
                <div className={FilterModalStyles.operator}>{filter.comparator}</div>
                <div className={FilterModalStyles.expression}>{getLabel(filter.secondValue, filter.secondValue?.custom)}</div>
                <button className={FilterModalStyles.filterRemove} onClick={() => handleRemoveFilter(filter.id)}>
                    <DeleteIcon />
                </button>
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
