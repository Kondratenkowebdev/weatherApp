import React, { Component }  from 'react';
import './CityInfo.sass'

export default class CityInfo extends Component {
	deleteInfo = (e) => {
		this.props.deleteInfo( this.props.name );
	}

	render() {
		return (
			<li className="cityInfo">
				<h2>{ this.props.name }</h2>
				<ul className="weatherUl">
					<li>Температура: { this.props.temp } °C</li>
					<li>Диапазон температур { this.props.temp_min }...{ this.props.temp_max } °C</li>
					<li>Влажность: {this.props.humidity}%</li>
					<li>Давление: { (this.props.pressure*0.75).toFixed(0) } мм рт. ст.</li>
					<li>Скорость ветра: {this.props.wind} м/c</li>
				</ul>
				<i className="deleteIcon" onClick={ this.deleteInfo }></i>
			</li>
		)
	}
};
