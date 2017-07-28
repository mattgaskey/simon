var React = require('react');
require('../index.css');
var ReactRouter = require('react-router-dom');
var Router = ReactRouter.BrowserRouter;
var Route = ReactRouter.Route;
var Switch = ReactRouter.Switch;

class GridBlock extends React.Component {
	constructor(props) {
		super(props);

		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		this.props.playerMove(this.props.color);
	}

	render() {
		return(
			<div 
				className={'grid-block ' + this.props.color}
				onClick={this.handleClick}
			>
			</div>
		)
	}
}

class Controls extends React.Component {
	constructor(props) {
		super(props);


	}

	render() {
		return(
			<div className='controls'>
				Simon!
			</div>
		)
	}
}

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			grid: ['red', 'blue', 'yellow', 'green'],
			round: 1,
			matchSequence: [],
			playerSequence: []
		}

		this.updatePlayerSequence = this.updatePlayerSequence.bind(this);
	}

	updatePlayerSequence(move) {
		var arrayvar = this.state.playerSequence;
		arrayvar.push(move);

		this.setState(function() {
			return {
				playerSequence: arrayvar
			}
		});
	}

	render() {
		return (
			<div className='container'>
				<GridBlock color='red' playerMove={this.updatePlayerSequence}/>
				<GridBlock color='blue' playerMove={this.updatePlayerSequence}/>
				<GridBlock color='yellow' playerMove={this.updatePlayerSequence}/>
				<GridBlock color='green' playerMove={this.updatePlayerSequence}/>
				<Controls />
			</div>
		)
	}
}

module.exports = App;