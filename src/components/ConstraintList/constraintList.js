import React from 'react';
import ConstraintListStyles from "./constraintList.module.css";
import Constraint from '../Constraint/constraint';

function ConstraintList({ filteredGenes, filteredProteins, filteredCRMs, filteredTADs, filteredOmims, filteredGOs, filteredMIs, addNode }) {
    function getCodeFromURI(element) {
        return element.uri.substring(element.uri.lastIndexOf('/') + 1);
    }
    const geneConstraintList = filteredGenes.map(element => <Constraint key={getCodeFromURI(element)} id={getCodeFromURI(element)} data={element.uri} type={"gene"} addNode={addNode} />);
    const proteinConstraintList = filteredProteins.map(element => <Constraint key={getCodeFromURI(element)} id={getCodeFromURI(element)} data={element.uri} type={"protein"} addNode={addNode} />);
    const crmConstraintList = filteredCRMs.map(element => <Constraint key={getCodeFromURI(element)} id={getCodeFromURI(element)} data={element.uri} type={"crm"} addNode={addNode} />);
    const tadConstraintList = filteredTADs.map(element => <Constraint key={getCodeFromURI(element)} id={getCodeFromURI(element)} data={element.uri} type={"tad"} addNode={addNode} />);
    const omimConstraintList = filteredOmims.map(element => <Constraint key={getCodeFromURI(element)} id={getCodeFromURI(element)} data={element.uri} type={"omim"} addNode={addNode} />);
    const goConstraintList = filteredGOs.map(element => <Constraint key={getCodeFromURI(element)} id={getCodeFromURI(element)} data={element.uri} type={"go"} addNode={addNode} />);
    const miConstraintList = filteredMIs.map(element => <Constraint key={getCodeFromURI(element)} id={getCodeFromURI(element)} data={element.uri} type={"mi"} addNode={addNode} />);
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
