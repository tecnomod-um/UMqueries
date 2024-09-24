import { React, useState } from "react";
import { DropdownMenuItem } from "../Dropdown/dropdown";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import styles from './createNodeItem.module.css';

function CreateNodeItem({ varKey, graph, classURI, selectedNode, edgeLabel, property, isOptional, isFromInstance, addNode, addEdge, colorList }) {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const createNodeItemStyle = {
        backgroundColor: isHovered ? colorList[varKey.toLowerCase()] : "#f9f9f9",
    };

    // On click, add a node of the selected type with the selected edge targeting it.
    const handleAddTargetedNode = (e) => {
        e.stopPropagation();
        const newNode = addNode(varKey.toUpperCase(), null, varKey, true, graph, classURI, false, false);
        addEdge(selectedNode.id, newNode.id, edgeLabel, property, isOptional, isFromInstance);
    }

    return (
        <DropdownMenuItem onClick={handleAddTargetedNode} disableRipple={true} style={{ padding: 0 }}>
            <div className={styles.createNodeItem} style={createNodeItemStyle} onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}>
                <span className={styles.createNodeText}>New {varKey.toUpperCase()}</span>
                <AddCircleOutlineIcon className={styles.createNodeIcon} />
            </div>
        </DropdownMenuItem>
    )
}

export default CreateNodeItem;
