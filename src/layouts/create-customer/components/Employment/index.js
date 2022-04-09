import { Grid } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { apiPut, apiGet } from "utils/apiHelper";
import { useNavigate, useParams } from "react-router-dom";
import mdas from "assets/mda.json";
import MDSelect from "components/MDSelect";
import dayjs from "dayjs";

export default function index() {
  const [loading, setLoading] = useState(false);
  const [formDetails, setFormDetails] = useState({
    staffId: "",
    mda: "",
    scheme: "",
    step: "",
    grade: "",
    retirementDate: "",
    dateOfFirstAppointment: "",
    confirmationLetterFile: "",
    firstAppointmentLetterFile: "",
    verificationPrintOutFile: "",
    letterOfIntroductionFile: "",
  });

  const [dateOfBirth, setDateOfBirth] = useState("");

  const { id } = useParams();

  const navigate = useNavigate();

  const {
    staffId,
    mda,
    scheme,
    step,
    grade,
    retirementDate,
    dateOfFirstAppointment,
    confirmationLetterFile,
    firstAppointmentLetterFile,
    verificationPrintOutFile,
    letterOfIntroductionFile,
  } = formDetails;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { files, name } = e.target;
    setFormDetails((prev) => ({ ...prev, [name]: files[0] }));
  };

  const getCustomerData = async () => {
    await apiGet(`/customer/getCustomerData?customerId=${id}`, {}, true).then((res) => {
      setDateOfBirth(res.data.data.dateOfBirth);
    });
  };

  const calculateRetirement = (firstAppointment) => {
    const serviceRetirement = dayjs(firstAppointment).add(35, "y");
    const ageRetirement = dayjs(dateOfBirth).add(60, "years");
    const retDate = Math.max(serviceRetirement, ageRetirement);
    setFormDetails((prev) => ({
      ...prev,
      retirementDate: dayjs(retDate).format("YYYY-MM-DD"),
    }));
  };

  useEffect(() => {
    getCustomerData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("staffId", staffId);
    formData.append("mda", mda);
    formData.append("gradeLevel", `${scheme}-${grade}/${step}`);
    formData.append("retirementDate", retirementDate);
    formData.append("dateOfFirstAppointment", dateOfFirstAppointment);
    formData.append("confirmationLetterFile", confirmationLetterFile, confirmationLetterFile.name);
    formData.append(
      "firstAppointmentLetterFile",
      firstAppointmentLetterFile,
      firstAppointmentLetterFile.name
    );
    formData.append(
      "verificationPrintOutFile",
      verificationPrintOutFile,
      verificationPrintOutFile.name
    );
    formData.append(
      "letterOfIntroductionFile",
      letterOfIntroductionFile,
      letterOfIntroductionFile.name
    );
    formData.append("staffId", staffId);
    formData.append("mda", mda);
    formData.append("gradeLevel", `${scheme}-${grade}/${step}`);
    formData.append("retirementDate", retirementDate);
    formData.append("dateOfFirstAppointment", dateOfFirstAppointment);
    formData.append("confirmationLetterFile", confirmationLetterFile, confirmationLetterFile.name);
    formData.append(
      "firstAppointmentLetterFile",
      firstAppointmentLetterFile,
      firstAppointmentLetterFile.name
    );
    formData.append(
      "verificationPrintOutFile",
      verificationPrintOutFile,
      verificationPrintOutFile.name
    );
    formData.append(
      "letterOfIntroductionFile",
      letterOfIntroductionFile,
      letterOfIntroductionFile.name
    );

    await apiPut(`/customer/updateCustomerEmployment?customerId=${id}`, formData, {}, true).then(
      (res) => {
        toast.success(res.data.message);
        navigate(`/customers/new-customer/${id}/payment`);
      },
      (err) => {
        toast.error(err.response.data.message);
      }
    );
  };

  const mdaList = mdas.map((m) => ({
    name: m,
    value: m,
  }));

  const gradeList = [];
  for (let i = 1; i < 18; i += 1) {
    gradeList.push({
      name: i,
      value: i,
    });
  }

  const stepList = [];
  for (let i = 1; i < 16; i += 1) {
    stepList.push({
      name: i,
      value: i,
    });
  }

  return (
    <MDBox component="form" role="form" onSubmit={handleSubmit}>
      <MDTypography>Customer Employment</MDTypography>
      <Grid container spacing={2}>
        <Grid item md={6}>
          <MDBox mb={2}>
            <MDInput
              type="text"
              label="Staff ID"
              name="staffId"
              variant="standard"
              value={staffId}
              fullWidth
              onChange={handleChange}
              required
            />
          </MDBox>
        </Grid>
        <Grid item md={6}>
          <MDBox mb={2}>
            <Grid container>
              <Grid item xs={4}>
                <MDSelect
                  name="scheme"
                  value={scheme}
                  variant="standard"
                  onChange={handleChange}
                  label="Scheme"
                  options={[
                    { name: "CONPSS", value: "CONPSS" },
                    { name: "CONHESS", value: "CONHESS" },
                  ]}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={4}>
                <MDSelect
                  name="grade"
                  value={grade}
                  variant="standard"
                  onChange={handleChange}
                  label="Grade"
                  options={gradeList}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={4}>
                <MDSelect
                  name="step"
                  value={step}
                  variant="standard"
                  onChange={handleChange}
                  label="Step"
                  options={stepList}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>
          </MDBox>
        </Grid>
        <Grid item md={6}>
          <MDBox mb={2}>
            <MDSelect
              name="mda"
              onChange={handleChange}
              value={mda}
              variant="standard"
              label="MDA"
              options={mdaList}
              fullWidth
              required
            />
          </MDBox>
        </Grid>
        <Grid item md={6}>
          <MDBox mb={2}>
            <MDInput
              type="date"
              label="Date of First Appointment"
              name="dateOfFirstAppointment"
              variant="standard"
              value={dayjs(dateOfFirstAppointment).format("YYYY-MM-DD")}
              fullWidth
              onChange={(e) => {
                handleChange(e);
                calculateRetirement(e.target.value);
              }}
              required
            />
          </MDBox>
        </Grid>
        <Grid item md={6}>
          <MDBox mb={2}>
            <MDInput
              name="retirementDate"
              type="date"
              onChange={handleChange}
              value={dayjs(retirementDate).format("YYYY-MM-DD")}
              variant="standard"
              label="Retirement Date"
              fullWidth
              disabled
            />
          </MDBox>
        </Grid>
        <Grid item md={6}>
          <MDBox mb={2}>
            <MDInput
              name="confirmationLetterFile"
              type="file"
              variant="standard"
              onChange={handleFileChange}
              label="Confirmation Letter"
              fullWidth
              required
            />
          </MDBox>
        </Grid>
        <Grid item md={6}>
          <MDBox mb={2}>
            <MDInput
              name="firstAppointmentLetterFile"
              type="file"
              variant="standard"
              onChange={handleFileChange}
              label="First Appointment Letter"
              fullWidth
              required
            />
          </MDBox>
        </Grid>
        <Grid item md={6}>
          <MDBox mb={2}>
            <MDInput
              type="file"
              label="Verification Printout"
              name="verificationPrintOutFile"
              variant="standard"
              fullWidth
              onChange={handleFileChange}
              required
            />
          </MDBox>
        </Grid>
        <Grid item md={6}>
          <MDBox mb={2}>
            <MDInput
              type="file"
              label="Letter of Introduction"
              name="letterOfIntroductionFile"
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
