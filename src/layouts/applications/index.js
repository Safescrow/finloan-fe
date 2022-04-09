import { Card, Grid } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet } from "../../utils/apiHelper";
import Action from "./Action";

export default function index() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    apiGet("/Application/getAllApplications", {}, true).then((res) => {
      setApplications(res.data.data.pageItems);
    });
  }, []);

  const columns = [
    { Header: "customer name", accessor: "customerName", align: "left" },
    { Header: "amount", accessor: "amount", align: "right" },
    { Header: "Line Mgr Approval", accessor: "lineMgrApproval", align: "left" },
    { Header: "Mgr Approval", accessor: "mgrApproval", align: "left" },
    { Header: "Application Date", accessor: "applicationDate", align: "center" },
    { Header: "action", accessor: "action", align: "center" },
  ];

  const rows = applications.map((application) => ({
    customerName: `${application.customer.firstName} ${application?.customer?.middleName} ${application?.customer?.lastName}`,
    amount: application.amount.toLocaleString("en-NG", { style: "currency", currency: "NGN" }),
    lineMgrApproval: application?.lineManagerApproval,
    mgrApproval: application?.managerApproval,
    applicationDate: new Date(application.createdAt).toLocaleDateString("en-NG"),
    action: <Action id={application.id} />,
  }));

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container mb={4}>
          <Grid item xs={12} md={4} lg={3}>
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
