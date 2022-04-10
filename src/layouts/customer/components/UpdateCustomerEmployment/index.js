import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { apiGet, apiPut } from "utils/apiHelper";
import MDTypography from "components/MDTypography";
import MDSelect from "components/MDSelect";
import { Card, Grid } from "@mui/material";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import mdas from "assets/mda.json";
import { toast } from "react-toastify";
import MDButton from "components/MDButton";
import dayjs from "dayjs";
import { useAuth } from "context/auth/AuthState";

export default function Overview({ id, onClose }) {
  const [customerEmployment, setCustomerEmployment] = useState({
    staffId: "",
    mda: "",
    gradeLevel: "",
    retirementDate: "",
    dateOfFirstAppointment: "",
    confirmationLetterFile: "",
    firstAppointmentLetterFile: "",
    verificationPrintOutFile: "",
    letterOfIntroductionFile: "",
  });

  const [dateOfBirth, setDateOfBirth] = useState("");
  const {
    user: { role },
  } = useAuth();

  const [loading, setLoading] = useState(false);

  const {
    staffId,
    mda,
    gradeLevel,
    retirementDate,
    dateOfFirstAppointment,
    confirmationLetterFile,
    firstAppointmentLetterFile,
    verificationPrintOutFile,
    letterOfIntroductionFile,
  } = customerEmployment;

  const [grading, setGrading] = useState({
    scheme: "",
    step: "",
    grade: "",
  });

  const setGradeLevel = (gradeL) => {
    const scheme = gradeL ? gradeL.substring(0, gradeL.indexOf("-")) : "";
    const grade = gradeL ? gradeL.substring(gradeL.indexOf("-"), gradeL.indexOf("/")) : "";
    const step = gradeL ? gradeL.substring(gradeL.indexOf("/"), gradeL.length) : "";

    setGrading({ scheme, step, grade });
  };

  const { scheme, step, grade } = grading;

  const getCustomer = async () => {
    await apiGet(`/customer/getCustomerEmployment?customerId=${id}`, {}, true).then((res) => {
      setCustomerEmployment(res.data.data);
      setGradeLevel(gradeLevel);
    });
  };

  const getCustomerData = async () => {
    await apiGet(`/customer/getCustomerData?customerId=${id}`, {}, true).then((res) => {
      setDateOfBirth(res.data.data.dateOfBirth);
    });
  };

  const handleChange = (e) => {
    e.preventDefault();
    const { value, name } = e.target;
    setCustomerEmployment((prev) => ({ ...prev, [name]: value }));
  };

  const handleGradeChange = (e) => {
    e.preventDefault();
    const { value, name } = e.target;
    setGrading((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { files, name } = e.target;
    setCustomerEmployment((prev) => ({ ...prev, [name]: files[0] }));
  };

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
    await apiPut(`/customer/updateCustomerEmployment?customerId=${id}`, formData, {}, true).then(
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

  const calculateRetirement = (firstAppointment) => {
    const serviceRetirement = dayjs(firstAppointment).add(35, "y");
    const ageRetirement = dayjs(dateOfBirth).add(60, "years");
    const retDate = Math.max(serviceRetirement, ageRetirement);
    setCustomerEmployment((prev) => ({
      ...prev,
      retirementDate: dayjs(retDate).format("YYYY-MM-DD"),
    }));
  };

  useEffect(() => {
    getCustomer();
    getCustomerData();
  }, []);

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
          Update Customer Employment
        </MDTypography>
      </MDBox>
      <MDBox pt={4} pb={3} px={3}>
        <MDBox component="form" role="form" onSubmit={handleSubmit}>
          <MDBox mb={2}>
            <MDInput
              type="text"
              label="Staff ID"
              name="staffId"
              variant="standard"
              value={staffId}
              fullWidth
              onChange={handleChange}
            />
          </MDBox>
          <MDBox mb={2}>
            <Grid container>
              <Grid item xs={4}>
                <MDSelect
                  name="scheme"
                  value={scheme}
                  variant="standard"
                  onChange={handleGradeChange}
                  label="Scheme"
                  options={[
                    { name: "CONPSS", value: "CONPSS" },
                    { name: "CONHESS", value: "CONHESS" },
                  ]}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <MDSelect
                  name="grade"
                  value={grade}
                  variant="standard"
                  onChange={handleGradeChange}
                  label="Grade"
                  options={gradeList}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <MDSelect
                  name="step"
                  value={step}
                  variant="standard"
                  onChange={handleGradeChange}
                  label="Step"
                  options={stepList}
                  fullWidth
                />
              </Grid>
            </Grid>
          </MDBox>
          <MDBox mb={2}>
            <MDSelect
              name="mda"
              onChange={handleChange}
              value={mda}
              variant="standard"
              label="MDA"
              options={mdaList}
              fullWidth
            />
          </MDBox>
          {role !== "SuperAdmin" && (
            <>
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
                />
              </MDBox>
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
            </>
          )}
          <MDBox mb={2}>
            <MDInput
              name="confirmationLetterFile"
              type="file"
              variant="standard"
              onChange={handleFileChange}
              label="Confirmation Letter"
              fullWidth
            />
          </MDBox>
          <MDBox mb={2}>
            <MDInput
              name="firstAppointmentLetterFile"
              type="file"
              variant="standard"
              onChange={handleFileChange}
              label="First Appointment Letter"
              fullWidth
            />
          </MDBox>
          <MDBox mb={2}>
            <MDInput
              type="file"
              label="Verification Printout"
              name="verificationPrintOutFile"
              variant="standard"
              fullWidth
              onChange={handleFileChange}
            />
          </MDBox>
          <MDBox mb={2}>
            <MDInput
              type="file"
              label="Letter of Introduction"
              name="letterOfIntroductionFile"
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
  id: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
