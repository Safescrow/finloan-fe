import { Card, Grid, Icon } from "@mui/material";
import MDBadge from "components/MDBadge";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useAuth } from "context/auth/AuthState";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiGet } from "../../utils/apiHelper";

export default function index() {
  const [users, setUsers] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user.role !== "SuperAdmin") {
      toast.error("Unauthorised", { position: "top-right" });
      navigate("/dashboard");
    }
    apiGet("/user/get-users", {}, true).then((res) => {
      setUsers(res.data.data.pageItems);
    });
  }, []);

  const columns = [
    { Header: "first name", accessor: "firstName", align: "left" },
    { Header: "last name", accessor: "lastName", align: "left" },
    { Header: "email", accessor: "email", align: "left" },
    { Header: "status", accessor: "status", align: "center" },
    { Header: "action", accessor: "action", align: "center" },
  ];

  const rows = users.map((usr) => ({
    firstName: usr.firstName,
    lastName: usr.lastName,
    email: usr.email,
    status: (
      <MDBox ml={-1}>
        <MDBadge
          badgeContent={usr.emailConfirmed ? "Active" : "Inactive"}
          color={usr.emailConfirmed ? "success" : "danger"}
          variant="gradient"
          size="sm"
        />
      </MDBox>
    ),
    action: (
      <MDTypography component="a" href="#" color="text">
        <Icon>more_vert</Icon>
      </MDTypography>
    ),
  }));

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
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
                  Users Table
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
