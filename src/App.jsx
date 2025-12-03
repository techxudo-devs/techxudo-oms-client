import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "./shared/store/store";
import Routes from "./shared/components/Routes";
import { Toaster } from "sonner";
import { ThemeProvider } from "./shared/context/ThemeContext.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <ThemeProvider>
          <Toaster position="bottom-right" richColors />
          <Routes />
        </ThemeProvider>
      </Provider>
    </BrowserRouter>
  );
};

export default App;
