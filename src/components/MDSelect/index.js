import { MenuItem, InputLabel } from "@mui/material";
import PropTypes from "prop-types";
import React, { forwardRef } from "react";
import MDSelectRoot from "./MDSelectRoot";

const MDSelect = forwardRef(
  ({ error, success, disabled, options, label, placeholder, ...rest }, ref) => (
    <>
      <InputLabel>{label}</InputLabel>
      <MDSelectRoot {...rest} ref={ref} defaultValue="" ownerState={{ error, success, disabled }}>
        <MenuItem value="" disabled>
          {placeholder}
        </MenuItem>
        {options.map((opt) => (
          <MenuItem key={opt.name} value={opt.value}>
            {opt.name}
          </MenuItem>
        ))}
      </MDSelectRoot>
    </>
  )
);

// Setting default values for the props of MDInput
MDSelect.defaultProps = {
  error: false,
  success: false,
  disabled: false,
  options: [],
  label: "",
  placeholder: "Select",
};

// Typechecking props for the MDInput
MDSelect.propTypes = {
  error: PropTypes.bool,
  success: PropTypes.bool,
  disabled: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
  label: PropTypes.string,
  placeholder: PropTypes.string,
};

export default MDSelect;
