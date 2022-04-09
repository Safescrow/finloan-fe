import { Grid } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { apiPut } from "utils/apiHelper";
import { useNavigate, useParams } from "react-router-dom";
import MDSelect from "components/MDSelect";
import states from "assets/ng.states.json";

export default function index() {
  const [loading, setLoading] = useState(false);
  const [formDetails, setFormDetails] = useState({
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    homeTown: "",
    stateOfOrigin: "",
    localGovernmentArea: "",
    address: "",
    city: "",
    state: "",
  });

  const [lgas, setLgas] = useState([]);

  const navigate = useNavigate();

  const { id } = useParams();

  const {
    dateOfBirth,
    gender,
    maritalStatus,
    homeTown,
    stateOfOrigin,
    localGovernmentArea,
    address,
    city,
    state,
  } = formDetails;

  const changeLga = (s) => {
    const currentState = states.states.find((st) => st.name === s);
    setLgas(currentState.local_government_areas);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await apiPut(`/customer/updateCustomerData?customerId=${id}`, formDetails, {}, true).then(
      (res) => {
        toast.success(res.data.message);
        navigate(`/customers/new-customer/${id}/employment`);
      },
      (err) => {
        toast.error(err.response.data.message);
      }
    );
  };

  const stateList = states.states.map((s) => ({
    name: s.name,
    value: s.name,
  }));

  const lgaList = lgas.map((lga) => ({
    name: lga.name,
    value: lga.name,
  }));

  return (
    <MDBox component="form" role="form" onSubmit={handleSubmit}>
      <MDTypography>Customer Data</MDTypography>
      <Grid container spacing={2}>
        <Grid item md={6}>
          <MDBox mb={2}>
            <MDInput
              type="date"
              label="Date of Birth"
              name="dateOfBirth"
              variant="standard"
              value={dateOfBirth}
              fullWidth
              onChange={handleChange}
              required
            />
          </MDBox>
        </Grid>
        <Grid item md={6}>
          <MDBox mb={2}>
            <MDSelect
              label="Gender"
              name="gender"
              value={gender}
              fullWidth
              onChange={handleChange}
              required
              variant="standard"
              options={[
                { name: "Male", value: "Male" },
                { name: "Female", value: "Female" },
              ]}
            />
          </MDBox>
        </Grid>
        <Grid item md={6}>
          <MDBox mb={2}>
            <MDSelect
              name="maritalStatus"
              onChange={handleChange}
              value={maritalStatus}
              variant="standard"
              label="Marital Status"
              options={[
                { name: "Single", value: "Single" },
                { name: "Married", value: "Married" },
                { name: "Divorced", value: "Divorced" },
                { name: "Widowed", value: "Widowed" },
              ]}
              fullWidth
              required
            />
          </MDBox>
        </Grid>
        <Grid item md={6}>
          <MDBox mb={2}>
            <MDInput
              type="text"
              label="Home Town"
              name="homeTown"
              variant="standard"
              value={homeTown}
              fullWidth
              onChange={handleChange}
              required
            />
          </MDBox>
        </Grid>
        <Grid item md={6}>
          <MDBox mb={2}>
            <MDSelect
              name="stateOfOrigin"
              value={stateOfOrigin}
              variant="standard"
              onChange={(e) => {
                handleChange(e);
                changeLga(e.target.value);
              }}
              label="State Of Origin"
              options={stateList}
              fullWidth
              required
            />
          </MDBox>
        </Grid>
        <Grid item md={6}>
          <MDBox mb={2}>
            <MDSelect
              name="localGovernmentArea"
              value={localGovernmentArea}
              variant="standard"
              onChange={handleChange}
              label="Local Government Area"
              options={lgaList}
              fullWidth
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
        <Grid item md={6}>
          <MDBox mb={2}>
            <MDInput
              type="text"
              label="City"
              name="city"
              variant="standard"
              value={city}
              fullWidth
              onChange={handleChange}
              required
            />
          </MDBox>
        </Grid>
        <Grid item md={6}>
          <MDBox mb={2}>
            <MDSelect
              name="state"
              value={state}
              variant="standard"
              onChange={handleChange}
              label="State"
              options={stateList}
              fullWidth
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
