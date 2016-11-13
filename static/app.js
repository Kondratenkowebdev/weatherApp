import React, { Component } from 'react';
import { render } from 'react-dom';
import 'babel-polyfill'
import WeatherApp from './components/WeatherApp.jsx';
import './sass/style.sass';

render (
	<WeatherApp />,
	document.getElementById("weatherApp")
);