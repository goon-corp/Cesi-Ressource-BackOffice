import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from '../../pages/login';
import Detail from '../../pages/detail';

const Router = () => {
	return (
		<BrowserRouter>
			<Routes>(
					<>
						<Route path="/" element={<Login />} />
						<Route path="/login" element={<Login />} />
						<Route path="/detail" element={<Detail />} />

					</>
				)
			</Routes>
		</BrowserRouter>
	);
};

export default Router;
