import React from "react";
import { DropdownMenuItem } from "../Dropdown/dropdown";
import ValuesItemStyles from "./valuesItem.module.css";
import DeleteIcon from '@mui/icons-material/RemoveCircleOutline';
import AddIcon from '@mui/icons-material/Add';

// Dropdown option that allows to build an URI values list for a property
function ValuesItem({ inputRef, uriList, selectedNode, label, property, isOptional, setUriList, addNode, addEdge }) {
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const contents = inputRef?.current?.value;
            if (contents) {
                setUriList(oldList => [...oldList, contents]);
                inputRef.current.value = '';
            }
        }
    }

    return (
        <DropdownMenuItem id="preventCloseDropdownItem" tabIndex={-1}><div className={ValuesItemStyles.uriContainer}>
            {uriList.length > 0 && (
                <div className={ValuesItemStyles.uriList}>
                    {uriList.map((uri, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <p onClick={event => event.stopPropagation()}>{uri}</p>
                            <DeleteIcon sx={{ color: 'darkgray' }} onClick={(event) => {
                                event.stopPropagation();
                                const newUriList = [...uriList];
                                newUriList.splice(index, 1);
                                setUriList(newUriList);
                            }} />
                        </div>
                    ))}
                </div>
            )}
            <div className={ValuesItemStyles.inputContainer}>
                <div className={ValuesItemStyles.uriAddButton} onClick={(event) => {
                    event.stopPropagation();
                    const contents = inputRef?.current?.value;
                    if (contents) {
                        setUriList(oldList => [...oldList, contents]);
                        inputRef.current.value = '';
                    }
                }}>
                    <span className={ValuesItemStyles.space}>&nbsp;</span><AddIcon sx={{ color: 'darkgray' }} />
                </div>
                <input
                    className={ValuesItemStyles.uriTextBox}
                    type="text"
                    placeholder="Enter URI"
                    ref={inputRef}
                    id={`inputUri+${label}`}
                    onFocus={(e) => { e.stopPropagation(); e.preventDefault(); }}
                    onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
                    onKeyDown={handleKeyDown}
                />
                <button className={ValuesItemStyles.uriButton} onClick={(event) => {
                    if (uriList.length > 0) {
                        const uriId = addNode(uriList.join('\n'), uriList, 'uri', false, '', uriList, true).id;
                        addEdge(selectedNode.id, uriId, label, property, isOptional);
                        setUriList([]);
                    }
                }}>OK</button>
            </div>
        </div>
        </DropdownMenuItem>);
}

export default ValuesItem;
