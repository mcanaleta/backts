import { GlobalContextProvider } from "./contexts/global.context";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./layout";
import ReactDOM from "react-dom/client";
import React from "react";
import { initFirebase } from "./utils/firebase.utils";
import { createTheme, ThemeProvider } from "@mui/material";

export type BackTsPage = {
  path: string;
  title: string;
  element: JSX.Element;
};

export type BackTsProps = {
  pages: (() => JSX.Element)[];
  wrapper?: (props: { children: JSX.Element }) => JSX.Element;
  title: string;
  projectId: string;
  firebaseConfig: {
    apiKey: string;
    appId: string;
    measurementId?: string;
  };
};

export function BackTs(props: BackTsProps) {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout {...props} />,
      children: [
        ...props.pages.map((Page) => ({
          path: (Page as any).path,
          element: <Page />,
        })),
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

const theme = createTheme({
  // palette: {
  //   action: {
  //     disabled: "white",
  //     disabledBackground: "#4040ff",
  //   },
  // },
});

export function renderBackTs(props: BackTsProps) {
  const fsInit = initFirebase({
    projectId: props.projectId,
    firebaseConfig: props.firebaseConfig,
  });
  const Wrapper = props.wrapper || (({ children }) => children);
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <Wrapper>
        <ThemeProvider theme={theme}>
          <GlobalContextProvider firebaseInit={fsInit}>
            <BackTs {...props} />
          </GlobalContextProvider>
        </ThemeProvider>
      </Wrapper>
    </React.StrictMode>
  );
}
