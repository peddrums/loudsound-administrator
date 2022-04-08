import Link from "next/link";

import { Typography } from "@mui/material";

export default function Unauthorized() {
  return (
    <div>
      <Typography variant="body1">
        Login Required:{" "}
        <Link href="/login" passHref>
          <a>Login</a>
        </Link>
      </Typography>
    </div>
  );
}
