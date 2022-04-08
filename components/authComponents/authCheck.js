import { auth } from "../../utils/firebase/db";

import { Fragment } from "react";

import Unauthorized from "./unauthorized";

export default function AuthCheck({ children }) {
  return auth.currentUser ? <Fragment>{children}</Fragment> : <Unauthorized />;
}
