import { Box, Card, Grid, Modal } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import { useAuth } from "context/auth/AuthState";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet } from "../../utils/apiHelper";
import Action from "./Action";
import DisburseScheduleForm from "./components/DisburseScheduleForm";

export default function index() {
  const [applications, setApplications] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    apiGet("/Application/getAllApplications", {}, true).then((res) => {
      setApplications(res.data.data.pageItems);
    });
  }, []);

  const {
    user: { role },
  } = useAuth();

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const columns = [
    { Header: "customer name", accessor: "customerName", align: "left" },
    { Header: "amount", accessor: "amount", align: "right" },
    { Header: "Line Mgr Approval", accessor: "lineMgrApproval", align: "left" },
    { Header: "Mgr Approval", accessor: "mgrApproval", align: "left" },
    { Header: "Application Date", accessor: "applicationDate", align: "center" },
    { Header: "action", accessor: "action", align: "center" },
  ];

  const rows = applications.map((application) => ({
    customerName: `${application.customer.firstName} ${
      application?.customer?.middleName === null ? "" : application?.customer?.middleName
    } ${application?.customer?.lastName}`,
    amount: application.amount.toLocaleString("en-NG", { style: "currency", currency: "NGN" }),
    lineMgrApproval: application?.lineManagerApproval,
    mgrApproval: application?.managerApproval,
    applicationDate: new Date(application.createdAt).toLocaleDateString("en-NG"),
    action: <Action id={application.id} />,
  }));

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container mb={4}>
          <Grid item xs={12} md={4} lg={3} mr={2}>
            <MDButton
              component={Link}
              to="/applications/new-application"
              lg={4}
              variant="gradient"
              type="submit"
              color="info"
              fullWidth
            >
              New Loan Application
            </MDButton>
          </Grid>
          {role === "SuperAdmin" || role === "Manager" ? (
            <>
              <Grid item xs={12} md={4} lg={3}>
                <MDButton
                  lg={4}
                  variant="gradient"
                  type="submit"
                  color="success"
                  fullWidth
                  onClick={() => toggleModal("paymentForm")}
                >
                  Disbursement Schedule
                </MDButton>
              </Grid>
              <Modal open={showModal} onClose={toggleModal} aria-labelledby="modal-modal-title">
                <Box sx={style}>
                  <DisburseScheduleForm onClose={toggleModal} />
                </Box>
              </Modal>
            </>
          ) : null}
        </Grid>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Loan Applications
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}
