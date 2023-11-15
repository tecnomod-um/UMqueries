import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { getOperatorTooltip } from "../../utils/typeChecker.js";
import ModalWrapper from '../ModalWrapper/modalWrapper';
import FilterModalStyles from './filtersModal.module.css';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';

function FiltersModal({ nodes, bindings, isFiltersOpen, setFiltersOpen, setFilters }) {
    // Filter definitions
    const [tempFilters, setTempFilters] = useState([]);
    // Filter inputs
    const [firstFilterValue, setFirstFilterValue] = useState('');
    const [secondFilterValue, setSecondFilterValue] = useState('');
    const [isCustomValueSelected, setIsCustomValueSelected] = useState(false);
    const [operator, setComparator] = useState('=');
    const [customFilterValue, setCustomFilterValue] = useState('');

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
        const filterableElements = getFilterableElements();
        setSelectedValue(filterableElements[0]);
    }, [getFilterableElements]);

    // Sets up the selects' default option so thats visually coherent
    useEffect(() => {
        if (!firstFilterValue) setDefaultValuesToFirstOption(setFirstFilterValue);
        if (!secondFilterValue) setDefaultValuesToFirstOption(setSecondFilterValue);
    }, [firstFilterValue, secondFilterValue, setDefaultValuesToFirstOption]);

    // Updates the comparator to the selected element's type
    useEffect(() => {
        const currentElement = getFilterableElements().find(prop => prop.key === firstFilterValue);
        const currentCategory = currentElement?.category || 'text';
        setComparator(operatorLists[currentCategory][0]);
    }, [firstFilterValue, getFilterableElements, operatorLists]);

    const handleSubmit = () => {
        setFilters(tempFilters);
        handleClose();
    }

    const handleClose = () => {
        setTempFilters([]);
        setFiltersOpen(false);
    }

    const getBindingCategory = (binding) => {
        if (['>', '<', '>=', '<='].includes(binding.operator))
            return 'boolean';
        return 'number';
    }

    const addFilter = () => {
        setTempFilters([...tempFilters, { property: firstFilterValue, comparator: operator, value: isCustomValueSelected ? customFilterValue : secondFilterValue }]);
        setFirstFilterValue();
        setSecondFilterValue();
        setComparator('=');
        setCustomFilterValue('');
    }

    const deleteFilter = (index) => {
        setTempFilters(currentFilters => currentFilters.filter((_, i) => i !== index));
    };

    const makeItem = (element) => {
        return <option key={element.label} value={element.value}>{element.label}</option>;
    }

    const handleOptionChange = (event, setValue, setCustomInput) => {
        const selectedOptionValue = event.target.value;
        const parsedValue = JSON.parse(selectedOptionValue);
        const isCustomValue = parsedValue.custom;

        setCustomInput && setCustomInput(isCustomValue);

        // Update secondFilterValue to reflect 'Custom Value' selection
        if (isCustomValue) {
            setValue({ label: "Custom Value", custom: true });
        } else {
            setValue(parsedValue);
        }
    }

    console.log(secondFilterValue)
    const updateCustomValueSelection = (isCustomValue) => {
        setIsCustomValueSelected(isCustomValue);

        if (isCustomValue) {
            setSecondFilterValue({ label: "Custom Value", custom: true });
        }
    }

    const filterBuilder = () => {
        const filterableElements = getFilterableElements();
        const hasOptions = filterableElements && filterableElements.length > 0;
        const optionSet = hasOptions ? [
            ...filterableElements.map((item) => makeItem(item))
        ] : [<option key="no-options" value="">{`No options available`}</option>];

        const currentCategory = firstFilterValue?.category || 'text';
        const isNumeric = currentCategory === 'number' || currentCategory === 'decimal';
        const relatedProperties = filterableElements.filter(element => element.category === currentCategory);
        const hasRelatedProperties = relatedProperties.length > 0;

        const gridTemplate = isCustomValueSelected ?
            "0.8fr 100px 0.5fr 150px 42px 105px 35px 1fr 20px 1fr 20px 1fr" :
            "0.8fr 100px 0.5fr 150px 42px 150px 1fr 20px 1fr 20px 1fr";

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
                    {isCustomValueSelected && (
                        <input
                            className={FilterModalStyles.customValueInput}
                            type={isNumeric ? 'number' : 'text'}
                            value={customFilterValue}
                            onChange={(e) => e.target.value ? setCustomFilterValue(e.target.value) : setCustomFilterValue(0)}
                        />
                    )}
                    <button
                        className={FilterModalStyles.addButton}
                        onClick={() => addFilter()}
                        disabled={!hasOptions}>
                        Add Filter
                    </button>
                </div>
            </div>
        );
    }

    const renderFilters = () => {
        return (
            <div className={FilterModalStyles.filtersList}>
                {tempFilters.map((filter, index) => {
                    const firstElement = getFilterableElements().find(prop => prop.key === filter.property)?.label || filter.property;
                    const secondElement = isCustomValueSelected ? filter.value : getFilterableElements().find(prop => prop.key === filter.value)?.label || filter.value;

                    return (
                        <div key={index} className={FilterModalStyles.filterItem}>
                            {`${firstElement.label} ${filter.comparator} ${secondElement}`}
                            <CloseIcon
                                style={{ cursor: 'pointer' }}
                                onClick={() => deleteFilter(index)}
                            />
                        </div>
                    );
                })}
            </div>
        );
    }

    return (
        <ModalWrapper isOpen={isFiltersOpen} closeModal={handleClose} maxWidth={1500}>
            <div className={FilterModalStyles.modalHeader}>
                <h2>Filters</h2>
            </div>
            <button className={FilterModalStyles.closeBtn} onClick={handleClose}>
                <CloseIcon style={{ color: 'white', marginBottom: '-7px' }} />
            </button>
            <div className={FilterModalStyles.modalContent}>
                {renderFilters()}
                {filterBuilder()}
            </div>
            <div className={FilterModalStyles.modalActions}>
                <button className={FilterModalStyles.setBtn} onClick={handleSubmit}>
                    Set Filters
                </button>
                <button className={FilterModalStyles.cancelBtn} onClick={handleClose}>
                    Cancel
                </button>
            </div>
        </ModalWrapper>
    );
}

export default FiltersModal;
