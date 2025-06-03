import { Children } from "react";

import Box from "@mui/material/Box";
import Typography, { TypographyProps } from "@mui/material/Typography";

export default function Empty({
  color = "textSecondary",
  children,
}: React.PropsWithChildren<{ color?: TypographyProps["color"] }>) {
  return (
    <Box padding={2}>
      {Children.map(children, (child) => {
        if (typeof child === "string") {
          return (
            <Typography color={color} align="center">
              {child}
            </Typography>
          );
        }
        return child;
      })}
    </Box>
  );
}
