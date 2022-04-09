import { Grid } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { apiPut } from "utils/apiHelper";
import { useNavigate, useParams } from "react-router-dom";

export default function index() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [formDetails, setFormDetails] = useState({
    firstName: "",
    lastName: "",
    placeOfWork: "",
    designation: "",
    phoneNumber: "",
    address: "",
  });

  const navigate = useNavigate();

  const { firstName, lastName, placeOfWork, designation, phoneNumber, address } = formDetails;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await apiPut(`/application/updateGuarantor?applicationId=${id}`, formDetails, {}, true).then(
      (res) => {
        toast.success(res.data.message);
        navigate(`/applications/${id}`);
      },
      (err) => {
        toast.error(err.response.data.message);
        setLoading(false);
      }
    );
  };

  return (
    <MDBox component="form" role="form" onSubmit={handleSubmit}>
      <MDTypography>Guarantor Details</MDTypography>
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
              type="text"
              label="Place of Work"
              name="placeOfWork"
              variant="standard"
              value={placeOfWork}
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
              label="Designation"
              name="designation"
              variant="standard"
              value={designation}
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
              type="text"
              label="Address"
              name="address"
              variant="standard"
              value={address}
              fullWidth
              onChange={handleChange}
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
