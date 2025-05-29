import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Typography,
  Input,
  FormControl,
  Link,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { registerUser } from "../api/auth";
import { IUserRegisterItem } from "../types/user";

type Props = {
  shiftLeft: boolean;
  setShiftLeft: (value: boolean) => void;
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

export default function SignupForm({ shiftLeft, setShiftLeft }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<IUserRegisterItem>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordValue = watch("password", "");
  const confirmPasswordValue = watch("confirmPassword", "");

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const onSubmit = async (data: IUserRegisterItem) => {
    try {
      const response = await registerUser(data);
      if (response.status === 201) {
        setShiftLeft(false);
      } else {
        throw new Error(response.data.message || "Đăng ký thất bại");
      }
    } catch (error: any) {
      setError("email", {
        type: "manual",
        message: error.message || "Có lỗi xảy ra, vui lòng thử lại!",
      });
    }
  };

  const firstError =
    errors.firstName?.message ||
    errors.lastName?.message ||
    errors.email?.message ||
    errors.password?.message ||
    errors.confirmPassword?.message;

  return (
    <FormControl
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        width: "50%",
        transition: "all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        transform: shiftLeft ? "translateX(-100%)" : "translateX(20%)",
      }}
    >
      <Box sx={{ height: "50px", width: "100%", marginTop: "20px" }}>
        <Input
          {...register("firstName", { required: "Họ là bắt buộc" })}
          sx={inputStyle}
          type="text"
          placeholder="Họ"
        />
      </Box>

      <Box sx={{ height: "50px", width: "100%", marginTop: "20px" }}>
        <Input
          {...register("lastName", { required: "Tên là bắt buộc" })}
          sx={inputStyle}
          type="text"
          placeholder="Tên"
        />
      </Box>

      <Box sx={{ height: "50px", width: "100%", marginTop: "20px" }}>
        <Input
          {...register("email", {
            required: "Email là bắt buộc",
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
          type={showPassword ? "text" : "password"}
          placeholder="Mật khẩu"
          endAdornment={
            passwordValue && (
              <InputAdornment position="end">
                <IconButton
                  onClick={togglePasswordVisibility}
                  sx={{
                    "&:focus": {
                      outline: "none !important",
                    },
                  }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
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
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Nhập lại mật khẩu"
          endAdornment={
            confirmPasswordValue && (
              <InputAdornment position="end">
                <IconButton
                  onClick={toggleConfirmPasswordVisibility}
                  sx={{
                    "&:focus": {
                      outline: "none !important",
                    },
                  }}
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }
        />
      </Box>

      {firstError && (
        <Typography
          color="error"
          fontSize="14px"
          sx={{ mt: 2, textAlign: "center" }}
        >
          {firstError as string}
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
            transition: "all 0.4s ease",
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
          Đăng ký
        </Button>
      </Box>

      <Box sx={{ textAlign: "center", marginTop: "30px" }}>
        <Typography variant="body1" component="span">
          Đã có tài khoản?{" "}
        </Typography>
        <Link
          sx={{ cursor: "pointer" }}
          onClick={() => setShiftLeft(false)}
          variant="body1"
          underline="hover"
        >
          Đăng nhập
        </Link>
      </Box>
    </FormControl>
  );
}
