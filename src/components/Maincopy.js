import React, { useContext, useState, useEffect } from "react";
import cx from "clsx";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import grey from "@material-ui/core/colors/grey";

import { FirebaseContext } from "./Firebase";
import UserContext from "./UserContext";
import Constants from "./Constants";
import Header from "./Header";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: grey[300],
    },
  },
});

function Main(props) {
  const constants = useContext(Constants);
  const firebase = useContext(FirebaseContext);
  const userData = useContext(UserContext);
  const [lighting, setLight] = useState(true);
  const [sphere, setSphere] = useState(true);
  const toggle = () => setLight(!lighting);

  return (
    <ThemeProvider theme={theme}>
      <div className={cx("main", lighting && "dark", !lighting && "light")}>
        <Header
          toggle={toggle}
          lighting={lighting}
          sphereUp={hemisphere}
          sphere={sphere}
        />
      </div>
    </ThemeProvider>
  );
}

export default Main;
