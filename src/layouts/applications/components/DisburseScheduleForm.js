import { Card } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import React, { useState } from "react";
import PropTypes from "prop-types";
import { apiGet } from "utils/apiHelper";
import { toast } from "react-toastify";
import { useJsonToCsv } from "react-json-csv";

export default function DisburseScheduleForm({ onClose }) {
  const [formDetails, setFormDetails] = useState({
    commencementDate: "",
  });
  const [loading, setLoading] = useState(false);
  const { saveAsCsv } = useJsonToCsv();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDetails((prev) => ({ ...prev, [name]: value }));
  };

  const fields = {
    fullname: "Fullname",
    bankName: "Bank Name",
    accountNumber: "Account Number",
    amount: "Amount",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await apiGet(
      `/loan/disburse-schedule?commencementDate=${formDetails.commencementDate}`,
      {},
      true
    ).then(
      (res) => {
        saveAsCsv({
          data: res.data.data,
          fields,
          filename: `Disbursement-Schedule-${formDetails.commencementDate}`,
        });
        toast.success(res.data.message, { position: "top-right" });
        onClose();
      },
      (err) => {
        toast.error(err.response.message, { position: "top-right" });
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
            Generate Disburse Schedule
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" onSubmit={handleSubmit} role="form">
            <MDBox mb={2}>
              <MDInput
                type="date"
                name="commencementDate"
                value={formDetails.commencementDate}
                label="Commencement Date"
                variant="standard"
                fullWidth
                onChange={handleChange}
              />
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" type="submit" color="info" fullWidth>
                {loading ? "please wait..." : "download"}
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </div>
  );
}

DisburseScheduleForm.propTypes = {
  onClose: PropTypes.func.isRequired,
};
