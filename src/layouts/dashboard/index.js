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
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import { useEffect, useState } from "react";
import { apiGet } from "utils/apiHelper";
import MDButton from "components/MDButton";
import { Link } from "react-router-dom";

function Dashboard() {
  const [loans, setLoans] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [count, setCount] = useState(0);

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
  const today = new Date();
  const month = months[today.getMonth()];
  const year = today.getFullYear();

  const getLoans = () => {
    apiGet("/loan/unpaged", {}, true).then((res) => {
      setLoans(res.data.data);
    });
  };

  const getCustomers = () => {
    apiGet("/customer/getAllCustomersUnpaginated", {}, true).then((res) => {
      setCustomers(res.data.data);
    });
  };

  const getSchedule = () => {
    apiGet(`/loan/schedule?month=${month}&year=${year}`, {}, true).then((res) => {
      setSchedule(res.data.data.pageItems);
    });
  };

  const getScheduleTotal = () => {
    apiGet(`/loan/schedule-count?month=${month}&year=${year}`, {}, true).then((res) => {
      setCount(res.data.data);
    });
  };

  const loanBalance = loans.reduce((acc, item) => acc + item.balance, 0);

  useEffect(() => {
    getLoans();
    getCustomers();
    getSchedule();
    getScheduleTotal();
  }, []);
  const columns = [
    { Header: "customer name", accessor: "name", align: "left" },
    { Header: "MDA", accessor: "mda", align: "left" },
    { Header: "amount", accessor: "amount", align: "right" },
  ];

  const rows = schedule?.map((sch) => ({
    name: `${sch.firstName} ${sch.middleName === null ? "" : sch.middleName} ${sch.lastName}`,
    amount: (sch?.amount).toLocaleString("en-NG", { style: "currency", currency: "NGN" }),
    mda: sch?.mda,
  }));

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container mb={2}>
          <Grid item xs={12} md={4} lg={3} mr={2}>
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
          <Grid item xs={12} md={4} lg={3}>
            <MDButton
              component={Link}
              to="/applications/new-application"
              lg={4}
              variant="gradient"
              type="submit"
              color="primary"
              fullWidth
            >
              New Loan Application
            </MDButton>
          </Grid>
        </Grid>
      </MDBox>
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="attach_money"
                title="Active Loan Value"
                count={loanBalance.toLocaleString("en-NG", { style: "currency", currency: "NGN" })}
                percentage={{
                  label: "Total volume of active loans",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="currency_exchange"
                title="Due Loans"
                count={count.toLocaleString("en-NG", { style: "currency", currency: "NGN" })}
                percentage={{
                  label: "Total loans due for this month",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="people"
                title="Customers"
                count={customers.length}
                percentage={{
                  label: "Total number of customers",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={12}>
              <Projects data={{ columns, rows }} />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default Dashboard;
