"use client";

import Container from "@mui/material/Container";

import { paths } from "../../../routes/paths";

import { useGetUser } from "../../../api/user";

import { Button } from "@mui/material";

import { RouterLink } from "../../../routes/components";

import { LoadingScreen } from "../../../components/loading-screen";

import Iconify from "../../../components/iconify";
import EmptyContent from "../../../components/empty-content";
import CustomBreadcrumbs from "../../../components/custom-breadcrumbs";

import UserNewEditForm from "../user-new-edit-form";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function UserEditView({ id }: Props) {
  const { user, userLoading, userError } = useGetUser(id);

  const renderError = (
    <EmptyContent
      filled
      title={`${userError?.message}`}
      action={
        <Button
          component={RouterLink}
          to={paths.dashboard.user.list}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          Back to List
        </Button>
      }
      sx={{ py: 10 }}
    />
  );

  const renderUser = user && (
    <>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: "Dashboard",
            href: paths.dashboard.root,
          },
          {
            name: "User",
            href: paths.dashboard.user.list,
          },
          { name: `${user?.firstName} ${user?.lastName}` },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <UserNewEditForm currentUser={user} />
    </>
  );

  return (
    !userLoading && (
      <Container>
        {userLoading && <LoadingScreen />}

        {userError && renderError}

        {user && renderUser}
      </Container>
    )
  );
}
