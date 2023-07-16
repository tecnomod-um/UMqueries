import React, { useState, useRef } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import NestedMenuItem from "./nestedMenuItem";
import styles from "./dropdown.module.css";

// Dropdown component used throughout the application
export function Dropdown({
    trigger,
    menu,
    keepopen: keepOpenGlobal,
    isOpen: controlledIsOpen,
    onOpen: onControlledOpen,
    minWidth,
}) {
    const [isInternalOpen, setInternalOpen] = useState(null);
    const isOpen = controlledIsOpen || isInternalOpen;
    const anchorRef = useRef(null);

    const handleOpen = (event) => {
        event.stopPropagation();
        if (menu.length) {
            onControlledOpen ? onControlledOpen(event.currentTarget) : setInternalOpen(event.currentTarget);
        }
    };

    const handleClose = (event) => {
        event.stopPropagation();
        if ((anchorRef.current && anchorRef.current.contains(event.target)) || event.target.closest("#preventCloseDropdownItem")) {
            return;
        }
        handleForceClose();
    };

    const handleForceClose = () => {
        onControlledOpen ? onControlledOpen(null) : setInternalOpen(null);
    };

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
                event.stopPropagation();

                if (!keepOpenGlobal && !keepOpenLocal) {
                    handleClose(event);
                }

                if (menuItem.props.onClick) {
                    menuItem.props.onClick(event);
                }
            },
            children: props.menu ? React.Children.map(props.menu, renderMenu) : props.children,
        });
    };

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

export const DropdownMenuItem = (props) => <MenuItem {...props} className={styles.dropdown} />;

export const DropdownNestedMenuItem = (props) => <NestedMenuItem {...props} className={styles.dropdown} />;
