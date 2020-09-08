import React from 'react';
import axios from 'axios';
import Dropdown from './Dropdown';
import _ from 'lodash';

const api = 'http://localhost:3000/locations';
class Form extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			countryList: [],
		};
	}

	componentDidMount() {
		this.getCountryList();
	}

	getCountryList = () => {
		return axios
			.get(api)
			.then((response) => {
				this.setState({
					countryList: _.map(response.data, (d) => {
						return d.location;
					}),
				});
			})
			.catch((error) => {
				console.log(error);
			});
	};

	addCountry = (location) => {
		return axios
			.post(api, { location })
			.then(() => {
				this.getCountryList();
			})
			.catch((error) => {
				console.log(error);
			});
	};

	render() {
		return (
			<div className='row'>
				<div className='col-sm-12'>
					<div className='form-group'>
						<div className='form-group row'>
							<label className='col-sm-4 col-form-label text-sm-right'>
								Location:
							</label>
							<div className='col-sm-6'>
								<Dropdown
									options={this.state.countryList}
									addNewCountry={(option) =>
										this.addCountry(option)
									}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Form;
