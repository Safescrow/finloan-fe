import React, { useState } from "react";
import PropTypes from "prop-types";
import Papa from "papaparse";
import { apiPost } from "utils/apiHelper";
import MDTypography from "components/MDTypography";
import { Card } from "@mui/material";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import { toast } from "react-toastify";
import MDButton from "components/MDButton";

export default function Overview({ onClose }) {
  const [paymentDetails, setPaymentDetails] = useState({
    transactionRef: "",
    transactionDate: "",
    amount: "",
    month: "",
    year: "",
    schedule: [],
  });
  const [loading, setLoading] = useState(false);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getMonth = (date) => months[new Date(date).getMonth()];

  const getYear = (date) => new Date(date).getFullYear();

  const generateJson = (file) => {
    Papa.parse(file, {
      header: true,
      complete: (res) =>
        setPaymentDetails((prev) => ({
          ...prev,
          schedule: res.data,
        })),
    });
  };

  const handleChange = (e) => {
    e.preventDefault();
    const { value, name } = e.target;
    setPaymentDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await apiPost("/loan/batch-payment", paymentDetails, {}, true).then(
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
          Batch Loan Payment
        </MDTypography>
      </MDBox>
      <MDBox pt={4} pb={3} px={3}>
        <MDBox component="form" role="form" onSubmit={handleSubmit}>
          <MDBox mb={2}>
            <MDInput
              type="number"
              label="Batch Total Amount"
              name="amount"
              variant="standard"
              value={paymentDetails.amount}
              fullWidth
              onChange={handleChange}
              required
            />
          </MDBox>
          <MDBox mb={2}>
            <MDInput
              type="month"
              label="Schedule Period"
              name="schedulePeriod"
              variant="standard"
              value={paymentDetails.schedulePeriod}
              fullWidth
              onChange={(e) =>
                setPaymentDetails((prev) => ({
                  ...prev,
                  month: getMonth(e.target.value),
                  year: getYear(e.target.value),
                }))
              }
              required
            />
          </MDBox>
          <MDBox mb={2}>
            <MDInput
              type="date"
              label="Transaction Date"
              name="transactionDate"
              variant="standard"
              value={paymentDetails.transactionDate}
              fullWidth
              onChange={handleChange}
              required
            />
          </MDBox>
          <MDBox mb={2}>
            <MDInput
              type="text"
              label="Transaction Ref"
              name="transactionRef"
              variant="standard"
              value={paymentDetails.transactionRef}
              fullWidth
              onChange={handleChange}
              required
            />
          </MDBox>
          <MDBox mb={2}>
            <MDInput
              type="file"
              accept=".csv,.xlsx,.xls"
              label="Schedule File"
              name="scheduleFile"
              variant="standard"
              value={paymentDetails.scheduleFile}
              fullWidth
              onChange={(e) => generateJson(e.target.files[0])}
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
  onClose: PropTypes.func.isRequired,
};
