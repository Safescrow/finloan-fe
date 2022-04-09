import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { apiGet, apiPut, paystackGet } from "utils/apiHelper";
import MDTypography from "components/MDTypography";
import MDSelect from "components/MDSelect";
import { Card } from "@mui/material";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import { toast } from "react-toastify";
import MDButton from "components/MDButton";

export default function Overview({ id, onClose }) {
  const [customerPayment, setCustomerPayment] = useState({
    bankName: "",
    accountNumber: "",
  });
  const [loading, setLoading] = useState(false);

  const { bankName, accountNumber } = customerPayment;
  const [banks, setBanks] = useState([]);

  const getCustomer = async () => {
    await apiGet(`/customer/getCustomerPayment?customerId=${id}`, {}, true).then((res) => {
      setCustomerPayment(res.data.data);
    });
  };

  const getBanks = async () => {
    await paystackGet("https://api.paystack.co/bank").then((res) => {
      setBanks(res.data.data);
    });
  };

  const handleChange = (e) => {
    e.preventDefault();
    const { value, name } = e.target;
    setCustomerPayment((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await apiPut(
      `/customer/updateCustomerPayment?customerId=${id}`,
      customerPayment,
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

  const bankList = banks.map((bank) => ({
    name: bank.name,
    value: bank.name,
  }));

  useEffect(() => {
    getCustomer();
    getBanks();
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
          Update Customer Payment
        </MDTypography>
      </MDBox>
      <MDBox pt={4} pb={3} px={3}>
        <MDBox component="form" role="form" onSubmit={handleSubmit}>
          <MDBox mb={2}>
            <MDInput
              type="text"
              label="Account Number"
              name="accountNumber"
              variant="standard"
              value={accountNumber}
              fullWidth
              onChange={handleChange}
            />
          </MDBox>
          <MDBox mb={2}>
            <MDSelect
              name="bankName"
              onChange={handleChange}
              value={bankName}
              variant="standard"
              label="Bank"
              options={bankList}
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
