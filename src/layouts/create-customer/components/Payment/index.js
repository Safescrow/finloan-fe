import { Grid } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { apiPut, paystackGet } from "utils/apiHelper";
import { useNavigate, useParams } from "react-router-dom";
import MDSelect from "components/MDSelect";

export default function index() {
  const [loading, setLoading] = useState(false);
  const [formDetails, setFormDetails] = useState({
    bankName: "",
    accountNumber: "",
  });

  const { id } = useParams();

  const navigate = useNavigate();

  const { bankName, accountNumber } = formDetails;

  const [banks, setBanks] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDetails((prev) => ({ ...prev, [name]: value }));
  };

  const getBanks = async () => {
    await paystackGet("https://api.paystack.co/bank").then((res) => {
      setBanks(res.data.data);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await apiPut(`/customer/updateCustomerPayment?customerId=${id}`, formDetails, {}, true).then(
      (res) => {
        toast.success(res.data.message);
        navigate(`/customers/${id}`);
      },
      (err) => {
        toast.error(err.response.data.message);
      }
    );
  };

  const bankList = banks.map((bank) => ({
    name: bank.name,
    value: bank.name,
  }));

  useEffect(() => {
    getBanks();
  }, []);

  return (
    <MDBox component="form" role="form" onSubmit={handleSubmit}>
      <MDTypography>Customer Payment</MDTypography>
      <Grid container spacing={2}>
        <Grid item md={6}>
          <MDBox mb={2}>
            <MDInput
              type="text"
              label="Account Number"
              name="accountNumber"
              variant="standard"
              value={accountNumber}
              fullWidth
              onChange={handleChange}
              required
            />
          </MDBox>
        </Grid>
        <Grid item md={6}>
          <MDBox mb={2}>
            <MDSelect
              name="bankName"
              onChange={handleChange}
              value={bankName}
              variant="standard"
              label="Bank"
              options={bankList}
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
