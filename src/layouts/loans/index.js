import { Box, Card, Grid, Modal } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import { useAuth } from "context/auth/AuthState";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import React, { useEffect, useState } from "react";
import { apiGet } from "../../utils/apiHelper";
import Action from "./Action";
import PaymentForm from "./BatchPaymentForm";
import ScheduleForm from "./ScheduleForm";

export default function index() {
  const [loans, setLoans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalItem, setModalItem] = useState("");

  const {
    user: { role },
  } = useAuth();

  useEffect(() => {
    apiGet("/Loan", {}, true).then((res) => {
      setLoans(res.data.data.pageItems);
    });
  }, []);

  const toggleModal = (item) => {
    setShowModal(true);
    setModalItem(item);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalItem(null);
  };

  let modalContent;
  switch (modalItem) {
    case "paymentForm":
      modalContent = <PaymentForm onClose={closeModal} />;
      break;
    case "scheduleDownload":
      modalContent = <ScheduleForm onClose={closeModal} />;
      break;
    default:
      break;
  }

  const columns = [
    { Header: "customer name", accessor: "customerName", align: "left" },
    { Header: "loan amount", accessor: "loanAmount", align: "right" },
    { Header: "balance", accessor: "balance", align: "right" },
    { Header: "no. paid", accessor: "numberPaid", align: "center" },
    { Header: "no. pending", accessor: "numberPending", align: "center" },
    { Header: "commencement date", accessor: "commencementDate", align: "center" },
    { Header: "end date", accessor: "endDate", align: "center" },
    { Header: "action", accessor: "action", align: "center" },
  ];

  const rows = loans.map((loan) => ({
    customerName: `${loan.customer.firstName} ${
      loan?.customer?.middleName === null ? "" : loan?.customer?.middleName
    } ${loan?.customer?.lastName}`,
    loanAmount: loan.loanAmount.toLocaleString("en-NG", { style: "currency", currency: "NGN" }),
    balance: loan.balance.toLocaleString("en-NG", { style: "currency", currency: "NGN" }),
    numberPaid: loan.schedule.filter((s) => s.paymentStatus).length,
    numberPending: loan.schedule.filter((s) => !s.paymentStatus).length,
    commencementDate: new Date(loan.commencementDate).toLocaleDateString("en-NG"),
    endDate: new Date(loan.endDate).toLocaleDateString("en-NG"),
    action: <Action id={loan.applicationId} />,
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
              lg={4}
              variant="gradient"
              type="submit"
              color="info"
              fullWidth
              onClick={() => toggleModal("scheduleDownload")}
            >
              Download Payment Schedule
            </MDButton>
          </Grid>
          {role === "SuperAdmin" ||
            ("Manager" && (
              <>
                <Grid item xs={12} md={4} lg={3} mr={2}>
                  <MDButton
                    lg={4}
                    variant="gradient"
                    type="submit"
                    color="primary"
                    fullWidth
                    onClick={() => toggleModal("paymentForm")}
                  >
                    New Batch Payment
                  </MDButton>
                </Grid>
              </>
            ))}
          <Modal open={showModal} onClose={closeModal} aria-labelledby="modal-modal-title">
            <Box sx={style}>{modalContent}</Box>
          </Modal>
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
