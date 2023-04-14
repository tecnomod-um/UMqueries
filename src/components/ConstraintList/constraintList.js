import React from 'react';
import ConstraintListStyles from "./constraintList.module.css";
import Constraint from '../Constraint/constraint';

function ConstraintList({ filteredGenes, filteredProteins, filteredCRMs, filteredTADs, filteredOmims, filteredGOs, filteredMIs, addNode }) {
    const geneConstraintList = filteredGenes.map(element => <Constraint id={element.id} data={element.uri} type={"gene"} addNode={addNode} />);
    const proteinConstraintList = filteredProteins.map(element => <Constraint id={element.id} data={element.uri} type={"protein"} addNode={addNode} />);
    const crmConstraintList = filteredCRMs.map(element => <Constraint id={element.id} data={element.uri} type={"crm"} addNode={addNode} />);
    const tadConstraintList = filteredTADs.map(element => <Constraint id={element.id} data={element.uri} type={"tad"} addNode={addNode} />);
    const omimConstraintList = filteredOmims.map(element => <Constraint id={element.id} data={element.uri} type={"omim"} addNode={addNode} />);
    const goConstraintList = filteredGOs.map(element => <Constraint id={element.id} data={element.uri} type={"go"} addNode={addNode} />);
    const miConstraintList = filteredMIs.map(element => <Constraint id={element.id} data={element.uri} type={"mi"} addNode={addNode} />);
    return (
        <ul>
            {geneConstraintList}
            {proteinConstraintList}
            {crmConstraintList}
            {tadConstraintList}
            {omimConstraintList}
            {goConstraintList}
            {miConstraintList}
        </ul>
    );
}

export default ConstraintList;
