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
// import Divider from "@mui/material/Divider";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
// import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";

// Overview page components
import Header from "layouts/loan/components/Header";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiGet } from "utils/apiHelper";
import { Card } from "@mui/material";

import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";

function Overview() {
  const [loan, setLoan] = useState({});

  const { loanId } = useParams();

  const { customer, schedule, loanAmount, balance, application, commencementDate, endDate } = loan;

  const getApplication = async () => {
    await apiGet(`/loan/${loanId}`, {}, true).then((res) => {
      setLoan(res.data.data);
    });
  };

  useEffect(() => {
    getApplication();
  }, []);

  const columns = [
    { Header: "month", accessor: "month", align: "left" },
    { Header: "year", accessor: "year", align: "left" },
    { Header: "amount", accessor: "amount", align: "right" },
    { Header: "status", accessor: "status", align: "center" },
    { Header: "payment ref", accessor: "paymentRef", align: "left" },
    { Header: "payment date", accessor: "paymentDate", align: "center" },
  ];

  const rows = schedule?.map((sch) => ({
    month: sch?.month,
    year: sch?.year,
    amount: (sch?.amount).toLocaleString("en-NG", { style: "currency", currency: "NGN" }),
    status: sch?.paymentStatus ? "Paid" : "Pending",
    paymentRef: sch?.paymentRef ? sch.paymentRef : "",
    paymentDate: sch?.paymentStatus ? new Date(sch.paymentDate).toLocaleDateString("en-NG") : "",
  }));

  return (
    <DashboardLayout>
      <Header
        fullName={`${customer?.firstName} ${
          customer?.middleName === null ? "" : customer?.middleName
        } ${customer?.lastName}`}
        passportUrl={customer?.passportUrl}
      >
        <MDBox mt={5} mb={3}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6} xl={6}>
              <ProfileInfoCard
                title="Customer Details"
                info={{
                  "first Name": customer?.firstName,
                  "middle Name": customer?.middleName && customer?.middleName,
                  "last Name": customer?.lastName,
                  email: customer?.email,
                  "Phone Number": customer?.phoneNumber,
                  "created At": new Date(customer?.createdAt).toLocaleDateString("en-NG"),
                  // "created By": `${customer?.createdBy?.firstName} ${customer?.createdBy?.lastName}`,
                }}
                shadow={false}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={6}>
              <ProfileInfoCard
                title="Loan Details"
                info={{
                  "commencement Date": new Date(commencementDate).toLocaleDateString("en-NG"),
                  "end Date": new Date(endDate).toLocaleDateString("en-NG"),
                  amount:
                    loanAmount &&
                    loanAmount.toLocaleString("en-NG", { style: "currency", currency: "NGN" }),
                  balance:
                    balance &&
                    balance.toLocaleString("en-NG", { style: "currency", currency: "NGN" }),
                  category: application?.category,
                  tenure: `${application?.tenure} Months`,
                  "interest Rate": `${application?.interestRate}%`,
                }}
                shadow={false}
              />
            </Grid>
            {/* <Grid item xs={12} md={6} xl={6}>
              <ProfileInfoCard
                title="Guarantor Details"
                info={{
                  "First Name": guarantor?.firstName,
                  "Last Name": guarantor?.lastName,
                  "Place of Work": guarantor?.placeOfWork,
                  designation: guarantor?.designation,
                  "Phone Number": guarantor?.phoneNumber,
                  address: guarantor?.address,
                }}
                action={{
                  route: () => {
                    toggleModal("guarantor");
                  },
                  tooltip: "Edit Guarantor",
                }}
                shadow={false}
              />
            </Grid> */}
            <Grid item xs={12} md={12} xl={12} mt={4}>
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
                    Loan Schedule
                  </MDTypography>
                </MDBox>
                <MDBox pt={3}>
                  {schedule && (
                    <DataTable
                      table={{ columns, rows }}
                      isSorted={false}
                      entriesPerPage={false}
                      showTotalEntries={false}
                      noEndBorder
                    />
                  )}
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        </MDBox>
      </Header>
      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
