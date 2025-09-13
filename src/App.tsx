import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./redux/store";
import AppRouter from "./routes/AppRouter";

function App() {
  // useEffect(() => {
  //   if (navigator.serviceWorker) {
  //     navigator.serviceWorker
  //       .register("../sw.js")
  //       .then(() => {
  //         console.log("SUCCESS");
  //       })
  //       .catch(() => {
  //         console.log("ERROR");
  //       });
  //   }
  // }, [navigator.serviceWorker]);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppRouter />
      </PersistGate>
    </Provider>
  );
}

export default App;
