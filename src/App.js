import React from "react";
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import GenerateKeys from './components/GenerateKeys';
import SignMessage from './components/SignMessage';
import RecoverPublicKey from './components/RecoverPublicKey';
import Error from './components/Error';
import Navigation from './components/Navigation';

function App() {
	return (
		<div className="App">
			<Router>
				<div>
					<Navigation />
					<Routes>
						<Route exact path="/" element={<GenerateKeys/>}/>
						<Route path="/sign" element={<SignMessage/>} />
						<Route path="/recover" element={<RecoverPublicKey/>} />
						<Route component={Error} />
					</Routes>
				</div>
			</Router>
		</div>
	);
}

export default App;
