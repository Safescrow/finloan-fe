import { Icon, Menu, MenuItem } from "@mui/material";
import MDTypography from "components/MDTypography";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

export default function ListMenu({ id }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const openMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };
  return (
    <div>
      <MDTypography
        component="a"
        href="#"
        color="text"
        id="menu-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={openMenu}
      >
        <Icon>more_vert</Icon>
      </MDTypography>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={closeMenu}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem component={Link} to={`/customers/${id}`}>
          View
        </MenuItem>
        <MenuItem component={Link} to={`/applications/new?customerId=${id}`}>
          New Application
        </MenuItem>
      </Menu>
    </div>
  );
}

ListMenu.propTypes = {
  id: PropTypes.string.isRequired,
};
