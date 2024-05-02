import React, { useState, useRef, useEffect } from "react";
import ListElementStyles from "./listElement.module.css";
import UriValuesIcon from '@mui/icons-material/Article';
import ValuesItem from "../Dropdown/valuesItem";
import { Dropdown } from "../Dropdown/dropdown";

function darken(color, amount) {
    const hex = color.replace("#", "");
    const rgb = [0, 2, 4].map((idx) => parseInt(hex.slice(idx, idx + 2), 16));
    const newRgb = rgb.map((c) => Math.max(c - Math.round((amount * c) / 100), 0));
    return `#${newRgb.map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

function ListElement({ id, data, type, color, isVar, graph, classURI, addNode, uriList, setUriList }) {
    const [isButtonHovered, setIsButtonHovered] = useState(false);
    const label = isVar ? `${id} variable` : id;
    const ref = useRef(null);
    const inputRef = useRef(null);
    //
    const handleClick = (event) => {
        addNode(id, data, type, isVar, graph, classURI, false, false);
    };

    useEffect(() => {
        if (!inputRef.current)
            inputRef.current = React.createRef();
    }, []);

    const uriListElement = () => {
        return ([<ValuesItem
            inputRef={React.createRef()}
            uriList={uriList}
            selectedNode={null}
            setUriList={setUriList}
            addNode={addNode}
            disabled={false}
            varType={type}
            graph={graph}
            classURI={classURI}
        />])
    }

    return (
        <li
            style={{
                '--color': isButtonHovered ? '#f9f9f9' : color,
                '--shadow-color': isButtonHovered ? 'none' : darken(color, 60),
                backgroundColor: isButtonHovered ? '#f9f9f9' : '',
                boxShadow: isButtonHovered ? 'none' : ''
            }}
            className={ListElementStyles.element}
            onClick={handleClick}
        >
            {isVar && (<span style={{ backgroundColor: color }} className={ListElementStyles.decoration}></span>)}
            <h2>{label}</h2>
            <p>{data}</p>
            {isVar && (
                <Dropdown
                    menu={uriListElement()}
                    uriList={uriList}
                    trigger={
                        <button ref={ref}
                            style={{
                                backgroundColor: isButtonHovered ? darken(color, 20) : color
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className={ListElementStyles.iconButton}
                            onMouseEnter={() => setIsButtonHovered(true)}
                            onMouseLeave={() => setIsButtonHovered(false)}
                        >
                            <UriValuesIcon /> </button>
                    } />
            )}
        </li>
    );
}

export default ListElement;
