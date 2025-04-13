"use client";

import Container from "@mui/material/Container";

import { paths } from "../../../routes/paths";

import CustomBreadcrumbs from "../../../components/custom-breadcrumbs";

import UserNewEditForm from "../user-new-edit-form";

// ----------------------------------------------------------------------

export default function UserCreateView() {
  return (
    <Container>
      <CustomBreadcrumbs
        heading="Create a new user"
        links={[
          {
            name: "Dashboard",
            href: paths.dashboard.root,
          },
          {
            name: "User",
            href: paths.dashboard.user.root,
          },
          { name: "New user" },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <UserNewEditForm />
    </Container>
  );
}
