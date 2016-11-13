import React, { Component }  from 'react';
import 'whatwg-fetch';
import 'es6-promise/auto';
import SearchForm from  './SearchForm/SearchForm.jsx';
import CityInfo  from  './CityInfo/CityInfo.jsx';

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
		if ( typeof(Storage) !== "undefined" ) {
			if ( localStorage.getItem("citysArr") ) {
				let citysArr = localStorage.getItem("citysArr").split(',');
				this.setState(() => ({ 
					citysNames: citysArr
				}));
				for (let i = 0; i < citysArr.length; i++) {
					this.getData(citysArr[i])
				};
			}
		} else {
			this.setState(() => ({
				errorText: 'Sorry! Your browser do not have Web Storage support',
				showError: true
			}));
		}
	}

	getData = (city, writeCookie) => {
		let apiKey = 'c5e94c788664f9506e9ede3a27d5660f';
		fetch('http://api.openweathermap.org/data/2.5/weather?q='+city+'&APPID='+apiKey+'&units=metric').then(r => r.json())
			.then(data => {
				if ( data.cod == 502 ) {
					this.setState(() => ({
						errorText: 'This city does not exist'
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
					this.writeLocalStorage( data.name.toLowerCase() );
				}
			})
			.catch(e => {
				this.setState(() => ({
					errorText: 'Error getting data from the server',
					showError: true
				}));
			});
	}

	handleSubmit = (e) => {
		e.preventDefault();
		if ( this.state.citysNames.indexOf( this.state.searchValue.toLowerCase() ) == -1 ) {
			this.getData( this.state.searchValue, true );
		}
		this.setState(() => ({ searchValue: '' }));
	}

	deleteLocalStorage = (city) => {
		if (typeof(Storage) !== "undefined") {
			if (localStorage.getItem("citysArr") ) {
				var citysArr = localStorage.getItem("citysArr").split(',');
				if (citysArr.indexOf( city.toLowerCase() ) !== -1) {
					citysArr.splice( citysArr.indexOf( city.toLowerCase() ), 1);
					localStorage.setItem("citysArr", citysArr.join());
				}
			}
		} else {
			this.setState(() => ({
				errorText: 'Sorry! Your browser do not have Web Storage support',
				showError: true
			}));
		}
	}

	deleteInfo = (name) => {
		for (let i = 0; i < this.state.citysJson.length; i++) {
			let updateArr = this.state.citysJson;
			if ( this.state.citysJson[i].name == name) {
				updateArr.splice(i, 1); 
				this.setState(() => ({ citysJson: updateArr }));
				this.deleteLocalStorage(name);
				return
			}
		};
	}

	writeLocalStorage = (city) => {
		if (typeof(Storage) !== "undefined") {
			if ( localStorage.getItem("citysArr") ) {
				if ( localStorage.getItem("citysArr").indexOf(city) == -1 ) {
					let citysArr = localStorage.getItem("citysArr");
					localStorage.setItem("citysArr", citysArr+','+city);
				}
			}else {
				localStorage.setItem("citysArr", city);
			}
		} else {
			console.log('Sorry! No Web Storage support')
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
