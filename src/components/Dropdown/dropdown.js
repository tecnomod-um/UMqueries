import React, { useState, useRef } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import NestedMenuItem from "./nestedMenuItem";
import styles from "./dropdown.module.css";

// Dropdown component used throughout the application
export function Dropdown({ trigger, menu, keepopen: keepOpenGlobal, isOpen: controlledIsOpen, onOpen: onControlledOpen, minWidth }) {

    const [isInternalOpen, setInternalOpen] = useState(null);
    const isOpen = controlledIsOpen || isInternalOpen;
    const anchorRef = useRef(null);

    const handleOpen = (event) => {
        event.stopPropagation();
        if (menu.length)
            onControlledOpen ? onControlledOpen(event.currentTarget) : setInternalOpen(event.currentTarget);
    }

    const handleClose = (event) => {
        event.stopPropagation();
        if (anchorRef.current && (anchorRef.current === event.target || anchorRef.current.contains(event.target)))
            return;

        handleForceClose();
    }

    const handleForceClose = () => {
        onControlledOpen ? onControlledOpen(null) : setInternalOpen(null);
    }

    const renderMenu = (menuItem, index) => {
        const { keepopen: keepOpenLocal, ...props } = menuItem.props;
        let extraProps = {};

        if (props.menu) {
            extraProps = {
                parentMenuOpen: isOpen,
            };
        }

        return React.createElement(menuItem.type, {
            ...props,
            key: index,
            ...extraProps,
            onClick: (event) => {
                if (menuItem.props.preventCloseOnClick)
                    event.stopPropagation();
                if (!keepOpenGlobal && !keepOpenLocal && !menuItem.props.preventCloseOnClick)
                    handleClose(event);
                if (menuItem.props.onClick)
                    menuItem.props.onClick(event);
            },
            children: props.menu ? React.Children.map(props.menu, renderMenu) : props.children,
        });
    }

    return (
        <>
            {React.cloneElement(trigger, {
                onClick: isOpen ? handleForceClose : handleOpen,
                ref: anchorRef,
            })}
            <Menu PaperProps={{ sx: { minWidth: minWidth ?? 0 } }} anchorEl={isOpen} open={!!isOpen} onClose={handleClose}>
                {React.Children.map(menu, renderMenu)}
            </Menu>
        </>
    );
}

export const DropdownMenuItem = (props) => {
    const { disableRipple, preventCloseOnClick, ...otherProps } = props;

    const handleClick = (event) => {
        if (preventCloseOnClick)
            event.stopPropagation();
        if (props.onClick)
            props.onClick(event);
    }

    return (
        <MenuItem
            {...otherProps}
            disableRipple={disableRipple}
            onClick={handleClick}
            className={styles.dropdown}
        />
    );
}

export const DropdownNestedMenuItem = (props) => {
    const { preventCloseOnClick, ...otherProps } = props;

    const handleClick = (event) => {
        if (preventCloseOnClick)
            event.stopPropagation();
        if (props.onClick)
            props.onClick(event);
    }

    return (
        <NestedMenuItem
            {...otherProps}
            onClick={handleClick}
            className={styles.dropdown}
        />
    );
}
