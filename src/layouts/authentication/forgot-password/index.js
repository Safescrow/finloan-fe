/**
=========================================================
* Material Dashboard 2 React - v2.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";
import { useEffect, useState } from "react";
import { apiPost } from "utils/apiHelper";
import { toast } from "react-toastify";

function Cover() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await apiPost("/account/forgot-password", { email }, {}, false).then(
      (res) => {
        toast.success(res.data.message, { position: "top-right" });
        setLoading(false);
        setDone(true);
      },
      (err) => {
        toast.error(err.response.data.message, { position: "top-right" });
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    if (loading) {
      toast.info("Loading...", { position: "top-right" });
    }
  }, []);

  return (
    <CoverLayout coverHeight="50vh" image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          py={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h3" fontWeight="medium" color="white" mt={1}>
            Reset Password
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Enter your registered email
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          {!done ? (
            <MDBox component="form" role="form" onSubmit={handleSubmit}>
              <MDBox mb={4}>
                <MDInput
                  type="email"
                  label="Email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="standard"
                  fullWidth
                  required
                />
              </MDBox>
              <MDBox mt={6} mb={1}>
                <MDButton
                  type="submit"
                  variant="gradient"
                  color="info"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? "please wait..." : "reset"}
                </MDButton>
              </MDBox>
            </MDBox>
          ) : (
            <center>
              <MDTypography>Password reset email has been sent to {email}</MDTypography>
            </center>
          )}
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Cover;
