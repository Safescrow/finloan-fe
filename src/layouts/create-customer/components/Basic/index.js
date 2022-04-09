import { Grid } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { apiPost } from "utils/apiHelper";
import { useNavigate } from "react-router-dom";

export default function index() {
  const [loading, setLoading] = useState(false);
  const [formDetails, setFormDetails] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    passportUrlFile: "",
  });

  const navigate = useNavigate();

  const { firstName, middleName, lastName, email, phoneNumber, passportUrlFile } = formDetails;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { files, name } = e.target;
    setFormDetails((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("middleName", middleName);
    formData.append("phoneNumber", phoneNumber);
    formData.append("passportUrlFile", passportUrlFile, passportUrlFile.name);
    await apiPost("/customer/createCustomer", formData, {}, true).then(
      (res) => {
        toast.success(res.data.message);
        navigate(`/customers/new-customer/${res.data.data.id}/data`);
      },
      (err) => {
        toast.error(err.response.data.message);
      }
    );
  };

  return (
    <MDBox component="form" role="form" onSubmit={handleSubmit}>
      <MDTypography>Customer Details</MDTypography>
      <Grid container spacing={2}>
        <Grid item md={6}>
          <MDBox mb={2}>
            <MDInput
              type="text"
              label="First Name"
              name="firstName"
              variant="standard"
              value={firstName}
              fullWidth
              onChange={handleChange}
              required
            />
          </MDBox>
        </Grid>
        <Grid item md={6}>
          <MDBox mb={2}>
            <MDInput
              type="text"
              label="Middle Name"
              name="middleName"
              variant="standard"
              value={middleName}
              fullWidth
              onChange={handleChange}
            />
          </MDBox>
        </Grid>
        <Grid item md={6}>
          <MDBox mb={2}>
            <MDInput
              type="text"
              label="Last Name"
              name="lastName"
              variant="standard"
              value={lastName}
              fullWidth
              onChange={handleChange}
              required
            />
          </MDBox>
        </Grid>
        <Grid item md={6}>
          <MDBox mb={2}>
            <MDInput
              type="email"
              label="Email"
              name="email"
              variant="standard"
              value={email}
              fullWidth
              onChange={handleChange}
              required
            />
          </MDBox>
        </Grid>
        <Grid item md={6}>
          <MDBox mb={2}>
            <MDInput
              type="tel"
              label="Phone Number"
              name="phoneNumber"
              variant="standard"
              value={phoneNumber}
              fullWidth
              onChange={handleChange}
              required
            />
          </MDBox>
        </Grid>
        <Grid item md={6}>
          <MDBox mb={2}>
            <MDInput
              type="file"
              label="Passport Photograph"
              name="passportUrlFile"
              variant="standard"
              fullWidth
              onChange={handleFileChange}
              required
            />
          </MDBox>
        </Grid>
      </Grid>
      <MDBox mt={4} mb={1}>
        <MDButton variant="gradient" type="submit" color="info" fullWidth>
          {loading ? "please wait..." : "Save"}
        </MDButton>
      </MDBox>
    </MDBox>
  );
}
