import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./Components/Layout/Layout";
import { Home } from "./Pages/Home/Home";
import { Pronostico } from "./Pages/Pronostico/Pronostico";
import { Ajustes } from "./Pages/Ajustes/Ajustes";

export const App = () => {
    return (
        <BrowserRouter>
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
