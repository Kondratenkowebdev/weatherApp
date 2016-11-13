import React, { Component }  from 'react';
import './SearchForm.sass';

export default class SearchForm extends Component {
	render() {
		return (
			<div>
				<form className="searchForm" onSubmit={ this.props.handleSubmit } >
					<div className={"errorMessage " + (this.props.showError ? 'active': '')}>
						{this.props.errorText}
					</div>
					<input className="searchInput" placeholder="Enter name of the city" onChange={this.props.handleChange} value={this.props.searchValue}/>
					<div className={"errorCity " + (this.props.validCity ? 'active': '')}>
						Did you mean <span className="link" onClick={ this.props.setValidCity }>{ this.props.validCity}</span> ?
					</div>
				</form>
			</div>
			)
	}
};