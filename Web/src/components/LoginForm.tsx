import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Typography,
  Input,
  FormControl,
  Link,
  Button,
  FormControlLabel,
  Checkbox,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IUserLoginItem } from "../types/user";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { HOST_API } from "../config-global";

type Props = {
  shiftLeft: boolean;
  setShiftLeft: (shiftLeft: boolean) => void;
};

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

export default function LoginForm({ shiftLeft, setShiftLeft }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<IUserLoginItem>({
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const onSubmit = async (data: IUserLoginItem) => {
    try {
      const response = await login(data);
      if (response.status === 200) {
        navigate("/topics");
      } else {
        throw new Error(response.data.message || "Đăng nhập thất bại");
      }
    } catch (error: any) {
      setError("email", {
        type: "manual",
        message: error.message || "Có lỗi xảy ra, vui lòng thử lại!",
      });
    }
  };

  const loginWithGoogle = () => {
    const returnUrl = window.location.origin + "/auth/google-login-callback";
    window.location.href =
      `${HOST_API}/auth/google/login?returnUrl=` +
      encodeURIComponent(returnUrl);
  };

  const firstError = Object.values(errors)[0] as any;

  return (
    <FormControl
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        width: "50%",
        transition: "all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        transform: shiftLeft ? "translateX(-120%)" : "translateX(0)",
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
          })}
          sx={inputStyle}
          type={showPassword ? "text" : "password"}
          placeholder="Mật khẩu"
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                sx={{
                  "&:focus": {
                    outline: "none !important",
                  },
                }}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {watch("password") !== "" ? (
                  showPassword ? (
                    <VisibilityOff
                      sx={{
                        "&:focus": {
                          outline: "none !important",
                        },
                      }}
                    />
                  ) : (
                    <Visibility sx={{ outline: "none !important" }} />
                  )
                ) : (
                  ""
                )}
              </IconButton>
            </InputAdornment>
          }
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "10px",
        }}
      >
        <Link
          href="/auth/forgot-password"
          underline="none"
          sx={{
            fontSize: "20px",
            color: "#1a75ff",
            cursor: "pointer",
            fontWeight: 500,
            "&:hover": { textDecoration: "underline" },
          }}
        >
          Quên mật khẩu?
        </Link>
        <FormControlLabel
          control={
            <Checkbox {...register("remember")} checked={watch("remember")} />
          }
          label="Nhớ tôi"
        />
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
        <Button
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
          Đăng nhập
        </Button>
      </Box>

      <Box sx={{ textAlign: "center", marginTop: "30px" }}>
        <Typography variant="body1" component="span">
          Chưa có tài khoản?{" "}
        </Typography>
        <Link
          sx={{ cursor: "pointer" }}
          onClick={() => setShiftLeft(true)}
          variant="body1"
          underline="hover"
        >
          Đăng ký
        </Link>
      </Box>

      <Box sx={{ marginTop: "20px", textAlign: "center" }}>
        <Button
          onClick={loginWithGoogle}
          sx={{
            width: "100%",
            backgroundColor: "#fff",
            color: "#000",
            textTransform: "none",
            fontWeight: 600,
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "8px 16px",
            "&:hover": {
              backgroundColor: "#f0f0f0",
            },
          }}
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            style={{ width: "20px", marginRight: "10px" }}
          />
          Đăng nhập bằng Google
        </Button>
      </Box>
    </FormControl>
  );
}
