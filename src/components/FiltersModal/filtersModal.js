import React, { useState } from "react";
import ModalWrapper from '../ModalWrapper/modalWrapper';
import FilterModalStyles from "./filtersModal.module.css";
import CloseIcon from "@mui/icons-material/Close";

// Modal used in filter definitions
function FiltersModal({ allNodes, bindings, filters, isFiltersOpen, setFiltersOpen, setFilters }) {

    const [tempFilters, setTempFilters] = useState([]);

    const handleClose = () => {
        setFiltersOpen(false);
    }

    /*
    const handleSubmit = () => {
        setFilters([tempFilters]);
        handleClose();
    }
    */
    return (
        <ModalWrapper isOpen={isFiltersOpen} closeModal={handleClose} maxWidth={1500}>
            <div className={FilterModalStyles.modalHeader}>
                <h2 title={"Bindings and variables"}>Filters</h2>
            </div>
            <button className={FilterModalStyles.closeBtn} onClick={handleClose}>
                <CloseIcon style={{ color: 'white', marginBottom: "-7px" }} />
            </button>
            <div>
            </div>
        </ModalWrapper>
    );
}

export default FiltersModal;
