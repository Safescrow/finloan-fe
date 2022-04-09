import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { apiGet, apiPut } from "utils/apiHelper";
import MDTypography from "components/MDTypography";
import { Card } from "@mui/material";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import { toast } from "react-toastify";
import MDButton from "components/MDButton";
import MDSelect from "components/MDSelect";

export default function Overview({ applicationId, onClose }) {
  const [application, setApplication] = useState({
    amount: "",
    category: "",
    tenure: "",
    interestRate: "",
    lastPaySlipFile: "",
  });
  const [loading, setLoading] = useState(false);

  const { amount, category, tenure, interestRate, lastPaySlipFile } = application;

  const getApplication = async () => {
    await apiGet(`/application/getApplication?applicationId=${applicationId}`, {}, true).then(
      (res) => {
        setApplication(res.data.data);
      }
    );
  };

  const handleChange = (e) => {
    e.preventDefault();
    const { value, name } = e.target;
    setApplication((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { files, name } = e.target;
    setApplication((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("amount", amount);
    formData.append("category", category);
    formData.append("tenure", tenure);
    formData.append("interestRate", interestRate);
    formData.append("lastPaySlipFile", lastPaySlipFile, lastPaySlipFile.name);
    await apiPut(
      `/application/updateApplication?applicationId=${applicationId}`,
      formData,
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
    getApplication();
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
          Update Application
        </MDTypography>
      </MDBox>
      <MDBox pt={4} pb={3} px={3}>
        <MDBox component="form" role="form" onSubmit={handleSubmit}>
          <MDBox mb={2}>
            <MDInput
              type="number"
              label="Amount"
              name="amount"
              variant="standard"
              value={amount}
              fullWidth
              onChange={handleChange}
              required
            />
          </MDBox>
          <MDBox mb={2}>
            <MDSelect
              label="Category"
              name="category"
              variant="standard"
              value={category}
              fullWidth
              options={[
                { value: "Salary", name: "Salary" },
                { value: "PoliticalAppointment", name: "Political Appointment" },
                { value: "Other", name: "Other" },
              ]}
              onChange={handleChange}
              required
            />
          </MDBox>
          <MDBox mb={2}>
            <MDInput
              type="number"
              label="Tenure"
              name="tenure"
              variant="standard"
              value={tenure}
              fullWidth
              onChange={handleChange}
              required
            />
          </MDBox>
          <MDBox mb={2}>
            <MDInput
              type="number"
              label="Interest Rate"
              name="interestRate"
              variant="standard"
              value={interestRate}
              fullWidth
              onChange={handleChange}
              required
            />
          </MDBox>
          <MDBox mb={2}>
            <MDInput
              type="file"
              label="Last Payslip"
              name="lastPaySlipFile"
              variant="standard"
              fullWidth
              onChange={handleFileChange}
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
