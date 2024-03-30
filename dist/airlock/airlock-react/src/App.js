import React from 'react';
import logo from './d3logo-green.svg';
import './App.css';
import { MoonbaseDashboard } from './Dashboard';
const App = () => {
    return (React.createElement("div", { className: "App", style: { backgroundColor: 'grey' } },
        React.createElement("div", { className: "App-header" },
            React.createElement("img", { src: logo, className: "App-logo", alt: "logo", width: "128" })),
        React.createElement("div", null,
            React.createElement(MoonbaseDashboard, null)),
        React.createElement("div", { className: "App-footer" },
            React.createElement("p", null, "d3"))));
};
export default App;
export * from './Dashboard';
export * from './Pod';
