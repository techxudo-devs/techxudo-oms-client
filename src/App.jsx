import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "./shared/store/store";
import Routes from "./shared/components/Routes";
import { Toaster } from "sonner";

const App = () => {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <Toaster position="bottom-right" richColors />
        <Routes />
      </Provider>
    </BrowserRouter>
  );
};

export default App;
