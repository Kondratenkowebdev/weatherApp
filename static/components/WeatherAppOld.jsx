import React, { Component }  from 'react';
import SearchForm from  './SearchForm/SearchForm.jsx';
import CityInfo  from  './CityInfo/CityInfo.jsx';

export default class ContactList extends Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			citysJson: [],
			citysNames: [],
			searchValue: '',
			searchError: false,
			errorName: '',
			validCity: ''
		}
	}

	componentDidMount() {
		if (typeof(Storage) !== "undefined") {
			if ( localStorage.getItem("citysArr") ) {
				var citysArr = localStorage.getItem("citysArr").split(',');

				this.setState(() => ({ citysNames: citysArr }));

				citysArr.forEach((city) => {
					this.getData(city);
				});
			}
		} else {
			console.log('Sorry! No Web Storage support')
		}
		
		localStorage.removeItem('citysArr');
	}

	getData = (city, writeCookie) => {
		let apiKey = 'c5e94c788664f9506e9ede3a27d5660f';
		fetch('http://api.openweathermap.org/data/2.5/weather?q='+city+'&APPID='+apiKey+'&units=metric').then(r => r.json())
			.then(data => {
				if ( data.cod == 502 ) {
					this.setState(() => ({ searchError: true }));
					return
				}

				if ( data.name.toLowerCase() !== city.toLowerCase() ) {
					this.setState(() => ({ 
						searchError: true,
						errorName: data.name
					}));
					return
				}

				this.setState(() => ({ citysJson: this.state.citysJson.concat([data]) }));

				if ( writeCookie ) {
					this.writeLocalStorage( data.name.toLowerCase() );
				}

				console.log(this.state.citysJson)
			})
			.catch(e => {
				console.log(e);
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
		console.log(city)
		if (typeof(Storage) !== "undefined") {
			if ( localStorage.getItem("citysArr") ) {
				var citysArr = localStorage.getItem("citysArr").split(',');
				if ( citysArr.indexOf( city.toLowerCase() ) !== -1 ) {
					citysArr.splice( citysArr.indexOf( city.toLowerCase() ), 1);

					localStorage.setItem("citysArr", citysArr.join());
				}
			}
		} else {
			console.log('Sorry! No Web Storage support')
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
					var citysArr = localStorage.getItem("citysArr");
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
			searchError: false
		});
	}

	validCity = (city) => {
		this.getData(this.state.errorName, true);
		this.setState(() => ({ 
			searchValue: '',
			searchError: false
		}));
	}

	render() {
		return (
			<div className="weatherAppWrapper">
				<SearchForm 
						errorName={this.state.errorName} 
						value={ this.state.searchValue } 
						handleChange={ this.handleChange } 
						getData={ this.getData } 
						searchError={this.state.searchError} 
						validCity={this.validCity}
						handleSubmit={this.handleSubmit}
				/>
				<ul className="cityInfoWrapper">
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
