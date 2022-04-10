import { Box, Card, Grid, Icon, Modal } from "@mui/material";
import MDBadge from "components/MDBadge";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import { useAuth } from "context/auth/AuthState";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiGet } from "../../utils/apiHelper";
import NewUser from "./Components/NewUser";

export default function index() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
  };

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
          color={usr.emailConfirmed ? "success" : "error"}
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
      <MDBox pt={3}>
        <Grid container mb={2}>
          <Grid item xs={12} md={4} lg={3} mr={2}>
            <MDButton
              lg={4}
              variant="gradient"
              type="submit"
              color="info"
              fullWidth
              onClick={() => toggleModal()}
            >
              New User
            </MDButton>
          </Grid>
        </Grid>
      </MDBox>
      <Modal open={showModal} onClose={toggleModal} aria-labelledby="modal-modal-title">
        <Box sx={style}>
          <NewUser onClose={toggleModal} />
        </Box>
      </Modal>
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
