import { Card } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDSelect from "components/MDSelect";
import MDTypography from "components/MDTypography";
import React, { useState } from "react";
import PropTypes from "prop-types";
import { apiPost } from "utils/apiHelper";
import { toast } from "react-toastify";

export default function NewUser({ onClose }) {
  const [formDetails, setFormDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    apiPost("/account/createUser", formDetails, {}, true).then(
      (response) => {
        toast.success(response.data.message);
        setLoading(false);
        onClose();
      },
      (err) => {
        toast.error(err.response.data.message);
        setLoading(false);
      }
    );
  };

  return (
    <div>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Create New User
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" onSubmit={handleSubmit} role="form">
            <MDBox mb={2}>
              <MDInput
                type="text"
                name="firstName"
                value={formDetails.firstName}
                label="First Name"
                variant="standard"
                fullWidth
                onChange={handleChange}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="text"
                name="lastName"
                value={formDetails.lastName}
                label="Last Name"
                variant="standard"
                fullWidth
                onChange={handleChange}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="email"
                name="email"
                value={formDetails.email}
                label="Email"
                variant="standard"
                fullWidth
                onChange={handleChange}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="tel"
                name="phoneNumber"
                value={formDetails.phoneNumber}
                label="Phone Number"
                variant="standard"
                fullWidth
                onChange={handleChange}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDSelect
                name="role"
                value={formDetails.role}
                label="Role"
                variant="standard"
                options={[
                  { value: "Manager", name: "Manager" },
                  { value: "LineManager", name: "Line Manager" },
                  { value: "Admin", name: "Regular Staff" },
                ]}
                fullWidth
                onChange={handleChange}
              />
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" type="submit" color="info" fullWidth>
                {loading ? "please wait..." : "save"}
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </div>
  );
}

NewUser.propTypes = {
  onClose: PropTypes.func.isRequired,
};
