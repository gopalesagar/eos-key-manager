import React from "react";
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'react-bootstrap';

import GenerateKeys from './components/GenerateKeys';
import SignMessage from './components/SignMessage';
import RecoverPublicKey from './components/RecoverPublicKey';
import Navigation from './components/Navigation';

function App() {
	return (
		<ThemeProvider breakpoints={['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']} minBreakpoint="xxs">
			<div className="App">
				<Router>
					<div>
						<Navigation />
						<Routes>
							<Route exact path="/" element={<GenerateKeys/>}/>
							<Route path="/sign" element={<SignMessage/>} />
							<Route path="/recover" element={<RecoverPublicKey/>} />
						</Routes>
					</div>
				</Router>
			</div>
		</ThemeProvider>
	);
}

export default App;
