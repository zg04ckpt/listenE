// import * as Yup from "yup";
// import { useMemo, useCallback } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";

// import Box from "@mui/material/Box";
// import Card from "@mui/material/Card";
// import Stack from "@mui/material/Stack";
// import Button from "@mui/material/Button";
// import Switch from "@mui/material/Switch";
// import Grid from "@mui/material/Unstable_Grid2";
// import Typography from "@mui/material/Typography";
// import LoadingButton from "@mui/lab/LoadingButton";
// import FormControlLabel from "@mui/material/FormControlLabel";

// import { paths } from "../../../routes/paths";
// import { useRouter } from "../../../routes/hooks";

// import { fData } from "../../../utils/format-number";

// import { countries } from "../../../assets/data";

// import Label from "../../../components/label";
// import { useSnackbar } from "../../../components/snackbar";
// import FormProvider, {
//   RHFSwitch,
//   RHFTextField,
//   RHFUploadAvatar,
//   RHFAutocomplete,
// } from "src/components/hook-form";

// import { IUserItem } from "src/types/user";
// import { updateOrCreateUser } from "src/api/users";
// import { IRoleItem } from "src/types/role";
// import {
//   Autocomplete,
//   AutocompleteChangeReason,
//   TextField,
// } from "@mui/material";
// import { useGetRoles } from "src/api/roles";

// // ----------------------------------------------------------------------

// type Props = {
//   currentUser?: IUserItem;
// };

// export default function UserNewEditForm({ currentUser }: Props) {
//   const router = useRouter();
//   const { roles } = useGetRoles();

//   const { enqueueSnackbar } = useSnackbar();

//   const NewUserSchema = Yup.object().shape({
//     firstName: Yup.string().required("firstName is required"),
//     lastName: Yup.string().required("lastName is required"),
//     email: Yup.string()
//       .required("Email is required")
//       .email("Email must be a valid email address"),
//     phoneNumber: Yup.string().required("Phone number is required"),
//     address: Yup.string(),
//     country: Yup.string(),
//     company: Yup.string(),
//     state: Yup.string(),
//     city: Yup.string(),
//     zipCode: Yup.string(),
//     avatarUrl: Yup.mixed<any>().nullable(),
//     // not required
//     status: Yup.string(),
//     isVerified: Yup.boolean(),
//     roleId: Yup.string(),
//   });

//   const defaultValues = useMemo(
//     () => ({
//       firstName: currentUser?.firstName || "",
//       lastName: currentUser?.lastName || "",
//       city: currentUser?.city || "",
//       email: currentUser?.email || "",
//       state: currentUser?.state || "",
//       status: currentUser?.status || "",
//       address: currentUser?.address || "",
//       country: currentUser?.country || "",
//       zipCode: currentUser?.zipCode || "",
//       company: currentUser?.company || "",
//       avatarUrl: currentUser?.avatarUrl || null || "",
//       phoneNumber: currentUser?.phoneNumber || "",
//       isVerified: currentUser?.isVerified || true,
//       roleId: currentUser?.roleId || "",
//     }),
//     [currentUser]
//   );

//   const methods = useForm({
//     resolver: yupResolver(NewUserSchema),
//     defaultValues,
//   });

//   const {
//     reset,
//     watch,
//     control,
//     setValue,
//     handleSubmit,
//     formState: { isSubmitting },
//   } = methods;

//   const values = watch();
//   const onSubmit = handleSubmit(async (data) => {
//     try {
//       // await new Promise((resolve) => setTimeout(resolve, 500));
//       const updatedData: IUserItem = {
//         ...data,
//         id: currentUser?.id || "",
//         name: `${data.firstName} ${data.lastName}`, // Ghép họ và tên thành một trường name
//       };
//       await updateOrCreateUser(updatedData).then((res) => {
//         if (res.status === 200) {
//           enqueueSnackbar("Update success!");
//         } else {
//           enqueueSnackbar("Some thing went wrong");
//           reset();
//         }
//         router.push(paths.dashboard.user.list);
//       });
//       reset();
//     } catch (error) {
//       console.error(error);
//     }
//   });

//   const handleDrop = useCallback(
//     (acceptedFiles: File[]) => {
//       const file = acceptedFiles[0];

//       const newFile = Object.assign(file, {
//         preview: URL.createObjectURL(file),
//       });

//       if (file) {
//         setValue("avatarUrl", newFile, { shouldValidate: true });
//       }
//     },
//     [setValue]
//   );
//   const handleChangeRole = (
//     event: React.SyntheticEvent,
//     value: any,
//     reason: AutocompleteChangeReason
//   ) => {
//     const role = value as IRoleItem;
//     setValue("roleId", role?.id ?? "");
//     switch (reason) {
//       case "clear": {
//         setValue("roleId", "");
//         break;
//       }

//       default:
//         // Xử lý trường hợp mặc định nếu cần
//         break;
//     }
//   };

//   return (
//     <FormProvider methods={methods} onSubmit={onSubmit}>
//       <Grid container spacing={3}>
//         <Grid xs={12} md={4}>
//           <Card sx={{ pt: 10, pb: 5, px: 3 }}>
//             {currentUser && (
//               <Label
//                 color={
//                   (values.status === "active" && "success") ||
//                   (values.status === "banned" && "error") ||
//                   "warning"
//                 }
//                 sx={{ position: "absolute", top: 24, right: 24 }}
//               >
//                 {values.status}
//               </Label>
//             )}

//             <Box sx={{ mb: 5 }}>
//               <RHFUploadAvatar
//                 name="avatarUrl"
//                 maxSize={3145728}
//                 onDrop={handleDrop}
//                 helperText={
//                   <Typography
//                     variant="caption"
//                     sx={{
//                       mt: 3,
//                       mx: "auto",
//                       display: "block",
//                       textAlign: "center",
//                       color: "text.disabled",
//                     }}
//                   >
//                     Allowed *.jpeg, *.jpg, *.png, *.gif
//                     <br /> max size of {fData(3145728)}
//                   </Typography>
//                 }
//               />
//             </Box>

//             {currentUser && (
//               <FormControlLabel
//                 labelPlacement="start"
//                 control={
//                   <Controller
//                     name="status"
//                     control={control}
//                     render={({ field }) => (
//                       <Switch
//                         {...field}
//                         checked={field.value !== "active"}
//                         onChange={(event) =>
//                           field.onChange(
//                             event.target.checked ? "banned" : "active"
//                           )
//                         }
//                       />
//                     )}
//                   />
//                 }
//                 label={
//                   <>
//                     <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
//                       Banned
//                     </Typography>
//                     <Typography
//                       variant="body2"
//                       sx={{ color: "text.secondary" }}
//                     >
//                       Apply disable account
//                     </Typography>
//                   </>
//                 }
//                 sx={{ mx: 0, mb: 3, width: 1, justifyContent: "space-between" }}
//               />
//             )}

//             <RHFSwitch
//               name="isVerified"
//               labelPlacement="start"
//               label={
//                 <>
//                   <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
//                     Email Verified
//                   </Typography>
//                   <Typography variant="body2" sx={{ color: "text.secondary" }}>
//                     Disabling this will automatically send the user a
//                     verification email
//                   </Typography>
//                 </>
//               }
//               sx={{ mx: 0, width: 1, justifyContent: "space-between" }}
//             />

//             {currentUser && (
//               <Stack justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
//                 <Button variant="soft" color="error">
//                   Delete User
//                 </Button>
//               </Stack>
//             )}
//           </Card>
//         </Grid>

//         <Grid xs={12} md={8}>
//           <Card sx={{ p: 3 }}>
//             <Box
//               rowGap={3}
//               columnGap={2}
//               display="grid"
//               gridTemplateColumns={{
//                 xs: "repeat(1, 1fr)",
//                 sm: "repeat(2, 1fr)",
//               }}
//             >
//               <RHFTextField disabled name="name" label="Full Name" />
//               <Box sx={{ display: { xs: "none", sm: "block" } }} />

//               <RHFTextField name="firstName" label="First Name" />
//               <RHFTextField name="lastName" label="Last Name" />
//               <RHFTextField name="email" label="Email Address" />
//               <RHFTextField name="phoneNumber" label="Phone Number" />

//               <RHFAutocomplete
//                 name="country"
//                 type="country"
//                 label="Country"
//                 placeholder="Choose a country"
//                 fullWidth
//                 options={countries.map((option) => option.label)}
//                 getOptionLabel={(option) => option}
//               />

//               {/* <RHFAutocomplete
//                 name="country"
//                 type="country"
//                 label="Country"
//                 placeholder="Choose a country"
//                 options={
//                   countries &&
//                   countries.length > 0 &&
//                   countries.map((country: any) => {
//                     return { value: country.id, label: country.label };
//                   })
//                 }
//               /> */}

//               <RHFTextField name="state" label="State/Region" />
//               <RHFTextField name="city" label="City" />
//               <RHFTextField name="address" label="Address" />
//               <RHFTextField name="zipCode" label="Zip/Code" />
//               <RHFTextField name="company" label="Company" />
//               {roles.length > 0 && (
//                 <Autocomplete
//                   renderInput={(params) => (
//                     <TextField {...params} label="Choose a Role" />
//                   )}
//                   fullWidth
//                   defaultValue={
//                     roles.find((f) => currentUser?.roleId === f.id) as IRoleItem
//                   }
//                   options={roles}
//                   getOptionLabel={(option) => {
//                     // Value selected with enter, right from the input
//                     if (typeof option === "string") {
//                       return option;
//                     }
//                     // Add "xxx" option created dynamically
//                     if (option.roleName) {
//                       return option.roleName;
//                     }
//                     // Regular option
//                     return option.type || "";
//                   }}
//                   onChange={handleChangeRole}
//                 />
//               )}
//             </Box>

//             <Stack alignItems="flex-end" sx={{ mt: 3 }}>
//               <LoadingButton
//                 type="submit"
//                 variant="contained"
//                 loading={isSubmitting}
//               >
//                 {!currentUser ? "Create User" : "Save Changes"}
//               </LoadingButton>
//             </Stack>
//           </Card>
//         </Grid>
//       </Grid>
//     </FormProvider>
//   );
// }

import { IUserItem } from "../../types/user";
type Props = {
  currentUser?: IUserItem;
};

export default function UserNewEditForm({ currentUser }: Props) {
  return `Hello ${currentUser?.firstName}`;
}
