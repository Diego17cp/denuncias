import "./App.css";
import FormularioDenuncia from "./Components/Form/FormDenuncia";
import { Toaster } from "sonner";
import { BrowserRouter, Route, Routes } from "react-router";
import { Layout } from "./Components/Layout";
import { TrackingDenuncia } from "./pages/Tracking/TrackingDenuncia";
function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<FormularioDenuncia />}></Route>
					<Route
						path="/tracking-denuncia"
						element={<TrackingDenuncia />}
					></Route>
				</Route>
			</Routes>
			<Toaster richColors closeButton />
		</BrowserRouter>
	);
}

export default App;
