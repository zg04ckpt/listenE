import { motion } from "framer-motion";
import { Button } from "@mui/material";

export default function IconButton({ children, ...props }: any) {
  return (
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
      <Button
        size="small"
        sx={{
          minWidth: "unset",
          width: 36,
          height: 36,
          borderRadius: "50%",
          p: 0,
        }}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
}
