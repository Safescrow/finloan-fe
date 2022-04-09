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
import Header from "layouts/customer/components/Header";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiGet } from "utils/apiHelper";
import { Box } from "@mui/material";

import UpdateCustomerData from "./components/UpdateCustomerData";
import UpdateCustomerPayment from "./components/UpdateCustomerPayment";
import UpdateCustomerEmployment from "./components/UpdateCustomerEmployment";

function Overview() {
  const [customer, setCustomer] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalItem, setModalItem] = useState(null);

  const { customerId } = useParams();

  const toggleModal = (item) => {
    setShowModal(true);
    setModalItem(item);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalItem(null);
  };

  const getCustomer = async () => {
    await apiGet(`/customer/getCustomer?customerId=${customerId}`, {}, true).then((res) => {
      setCustomer(res.data.data);
    });
  };

  useEffect(() => {
    getCustomer();
  }, []);

  const { customerData, customerEmployment, customerPayment } = customer;

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
    case "customerData":
      modalContent = <UpdateCustomerData id={customerId} onClose={() => closeModal()} />;
      break;
    case "customerEmployment":
      modalContent = <UpdateCustomerEmployment id={customerId} onClose={() => closeModal()} />;
      break;
    case "customerPayment":
      modalContent = <UpdateCustomerPayment id={customerId} onClose={closeModal} />;
      break;
    default:
      modalContent = null;
      break;
  }

  return (
    <DashboardLayout>
      <Header
        fullName={`${customer.firstName} ${
          customer.middleName === null ? "" : customer.middleName
        } ${customer.lastName}`}
        passportUrl={customer.passportUrl}
      >
        <MDBox mt={5} mb={3}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6} xl={6}>
              <ProfileInfoCard
                title="Customer Details"
                info={{
                  "first Name": customer.firstName,
                  "middle Name": customer.middleName,
                  "last Name": customer.lastName,
                  email: customer.email,
                  "Phone Number": customer.phoneNumber,
                  "created At": new Date(customer.createdAt).toLocaleDateString("en-NG"),
                  "created By": `${customer?.createdBy?.firstName} ${customer.createdBy?.lastName}`,
                }}
                action={{ route: "", tooltip: "Edit Customer Details" }}
                shadow={false}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={6}>
              <ProfileInfoCard
                title="customer data"
                info={{
                  "date of Birth": new Date(customerData?.dateOfBirth).toLocaleDateString("en-NG"),
                  gender: customerData?.gender,
                  "marital Status": customerData?.maritalStatus,
                  "home Town": customerData?.homeTown,
                  "State of Origin": customerData?.stateOfOrigin,
                  "local government Area": customerData?.localGovernmentArea,
                  address: customerData?.address,
                  city: customerData?.city,
                  state: customerData?.state,
                }}
                action={{
                  route: () => {
                    toggleModal("customerData");
                  },
                  tooltip: "Edit Customer Data",
                }}
                shadow={false}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={6}>
              <ProfileInfoCard
                title="Customer Employment"
                info={{
                  "Staff ID": customerEmployment?.staffId,
                  MDA: customerEmployment?.mda,
                  "Grade Level": customerEmployment?.gradeLevel,
                  "retirement Date":
                    customerEmployment?.retirementDate &&
                    new Date(customerEmployment.retirementDate).toLocaleDateString("en-NG"),
                  "Date of First Appointment":
                    customerEmployment?.dateOfFirstAppointment &&
                    new Date(customerEmployment.dateOfFirstAppointment).toLocaleDateString("en-NG"),
                  "Confirmation Letter": customerEmployment?.confirmationLetter && (
                    <a href={customerEmployment?.confirmationLetter}>View</a>
                  ),
                  "First Appointment Letter": customerEmployment?.firstAppointmentLetter && (
                    <a href={customerEmployment?.firstAppointmentLetter}>View</a>
                  ),
                  "Verification Print Out": customerEmployment?.verificationPrintOut && (
                    <a href={customerEmployment?.verificationPrintOut}>View</a>
                  ),
                  "Letter of Introduction": customerEmployment?.letterOfIntroduction && (
                    <a href={customerEmployment?.letterOfIntroduction}>View</a>
                  ),
                }}
                action={{
                  route: () => {
                    toggleModal("customerEmployment");
                  },
                  tooltip: "Edit Customer Employment",
                }}
                shadow={false}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={6}>
              <ProfileInfoCard
                title="customer Payment Details"
                info={{
                  "Bank Name": customerPayment?.bankName,
                  "Account Number": customerPayment?.accountNumber,
                }}
                action={{
                  route: () => {
                    toggleModal("customerPayment");
                  },
                  tooltip: "Edit Customer Payment",
                }}
                shadow={false}
              />
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
