import { Grid } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDSelect from "components/MDSelect";
import MDTypography from "components/MDTypography";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { apiPost, apiGet } from "utils/apiHelper";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function index() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [loading, setLoading] = useState(false);
  const [formDetails, setFormDetails] = useState({
    customerId: id || "",
    amount: "",
    category: "",
    tenure: "",
    interestRate: "",
    lastPaySlipFile: "",
  });
  const [customers, setCustomers] = useState([]);

  const navigate = useNavigate();

  const { customerId, amount, category, tenure, interestRate, lastPaySlipFile } = formDetails;

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
    formData.append("amount", amount);
    formData.append("category", category);
    formData.append("tenure", tenure);
    formData.append("interestRate", interestRate);
    formData.append("lastPaySlipFile", lastPaySlipFile, lastPaySlipFile.name);
    await apiPost(
      `/application/createApplication?customerId=${customerId}`,
      formData,
      {},
      true
    ).then(
      (res) => {
        toast.success(res.data.message);
        navigate(`/applications/new-application/${res.data.data.id}/guarantor`);
      },
      (err) => {
        toast.error(err.response.data.message);
        setLoading(false);
      }
    );
  };

  const getCustomers = async () => {
    await apiGet("/customer/getAllCustomersUnpaginated", {}, true).then((res) => {
      setCustomers(res.data.data);
    });
  };

  useEffect(() => {
    getCustomers();
  }, []);

  const customerList = customers.map((customer) => ({
    name: `${customer.firstName} ${customer.middleName && customer.middleName} ${
      customer.lastName
    }`,
    value: customer.id,
  }));

  return (
    <MDBox component="form" role="form" onSubmit={handleSubmit}>
      <MDTypography>Application Details</MDTypography>
      <Grid container spacing={2}>
        <Grid item md={6}>
          <MDBox mb={2}>
            <MDSelect
              label="Customer"
              name="customerId"
              variant="standard"
              value={customerId}
              fullWidth
              options={customerList}
              onChange={handleChange}
              required
            />
          </MDBox>
        </Grid>
        <Grid item md={6}>
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
        </Grid>
        <Grid item md={6}>
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
        </Grid>
        <Grid item md={6}>
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
        </Grid>
        <Grid item md={6}>
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
        </Grid>
        <Grid item md={6}>
          <MDBox mb={2}>
            <MDInput
              type="file"
              label="Last Payslip"
              name="lastPaySlipFile"
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
