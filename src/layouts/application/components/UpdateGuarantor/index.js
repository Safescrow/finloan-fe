import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { apiGet, apiPut } from "utils/apiHelper";
import MDTypography from "components/MDTypography";
import { Card } from "@mui/material";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import { toast } from "react-toastify";
import MDButton from "components/MDButton";

export default function Overview({ applicationId, onClose }) {
  const [guarantor, setGuarantor] = useState({
    firstName: "",
    lastName: "",
    placeOfWork: "",
    designation: "",
    phoneNumber: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  // const { firstName, lastName, placeOfWork, designation, phoneNumber, address } = guarantor;

  const getGuarantor = async () => {
    await apiGet(`/application/getApplication?applicationId=${applicationId}`, {}, true).then(
      (res) => {
        setGuarantor(res.data.data.guarantor);
      }
    );
  };

  const handleChange = (e) => {
    e.preventDefault();
    const { value, name } = e.target;
    setGuarantor((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await apiPut(
      `/application/updateGuarantor?applicationId=${applicationId}`,
      guarantor,
      {},
      true
    ).then(
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
    getGuarantor();
  }, []);

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
          Update Guarantor
        </MDTypography>
      </MDBox>
      <MDBox pt={4} pb={3} px={3}>
        <MDBox component="form" role="form" onSubmit={handleSubmit}>
          <MDBox mb={2}>
            <MDInput
              type="text"
              label="First Name"
              name="firstName"
              variant="standard"
              value={guarantor?.firstName}
              fullWidth
              onChange={handleChange}
              required
            />
          </MDBox>
          <MDBox mb={2}>
            <MDInput
              type="text"
              label="Last Name"
              name="lastName"
              variant="standard"
              value={guarantor?.lastName}
              fullWidth
              onChange={handleChange}
              required
            />
          </MDBox>
          <MDBox mb={2}>
            <MDInput
              type="text"
              label="Place of Work"
              name="placeOfWork"
              variant="standard"
              value={guarantor?.placeOfWork}
              fullWidth
              onChange={handleChange}
              required
            />
          </MDBox>
          <MDBox mb={2}>
            <MDInput
              type="text"
              label="Designation"
              name="designation"
              variant="standard"
              value={guarantor?.designation}
              fullWidth
              onChange={handleChange}
              required
            />
          </MDBox>
          <MDBox mb={2}>
            <MDInput
              type="tel"
              label="Phone Number"
              name="phoneNumber"
              variant="standard"
              value={guarantor?.phoneNumber}
              fullWidth
              onChange={handleChange}
              required
            />
          </MDBox>
          <MDBox mb={2}>
            <MDInput
              type="text"
              label="Address"
              name="address"
              variant="standard"
              value={guarantor?.address}
              fullWidth
              onChange={handleChange}
              required
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
  applicationId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
