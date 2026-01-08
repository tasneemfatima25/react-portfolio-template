import React, { useEffect, useState } from "react";
import CustomCursor from "custom-cursor-react";
import "custom-cursor-react/dist/index.css";
import { useTheme } from "next-themes";

const Cursor = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <CustomCursor
      /* ONLY interactive elements */
      targets={["a", "button", ".cursor-hover"]}

      customClass="custom-cursor"
      dimensions={18}          // ⬅ smaller
      fill={theme === "dark" ? "#000000" : "#ffffff"}
      smoothness={{
        movement: 0.12,        // ⬅ smoother
        scale: 0.08,
        opacity: 0.2,
      }}

      targetOpacity={0.4}
      targetScale={1.4}        // ⬅ less aggressive
    />
  );
};

export default Cursor;
