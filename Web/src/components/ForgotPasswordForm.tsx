import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Typography,
  Input,
  FormControl,
  Link,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { resetPassword, sendResetPasswordCode } from "../api/auth";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IUserResetPasswordItem } from "../types/user";
import { LoadingButton } from "@mui/lab";
import useSnackbar from "../hooks/useSnackbar";
import { useNavigate } from "react-router-dom";

const inputStyle = {
  height: "100%",
  width: "100%",
  outline: "none",
  pl: "15px",
  borderRadius: "15px",
  border: "1px solid lightgrey",
  borderBottomWidth: "2px",
  fontSize: "17px",
  transition: "all 0.3s ease",
  "&::before, &::after": { display: "none" },
  "&:focus-within": { borderColor: "#1a75ff" },
};

export default function ForgotPasswordForm() {
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const {
    register,
    watch,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<IUserResetPasswordItem>();

  const onSubmit = async (data: IUserResetPasswordItem) => {
    setIsResetPasswordLoading(true);
    try {
      const response = await resetPassword(data);
      if (response.status === 200)
        showSnackbar("Đổi mật khẩu thành công", "success");
      navigate("/auth");
    } catch (error: any) {
      setError("email", {
        type: "manual",
        message: error.message || "Có lỗi xảy ra, vui lòng thử lại!",
      });
    } finally {
      setIsResetPasswordLoading(false);
    }
  };

  const email = watch("email");

  const handleGetConfirmCode = async (email: string) => {
    if (!email) {
      setError("email", {
        type: "manual",
        message: "Vui lòng nhập email",
      });
      return;
    }

    setIsGetConfirmCodeLoading(true);
    try {
      const response = await sendResetPasswordCode(email);
      if (response.status === 200)
        showSnackbar(
          "Mã xác thực gồm 6 chữ số đã được gửi đến email của bạn",
          "success"
        );
    } catch (error: any) {
      setError("email", {
        type: "manual",
        message: error.message || "Có lỗi xảy ra, vui lòng thử lại!",
      });
    } finally {
      setIsGetConfirmCodeLoading(false);
    }
  };

  const firstError = Object.values(errors)[0] as any;

  const [isResetPasswordLoading, setIsResetPasswordLoading] = useState(false);
  const [isGetConfirmCodeLoading, setIsGetConfirmCodeLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const passwordValue = watch("password", "");
  const confirmPasswordValue = watch("confirmPassword", "");

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword((prev) => !prev);
  };

  const toggleConfirmNewPasswordVisibility = () => {
    setShowConfirmNewPassword((prev) => !prev);
  };

  return (
    <FormControl
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        width: "50%",
      }}
    >
      <Box sx={{ height: "50px", width: "100%", marginTop: "20px" }}>
        <Input
          {...register("email", {
            required: "Vui lòng nhập email",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Email không đúng định dạng",
            },
          })}
          sx={inputStyle}
          type="text"
          placeholder="Địa chỉ email"
        />
      </Box>

      <Box sx={{ height: "50px", width: "100%", marginTop: "20px" }}>
        <Input
          {...register("password", {
            required: "Mật khẩu là bắt buộc",
            minLength: {
              value: 8,
              message: "Mật khẩu phải có ít nhất 8 ký tự",
            },
            maxLength: {
              value: 16,
              message: "Mật khẩu phải có ít hơn 16 ký tự",
            },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,16}$/,
              message:
                "Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường, 1 số và có thể chứa ký tự đặc biệt",
            },
          })}
          sx={inputStyle}
          type={showNewPassword ? "text" : "password"}
          placeholder="Mật khẩu mới"
          endAdornment={
            passwordValue && (
              <InputAdornment position="end">
                <IconButton
                  onClick={toggleNewPasswordVisibility}
                  sx={{
                    "&:focus": {
                      outline: "none !important",
                    },
                  }}
                >
                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }
        />
      </Box>

      <Box sx={{ height: "50px", width: "100%", marginTop: "20px" }}>
        <Input
          {...register("confirmPassword", {
            required: "Vui lòng nhập lại mật khẩu",
            validate: (value) =>
              value === passwordValue || "Mật khẩu không giống nhau",
          })}
          sx={inputStyle}
          type={showConfirmNewPassword ? "text" : "password"}
          placeholder="Nhập lại mật khẩu mới"
          endAdornment={
            confirmPasswordValue && (
              <InputAdornment position="end">
                <IconButton
                  onClick={toggleConfirmNewPasswordVisibility}
                  sx={{
                    "&:focus": {
                      outline: "none !important",
                    },
                  }}
                >
                  {showConfirmNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }
        />
      </Box>

      <Box sx={{ display: "flex", gap: "10px" }}>
        <Box sx={{ height: "50px", width: "60%", marginTop: "20px" }}>
          <Input
            {...register("confirmCode", {
              required: "Vui lòng nhập mã xác thực",
              pattern: {
                value: /^\d{6}$/,
                message: "Mã xác thực phải có 6 chữ số",
              },
            })}
            sx={inputStyle}
            type="text"
            placeholder="Mã xác thực"
          />
        </Box>
        <Box
          sx={{
            position: "relative",
            width: "40%",
            height: "50px",
            borderRadius: "15px",
            overflow: "hidden",
            marginTop: "20px",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(to right, #003366, #004080, #0059b3, #0073e6)",
              zIndex: 0,
            }}
          />
          <LoadingButton
            loading={isGetConfirmCodeLoading}
            type="button"
            variant="contained"
            sx={{
              width: "100%",
              height: "100%",
              backgroundColor: "transparent",
              color: "#fff",
              fontSize: "12px",
              fontWeight: "600",
              position: "relative",
              textTransform: "none",
              zIndex: 1,
            }}
            onClick={() => handleGetConfirmCode(email)}
          >
            Nhận mã xác thực
          </LoadingButton>
        </Box>
      </Box>

      {firstError && (
        <Typography
          color="error"
          fontSize="14px"
          sx={{ mt: 2, mb: 2, textAlign: "center" }}
        >
          {firstError.message as string}
        </Typography>
      )}

      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "50px",
          borderRadius: "15px",
          overflow: "hidden",
          marginTop: "20px",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(to right, #003366, #004080, #0059b3, #0073e6)",
            zIndex: 0,
          }}
        />
        <LoadingButton
          loading={isResetPasswordLoading}
          type="submit"
          variant="contained"
          sx={{
            width: "100%",
            height: "100%",
            backgroundColor: "transparent",
            color: "#fff",
            fontSize: "16px",
            fontWeight: "600",
            position: "relative",
            textTransform: "none",
            zIndex: 1,
          }}
        >
          Đổi mật khẩu
        </LoadingButton>
      </Box>

      <Box sx={{ textAlign: "center", marginTop: "30px" }}>
        <Typography variant="body1" component="span">
          Nhớ mật khẩu?{" "}
        </Typography>
        <Link href="/auth" sx={{ cursor: "pointer" }} underline="hover">
          Đăng nhập
        </Link>
      </Box>
    </FormControl>
  );
}
