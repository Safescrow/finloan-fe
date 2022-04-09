import React, { useState } from "react";
import PropTypes from "prop-types";
import MDTypography from "components/MDTypography";
import { Card } from "@mui/material";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import { toast } from "react-toastify";
import MDButton from "components/MDButton";
import { useJsonToCsv } from "react-json-csv";
import { apiGet } from "utils/apiHelper";
import mdas from "assets/mda.json";
import MDSelect from "components/MDSelect";

export default function Overview({ onClose }) {
  const [scheduleDetails, setScheduleDetails] = useState({
    schedulePeriod: "",
    mda: "",
  });
  const [loading, setLoading] = useState(false);
  const { saveAsCsv } = useJsonToCsv();

  const mdaList = mdas.map((m) => ({
    name: m,
    value: m,
  }));

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

  const fields = {
    scheduleId: "scheduleId",
    firstName: "firstName",
    middleName: "middleName",
    lastName: "lastName",
    email: "email",
    mda: "mda",
    amount: "amount",
  };

  const handleChange = (e) => {
    e.preventDefault();
    const { value, name } = e.target;
    setScheduleDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await apiGet(
      `/loan/mda-schedule?Month=${
        months[new Date(scheduleDetails.schedulePeriod).getMonth()]
      }&Year=${new Date(scheduleDetails.schedulePeriod).getFullYear()}&mda=${scheduleDetails.mda}`,
      {},
      true
    ).then(
      (res) => {
        saveAsCsv({
          data: res.data.data.pageItems,
          fields,
          filename: `${scheduleDetails.mda}-${
            months[new Date(scheduleDetails.schedulePeriod).getMonth()]
          }-${new Date(scheduleDetails.schedulePeriod).getFullYear()}`,
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
          Schedule Download
        </MDTypography>
      </MDBox>
      <MDBox pt={4} pb={3} px={3}>
        <MDBox component="form" role="form" onSubmit={handleSubmit}>
          <MDBox mb={2}>
            <MDInput
              type="month"
              label="Schedule Period"
              name="schedulePeriod"
              variant="standard"
              value={scheduleDetails.schedulePeriod}
              fullWidth
              onChange={handleChange}
              required
            />
          </MDBox>
          <MDBox mb={2}>
            <MDSelect
              label="MDA"
              name="mda"
              variant="standard"
              value={scheduleDetails.mda}
              options={mdaList}
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
  onClose: PropTypes.func.isRequired,
};
