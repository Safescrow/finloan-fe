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
import ListMenu from "./Menu";

export default function index() {
  const [customers, setCustomers] = useState([]);

  // const navigate = useNavigate();

  useEffect(() => {
    apiGet("/Customer/getAllCustomers", {}, true).then((res) => {
      setCustomers(res.data.data.pageItems);
    });
  }, []);

  const columns = [
    { Header: "first name", accessor: "firstName", align: "left" },
    { Header: "middle name", accessor: "middleName", align: "left" },
    { Header: "last name", accessor: "lastName", align: "left" },
    { Header: "email", accessor: "email", align: "left" },
    { Header: "phone number", accessor: "phoneNumber", align: "left" },
    { Header: "Date Created", accessor: "createdAt", align: "center" },
    { Header: "action", accessor: "action", align: "center" },
  ];

  const rows = customers.map((customer) => ({
    firstName: customer.firstName,
    middleName: customer.middleName,
    lastName: customer.lastName,
    email: customer.email,
    phoneNumber: customer.phoneNumber,
    createdAt: new Date(customer.createdAt).toLocaleDateString("en-NG"),
    action: <ListMenu id={customer.id} />,
  }));

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container mb={4}>
          <Grid item xs={12} md={4} lg={3}>
            <MDButton
              component={Link}
              to="/customers/new-customer"
              lg={4}
              variant="gradient"
              type="submit"
              color="info"
              fullWidth
            >
              New Customer
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
                  Customers
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
