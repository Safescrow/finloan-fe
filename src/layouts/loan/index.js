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
import Modal from "@mui/material/Modal";
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
import { Box, Card } from "@mui/material";
import MDButton from "components/MDButton";
import { useAuth } from "context/auth/AuthState";

import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import UpdateGuarantor from "./components/UpdateGuarantor";
import UpdateApplication from "./components/UpdateApplication";
import ApprovalForm from "./components/ApprovalForm";

function Overview() {
  const [loan, setLoan] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalItem, setModalItem] = useState(null);

  const { loanId } = useParams();

  const {
    guarantor,
    customer,
    amount,
    category,
    tenure,
    interestRate,
    lastPaySlip,
    createdAt,
    schedule,
    loanAmount,
    application,
  } = loan;

  const toggleModal = (item) => {
    setShowModal(true);
    setModalItem(item);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalItem(null);
  };

  const { user } = useAuth();

  const getApplication = async () => {
    await apiGet(`/loan/${loanId}`, {}, true).then(
      (res) => {
        setLoan(res.data.data);
      }
    );
  };

  useEffect(() => {
    getApplication();
  }, []);

  const columns = [
    { Header: "month", accessor: "month", align: "left" },
    { Header: "amount", accessor: "amount", align: "right" },
    { Header: "status", accessor: "status", align: "center" },
  ];

  const rows = schedule?.map((sch) => ({
    month: sch?.month,
    amount: (sch?.amount).toLocaleString("en-NG", { style: "currency", currency: "NGN" }),
    status: sch?.paymentStatus ? "Paid" : "Pending",
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

  let modalContent;
  switch (modalItem) {
    case "guarantor":
      modalContent = <UpdateGuarantor applicationId={loanId} onClose={() => closeModal()} />;
      break;
    case "application":
      modalContent = (
        <UpdateApplication applicationId={loanId} onClose={() => closeModal()} />
      );
      break;
    case "lineManager":
      modalContent = (
        <ApprovalForm
          applicationId={loanId}
          onClose={() => closeModal()}
          type="lineManager"
        />
      );
      break;
    case "manager":
      modalContent = (
        <ApprovalForm applicationId={loanId} onClose={() => closeModal()} type="manager" />
      );
      break;
    default:
      modalContent = null;
      break;
  }

  return (
    <DashboardLayout>
      <Header
        fullName={`${customer?.firstName} ${
          customer?.middleName === null ? "" : customer?.middleName
        } ${customer?.lastName}`}
        passportUrl={customer?.passportUrl}
      >
        <MDBox mt={5} mb={3}>
          <MDButton
            lg={4}
            variant="gradient"
            type="button"
            color="info"
            disabled={user.role !== "LineManager" || loan.lineManagerApproval === "Approved"}
            onClick={() => toggleModal("lineManager")}
          >
            Line Manager Approval
          </MDButton>
          <MDButton
            lg={4}
            variant="gradient"
            type="button"
            color="primary"
            disabled={
              user.role !== "Manager" ||
              loan.managerApproval === "Approved" ||
              loan.lineManagerApproval !== "Approved"
            }
            onClick={() => toggleModal("manager")}
          >
            Manager Approval
          </MDButton>
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
                  "created By": `${customer?.createdBy?.firstName} ${customer?.createdBy?.lastName}`,
                }}
                action={{ route: () => {}, tooltip: "Edit Customer Details" }}
                shadow={false}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={6}>
              <ProfileInfoCard
                title="Application Details"
                info={{
                  "application Date": new Date(createdAt).toLocaleDateString("en-NG"),
                  amount:
                    amount &&
                    amount.toLocaleString("en-NG", { style: "currency", currency: "NGN" }),
                  category,
                  tenure: `${tenure} Months`,
                  "interest Rate": `${interestRate}%`,
                  "Last Payslip": lastPaySlip && <a href={lastPaySlip}>View</a>,
                }}
                action={{
                  route: () => {
                    toggleModal("application");
                  },
                  tooltip: "Edit Application Details",
                }}
                shadow={false}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={6}>
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
            </Grid>
            <Grid item xs={12} md={6} xl={6}>
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
      <Modal open={showModal} onClose={closeModal} aria-labelledby="modal-modal-title">
        <Box sx={style}>{modalContent}</Box>
      </Modal>
    </DashboardLayout>
  );
}

export default Overview;
