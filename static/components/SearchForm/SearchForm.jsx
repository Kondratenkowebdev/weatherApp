import React, { Component }  from 'react';
import './SearchForm.sass';
import classNames from 'classnames';

export default class extends Component {
	render() {
		return (
			<div>
				<form className="searchForm" onSubmit={ this.props.handleSubmit } >
					<div className={ classNames( 'errorMessage', {'active': this.props.showError} ) }>
						{this.props.errorText}
					</div>
					<input className="searchInput" placeholder="Enter name of the city" onChange={this.props.handleChange} value={this.props.searchValue}/>
					<div className={ classNames( 'errorCity', {'active': this.props.validCity} ) } >
						Did you mean 
						<span className="link" onClick={ this.props.setValidCity }>
							 {this.props.validCity}
						</span>
						?
					</div>
				</form>
			</div>
			)
	}
};