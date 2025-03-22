import "./App.css";
import FormularioDenuncia from "./Components/Form/FormDenuncia";
import Header from "./Components/Header";
import { Toaster } from "sonner";
import { BrowserRouter, Route, Routes } from "react-router";
import { Layout } from "./Components/Layout";
function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<FormularioDenuncia />}></Route>
					<Route
						path="/tracking-denuncia"
						element={<Header />}
					></Route>
				</Route>
			</Routes>
			<Toaster richColors closeButton />
		</BrowserRouter>
	);
}

export default App;
