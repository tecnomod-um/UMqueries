import React from 'react';
import ScrollStyles from "./scroll.module.css"

const Scroll = (props) => {
    return (
        <div className={ScrollStyles.scroll} style={{ overflowY: 'scroll', height: '70vh' }}>
            {props.children}
        </div>
    );
}

export default Scroll;