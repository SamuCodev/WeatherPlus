import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./Components/Layout/Layout";
import { Home } from "./Pages/Home/Home";
import { Pronostico } from "./Pages/Pronostico/Pronostico";
import { Ajustes } from "./Pages/Ajustes/Ajustes";
import { Toaster } from "react-hot-toast";

export const App = () => {
    return (
        <BrowserRouter>
            <Toaster
                position="bottom-right"
                reverseOrder={false}
                toastOptions={{
                    style: {
                        background: "var(--tarjeta)",
                        color: "var(--texto)",
                        border: "1px solid var(--borde)",
                        borderRadius: "var(--radio-md)",
                    },
                }}
            />
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/pronostico" element={<Pronostico />} />
                    <Route path="/ajustes" element={<Ajustes />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};
