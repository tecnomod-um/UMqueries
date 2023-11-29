import React, { useState, useRef } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

const NestedMenuItem = React.forwardRef((props, ref) => {
  const {
    parentMenuOpen,
    label,
    rightIcon = <ArrowRightIcon style={{ fontSize: 16 }} />,
    keepopen,
    children,
    customTheme,
    className,
    tabIndex,
    containerProps: { ref: containerRefProp, ...ContainerProps } = {},
    rightAnchored,
    ...menuItemProps
  } = props;

  const menuItemRef = useRef(null);
  const containerRef = useRef(null);
  const menuContainerRef = useRef(null);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  React.useImperativeHandle(ref, () => menuItemRef.current);
  React.useImperativeHandle(containerRefProp, () => containerRef.current);

  const handleMouseEnter = (event) => {
    setIsSubMenuOpen(true);

    if (ContainerProps.onMouseEnter)
      ContainerProps.onMouseEnter(event);
  }

  const handleMouseLeave = (event) => {
    setIsSubMenuOpen(false);

    if (ContainerProps.onMouseLeave)
      ContainerProps.onMouseLeave(event);
  }

  const isSubmenuFocused = () => {
    const active = containerRef.current?.ownerDocument?.activeElement;
    return Array.from(menuContainerRef.current?.children || []).includes(active);
  }

  const handleFocus = (event) => {
    if (event.target === containerRef.current)
      setIsSubMenuOpen(true);
    if (ContainerProps.onFocus)
      ContainerProps.onFocus(event);
  }

  const handleKeyDown = (event) => {
    if (event.key === "Escape")
      return;
    if (isSubmenuFocused())
      event.stopPropagation();
    const active = containerRef.current?.ownerDocument?.activeElement;

    if (event.key === "ArrowLeft" && isSubmenuFocused())
      containerRef.current?.focus();
    if (
      event.key === "ArrowRight" &&
      event.target === containerRef.current &&
      event.target === active
    ) {
      const firstChild = menuContainerRef.current?.children[0];
      firstChild?.focus();
    }
  }

  const open = isSubMenuOpen && parentMenuOpen;

  return (
    <div
      {...ContainerProps}
      ref={containerRef}
      onFocus={handleFocus}
      tabIndex={tabIndex !== undefined ? tabIndex : -1}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
    >
      <MenuItem
        {...menuItemProps}
        data-open={!!open || undefined}
        className={className}
        ref={menuItemRef}
        keepopen={keepopen}
      >
        {label}
        <div style={{ flexGrow: 1 }} />
        {rightIcon}
      </MenuItem>
      <Menu
        hideBackdrop
        style={{ pointerEvents: "none" }}
        anchorEl={menuItemRef.current}
        anchorOrigin={{
          vertical: "top",
          horizontal: rightAnchored ? "left" : "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: rightAnchored ? "right" : "left",
        }}
        css={customTheme}
        open={!!open}
        autoFocus={false}
        disableAutoFocus
        disableEnforceFocus
        onClose={() => {
          setIsSubMenuOpen(false);
        }}
      >
        <div ref={menuContainerRef} style={{ pointerEvents: "auto" }}>
          {children}
        </div>
      </Menu>
    </div>
  );
});

export default NestedMenuItem;
