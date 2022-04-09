import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { apiGet, apiPut } from "utils/apiHelper";
import MDTypography from "components/MDTypography";
import MDSelect from "components/MDSelect";
import { Card } from "@mui/material";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import states from "assets/ng.states.json";
import { toast } from "react-toastify";
import MDButton from "components/MDButton";
import dayjs from "dayjs";

export default function Overview({ id, onClose }) {
  const [customerData, setCustomerData] = useState({
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
  const [loading, setLoading] = useState(false);

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
  } = customerData;

  const changeLga = (s) => {
    const currentState = states.states.find((st) => st.name === s);
    setLgas(currentState.local_government_areas);
  };

  const getCustomer = async () => {
    await apiGet(`/customer/getCustomerData?customerId=${id}`, {}, true).then((res) => {
      changeLga(res.data.data.stateOfOrigin);
      setCustomerData(res.data.data);
    });
  };

  const handleChange = (e) => {
    e.preventDefault();
    const { value, name } = e.target;
    setCustomerData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await apiPut(`/customer/updateCustomerData?customerId=${id}`, customerData, {}, true).then(
      (res) => {
        toast.success(res.data.message, { position: "top-right" });
        onClose();
      },
      (err) => {
        toast.error(err.response.message, { position: "top-right" });
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    getCustomer();
  }, []);

  const stateList = states.states.map((s) => ({
    name: s.name,
    value: s.name,
  }));

  const lgaList = lgas.map((lga) => ({
    name: lga.name,
    value: lga.name,
  }));

  return (
    <Card>
      <MDBox
        variant="gradient"
        bgColor="info"
        borderRadius="lg"
        coloredShadow="success"
        mx={2}
        mt={-3}
        p={3}
        mb={1}
        textAlign="center"
      >
        <MDTypography variant="h4" fontWeight="medium" color="white" mt={1} id="modal-modal-title">
          Update Customer Data
        </MDTypography>
      </MDBox>
      <MDBox pt={4} pb={3} px={3}>
        <MDBox component="form" role="form" onSubmit={handleSubmit}>
          <MDBox mb={2}>
            <MDInput
              type="date"
              label="Date of Birth"
              name="dateOfBirth"
              variant="standard"
              value={dayjs(dateOfBirth).format("YYYY-MM-DD")}
              fullWidth
              onChange={handleChange}
            />
          </MDBox>
          <MDBox mb={2}>
            <MDSelect
              name="gender"
              onChange={handleChange}
              value={gender}
              variant="standard"
              label="Gender"
              options={[
                { name: "Male", value: "Male" },
                { name: "Female", value: "Female" },
              ]}
              fullWidth
            />
          </MDBox>
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
            />
          </MDBox>
          <MDBox mb={2}>
            <MDInput
              type="text"
              label="Home Town"
              name="homeTown"
              variant="standard"
              value={homeTown}
              fullWidth
              onChange={handleChange}
            />
          </MDBox>
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
            />
          </MDBox>
          <MDBox mb={2}>
            <MDSelect
              name="localGovernmentArea"
              value={localGovernmentArea}
              variant="standard"
              onChange={handleChange}
              label="Local Government Area"
              options={lgaList}
              fullWidth
            />
          </MDBox>
          <MDBox mb={2}>
            <MDInput
              type="text"
              label="Address"
              name="address"
              variant="standard"
              value={address}
              fullWidth
              onChange={handleChange}
            />
          </MDBox>
          <MDBox mb={2}>
            <MDInput
              type="text"
              label="City"
              name="city"
              variant="standard"
              value={city}
              fullWidth
              onChange={handleChange}
            />
          </MDBox>
          <MDBox mb={2}>
            <MDSelect
              name="state"
              value={state}
              variant="standard"
              onChange={handleChange}
              label="State"
              options={stateList}
              fullWidth
            />
          </MDBox>
          <MDBox mt={4} mb={1}>
            <MDButton variant="gradient" type="submit" color="info" fullWidth>
              {loading ? "please wait..." : "Submit"}
            </MDButton>
          </MDBox>
        </MDBox>
      </MDBox>
    </Card>
  );
}

Overview.propTypes = {
  id: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
