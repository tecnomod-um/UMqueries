import React, { useState, useCallback, useEffect, useMemo } from 'react';
import ModalWrapper from '../ModalWrapper/modalWrapper';
import FilterModalStyles from './filtersModal.module.css';
import CloseIcon from '@mui/icons-material/Close';

function FiltersModal({ nodes, bindings, isFiltersOpen, setFiltersOpen, setFilters }) {
    const [tempFilters, setTempFilters] = useState([]);
    const [firstSelectedElement, setFirstSelectedElement] = useState('');
    const [secondSelectedElement, setSecondSelectedElement] = useState('');
    const [isCustomValueSelected, setIsCustomValueSelected] = useState(false);
    const [comparator, setComparator] = useState('=');
    const [filterValue, setFilterValue] = useState('');

    const comparatorOptions = useMemo(() => ({
        number: ['<', '<=', '=', '>=', '>'],
        decimal: ['<', '<=', '=', '>=', '>'],
        text: ['=', '⊆'],
        boolean: ['=', '!='],
        datetime: ['<', '<=', '=', '>=', '>'],
        binary: ['=', '!='],
        uri: ['=', '!=', '⊆'],
        select: ['=']
    }), []);

    const getFilterableElements = useCallback(() => {
        const filterableElement = [];
        nodes.forEach(node => {
            if (node.properties) {
                Object.entries(node.properties).forEach(([propName, prop]) => {
                    if (prop.data || prop.show)
                        filterableElement.push({ key: prop.uri, category: prop.type, label: propName });
                });
            }
        });
        bindings.forEach(binding => {
            const category = getBindingCategory(binding);
            filterableElement.push({ key: binding.id, category, label: binding.label });
        });
        return filterableElement;
    }, [nodes, bindings]);

    const updateComparator = useCallback((category) => {
        setComparator(comparatorOptions[category][0]);
    }, [comparatorOptions]);

    useEffect(() => {
        const filterableElements = getFilterableElements();
        if (filterableElements.length > 0)
            setFirstSelectedElement(filterableElements[0].key);
    }, [getFilterableElements]);

    useEffect(() => {
        const currentElement = getFilterableElements().find(prop => prop.key === firstSelectedElement);
        const currentCategory = currentElement?.category || 'text';
        updateComparator(currentCategory);
    }, [firstSelectedElement, getFilterableElements, updateComparator]);

    const handleClose = () => {
        setTempFilters([]);
        setFiltersOpen(false);
    }

    const handleSubmit = () => {
        setFilters(tempFilters);
        handleClose();
    }

    const getBindingCategory = (binding) => {
        if (['>', '<', '>=', '<='].includes(binding.operator))
            return 'boolean';
        return 'number';
    }

    const addFilter = () => {
        setTempFilters([...tempFilters, { property: firstSelectedElement, comparator, value: filterValue }]);
        setComparator('=');
        setFilterValue('');
    }

    const filterBuilder = () => {
        const properties = getFilterableElements();
        const currentFirstElement = properties.find(prop => prop.key === firstSelectedElement);
        const currentSecondElement = properties.find(prop => prop.key === secondSelectedElement);
        const currentCategory = currentFirstElement?.category || 'text';
        const isNumeric = currentCategory === 'number' || currentCategory === 'decimal';

        const relatedProperties = properties.filter(prop => prop.category === currentCategory);
        const hasRelatedProperties = relatedProperties.length > 0;
        const customValueOption = "Enter custom value";

        const handleValueChange = (e) => {
            setIsCustomValueSelected(e.target.value === customValueOption);
            setFilterValue(e.target.value);
        };

        const handleFirstSelectChange = (e) => {
            const selectedKey = e.target.value;
            setFirstSelectedElement(selectedKey);
            const selectedElement = properties.find(prop => prop.key === selectedKey);
            updateComparator(selectedElement?.category || 'text');
        };

        return (
            <div className={FilterModalStyles.filterCreator}>
                <select
                    className={FilterModalStyles.propertySelector}
                    value={firstSelectedElement}
                    onChange={handleFirstSelectChange}
                    disabled={properties.length === 0}>
                    {properties.map(prop => (
                        <option key={prop.key} value={prop.key}>{prop.label}</option>
                    ))}
                </select>
                <select
                    className={FilterModalStyles.comparatorSelector}
                    value={comparator}
                    onChange={(e) => setComparator(e.target.value)}
                    disabled={!hasRelatedProperties}>
                    {comparatorOptions[currentCategory].map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
                <select
                    className={FilterModalStyles.valueInput}
                    value={filterValue}
                    onChange={handleValueChange}
                    disabled={!hasRelatedProperties}>
                    {relatedProperties.map(prop => (
                        <option key={prop.key} value={prop.key}>{prop.label}</option>
                    ))}
                    <option value={customValueOption}>{customValueOption}</option>
                </select>
                {isCustomValueSelected && (
                    <input
                        className={FilterModalStyles.customValueInput}
                        type={isNumeric ? 'number' : 'text'}
                        value={filterValue}
                        onChange={(e) => setFilterValue(e.target.value)}
                    />
                )}
                <button
                    className={FilterModalStyles.addFilterBtn}
                    onClick={addFilter}
                    disabled={!hasRelatedProperties || (isCustomValueSelected && filterValue.trim() === '')}>
                    Add Filter
                </button>
            </div>
        );
    }

    const renderFilters = () => {
        return (
            <div className={FilterModalStyles.filtersList}>
                {tempFilters.map((filter, index) => {
                    const propertyLabel = getFilterableElements().find(prop => prop.key === filter.property)?.label || filter.property;
                    return (
                        <div key={index} className={FilterModalStyles.filterItem}>
                            {`${propertyLabel} ${filter.comparator} ${filter.value}`}
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
