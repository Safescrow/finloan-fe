import React, { useState } from "react";
import PropTypes from "prop-types";
import { apiPost } from "utils/apiHelper";
import MDTypography from "components/MDTypography";
import { Card } from "@mui/material";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDSelect from "components/MDSelect";
import { toast } from "react-toastify";
import MDButton from "components/MDButton";

export default function Overview({ applicationId, onClose, type }) {
  const [approval, setApproval] = useState({
    approvalStatus: "",
    approvalNote: "",
    commencementDate: new Date(),
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    e.preventDefault();
    const { value, name } = e.target;
    setApproval((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await apiPost(
      `/application/${type === "lineManager" ? "linemanager-approval" : "manager-approval"}`,
      { ...approval, applicationId },
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
          {type === "lineManager" ? "Line Manager Approval" : "Manager Approval"}
        </MDTypography>
      </MDBox>
      <MDBox pt={4} pb={3} px={3}>
        <MDBox component="form" role="form" onSubmit={handleSubmit}>
          <MDBox mb={2}>
            <MDSelect
              label="Approval Status"
              name="approvalStatus"
              variant="standard"
              value={approval.approvalStatus}
              fullWidth
              onChange={handleChange}
              options={[
                { name: "Approved", value: "Approved" },
                { name: "Denied", value: "Denied" },
              ]}
              required
            />
          </MDBox>
          <MDBox mb={2}>
            <MDInput
              type="text"
              label="Approval Note"
              name="approvalNote"
              variant="standard"
              value={approval.approvalNote}
              fullWidth
              onChange={handleChange}
              required
            />
          </MDBox>
          {type === "lineManager" && (
            <MDBox mb={2}>
              <MDInput
                type="date"
                label="Commencement Date"
                name="commencementDate"
                variant="standard"
                value={approval.commencementDate}
                fullWidth
                onChange={handleChange}
                required
              />
            </MDBox>
          )}
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
  type: PropTypes.oneOf(["lineManager", "manager"]).isRequired,
};
