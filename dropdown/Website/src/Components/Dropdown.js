import React, { Fragment } from 'react';
import '../CSS/Dropdown.css';
import _ from 'lodash';
import { limit } from '../config';

class Dropdown extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isDrop: false,
			selectLocation: 'Select a location',
			inputLocation: '',
			searchLocation: '',
			showAllLocations: false,
		};

		this.updateSearchLocation = _.debounce(this.updateSearchLocation, 300);
	}

	componentDidUpdate(prevProps, prevState) {
		if (!_.isEqual(prevProps.options, this.props.options)) {
			this.setState({ options: this.props.options });
		}

		if (prevState.searchLocation !== this.state.searchLocation) {
			const options = this.state.searchLocation
				? this.props.options.filter((option) => {
						return (
							option?.search(
								new RegExp(this.state.searchLocation, 'i')
							) > -1
						);
				  })
				: this.props.options;

			this.setState({ options });
		}
	}

	onSelect = (option) => {
		this.setState({ selectLocation: option });
	};

	openDropDown = () => {
		this.setState((state) => ({
			isDrop: !state.isDrop,
		}));
	};

	addNewCountry = () => {
		this.props.addNewCountry(this.state.searchLocation);
		this.onSelect(this.state.searchLocation);
		this.setState((state) => ({
			options: [...state.options, state.searchLocation],
			inputLocation: '',
			searchLocation: '',
		}));
	};

	renderOptions = () => {
		const { showAllLocations, options } = this.state;
		if (options.length === 0 && !this.state.searchLocation) {
			return <div>No Country Found ...</div>;
		}

		if (options.length === 0) {
			return (
				<div>
					<div className='dropdown-item-text'>
						"{this.state.searchLocation}" not found
					</div>
					{this.props.addNewCountry && (
						<div>
							<button
								className='btn'
								onClick={this.addNewCountry}
							>
								Add and Select
							</button>
						</div>
					)}
				</div>
			);
		}

		if (showAllLocations) {
			return options.map((option, index) => (
				<div key={index} onClick={() => this.onSelect(option)}>
					<span className='dropdown-item-text'>{option}</span>
				</div>
			));
		}

		return options.slice(0, limit).map((option, index) => (
			<div key={index} onClick={() => this.onSelect(option)}>
				<span className='dropdown-item-text'>{option}</span>
			</div>
		));
	};

	searchLocation = (event) => {
		this.setState({ inputLocation: event.target.value });
		this.updateSearchLocation();
	};

	updateSearchLocation() {
		this.setState({
			searchLocation: this.state.inputLocation,
		});
	}

	showMore = () => {
		this.setState({ showAllLocations: true, options: this.props.options });
	};

	renderSearchBox = () => {
		return (
			<div className='dd-search'>
				<i className='fa fa-search'></i>
				<input
					type='text'
					placeholder='Search...'
					value={this.state.inputLocation}
					onChange={this.searchLocation}
				/>
			</div>
		);
	};

	render() {
		const { selectLocation, isDrop, showAllLocations } = this.state;
		const { options } = this.props;

		return (
			<Fragment>
				<div className='dd-control' onClick={this.openDropDown}>
					{selectLocation}
					<i className={`fas fa-caret-${isDrop ? 'up' : 'down'}`}></i>
				</div>
				{isDrop && (
					<div className='dd-content'>
						{this.renderSearchBox()}
						{this.renderOptions()}
						{options.length > limit && !showAllLocations && (
							<div className='dd-footer'>
								<div className='more' onClick={this.showMore}>
									{options.length - limit} more...
								</div>
							</div>
						)}
					</div>
				)}
			</Fragment>
		);
	}
}

export default Dropdown;
