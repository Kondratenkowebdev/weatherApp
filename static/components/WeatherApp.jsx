import React, { Component }  from 'react';
import 'whatwg-fetch';
import 'es6-promise/auto';
import SearchForm from  './SearchForm/SearchForm.jsx';
import CityInfo  from './CityInfo/CityInfo.jsx';
import Api  from  './api.js';

export default class ContactList extends Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			citysJson: [],
			citysNames: [],
			searchValue: '',
			showError: false,
			errorText: '',
			validCity: ''
		}
	}

	componentDidMount() {
		if ( localStorage.getItem("citysArr") ) {
			let citysArr = localStorage.getItem("citysArr").split(',');
			this.setState(() => ({ 
				citysNames: citysArr
			}));
			for (let i = 0; i < citysArr.length; i++) {
				this.getData(citysArr[i])
			};
		}
	}

	getData = (city, writeCookie) => {
		Api.getWeather(city).then(data => {
			console.log(data)
			if (!data) {
				this.setState(() => ({
					errorText: 'Server error',
					showError: true,
				}));
				return;
			}

			if ( data.cod == 502 ) {
				this.setState(() => ({
					errorText: 'This city does not exist',
					showError: true,
				}));
				return
			}

			if (data.name.toLowerCase() !== city.toLowerCase()) {
				this.setState(() => ({
					errorText: 'An error in the name of the city',
					showError: true,
					validCity: data.name
				}));
				return
			}

			this.setState(() => ({
				citysJson: this.state.citysJson.concat([data])
			}));

			if ( writeCookie ) {
				this.addToLocalStorage( data.name.toLowerCase() );
			}
		})
	}

	handleSubmit = (e) => {
		e.preventDefault();
		if ( this.state.citysNames.indexOf( this.state.searchValue.toLowerCase() ) == -1 ) {
			this.setState(() => ({
				citysNames: this.state.citysNames.concat([this.state.searchValue.toLowerCase()])
			}));
			this.getData( this.state.searchValue, true );
		}else {
			this.setState(() => ({
				errorText: 'The city has already been added',
				showError: true
			}));
		}
		this.setState({ searchValue: '' });
	}

	deleteLocalStorage = (city) => {
		if (localStorage.getItem("citysArr") ) {
			var citysArr = localStorage.getItem("citysArr").split(',');
			if (citysArr.indexOf( city.toLowerCase() ) !== -1) {
				citysArr.splice( citysArr.indexOf( city.toLowerCase() ), 1);
				localStorage.setItem("citysArr", citysArr.join());
			}
		}
	}

	deleteInfo = (name) => {
		let citysArr = this.state.citysNames;
		var index = citysArr.indexOf( name.toLowerCase() );
		citysArr.splice( index, 1);
		this.setState(() => ({ citysNames: citysArr }));

		for (let i = 0; i < this.state.citysJson.length; i++) {
			let updateArr = this.state.citysJson;
			if ( this.state.citysJson[i].name == name) {
				updateArr.splice(i, 1); 
				this.setState(() => ({ citysJson: updateArr }));
				this.deleteLocalStorage(name);
				return
			}
		}
	}

	addToLocalStorage = (city) => {
		if ( localStorage.getItem("citysArr") ) {
			if ( localStorage.getItem("citysArr").indexOf(city) == -1 ) {
				let citysArr = localStorage.getItem("citysArr");
				localStorage.setItem("citysArr", citysArr+','+city);
			}
		}else {
			localStorage.setItem("citysArr", city);
		}
	}

	handleChange = (event) => {
		this.setState({ 
			searchValue: event.target.value,
			showError: false,
			validCity: ''
		});
	}

	setValidCity = (city) => {
		this.getData(this.state.validCity, true);

		this.setState(() => ({ 
			citysNames: this.state.citysNames.concat([this.state.validCity.toLowerCase()]),
			searchValue: '',
			showError: false,
			validCity: ''
		}));
	}

	render() {
		return (
			<div className="weatherAppWrapper">
				<SearchForm 
						errorText={this.state.errorText} 
						showError={this.state.showError}
						searchValue={this.state.searchValue} 
						handleChange={this.handleChange} 
						setValidCity={this.setValidCity} 
						validCity={this.state.validCity}
						handleSubmit={this.handleSubmit}
				/>
				<ul className="cityInfoWrapper clear">
					{
						this.state.citysJson.map((city, i) => {
							return <CityInfo 	key={ i } 
												deleteInfo={ this.deleteInfo }
												name={ city.name } 
												temp={ city.main.temp } 
												temp_max={ city.main.temp_max } 
												temp_min={ city.main.temp_min } 
												humidity={ city.main.humidity } 
												pressure={ city.main.pressure } 
												wind={ city.wind.speed } 
									/>
						})
					}
				</ul>
			</div>
		)
	}
};
