var React = require('react');
require('../index.css');
var ReactRouter = require('react-router-dom');
var Router = ReactRouter.BrowserRouter;
var Route = ReactRouter.Route;
var Switch = ReactRouter.Switch;

function GridBlock(props) {

	var handleClick = function() {
		props.playerMove(props.color);
	}

	var componentClasses = ['grid-block', props.color];
	if (props.power) {
		componentClasses.push('flash');
	}

	return(
		<div 
			className={ componentClasses.join(' ') }
			onClick={handleClick}
			id={props.color}
		>
		</div>
	)
}


function Controls(props) {
	
	var powerButton = function() {
		if (!props.power) {
			props.powerUp();
		}
		if (props.power) {
			props.powerDown();
		}
	}

	return(
		<div className='controls'>
			<div className='controls-relative-container'>
				<div className='simon'>Simon!</div>
				<div className='counter'>{props.round}</div>
				<div className='power' onClick={powerButton}>Power</div>
			</div>
		</div>
	)
}

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			grid: ['red', 'blue', 'yellow', 'green'],
			round: 0,
			matchSequence: [],
			playerSequence: [],
			power: false,
			initState: false
		}

		this.updatePlayerSequence = this.updatePlayerSequence.bind(this);
		this.powerDown = this.powerDown.bind(this);
		this.powerUp = this.powerUp.bind(this);
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

	powerDown() {
		this.setState(function() {
			return {
				round: 0,
				matchSequence: [],
				playerSequence: [],
				power: false
			}
		});
	}

	powerUp() {
		this.setState(function() {
			return {
				round: 1,
				power: true
			}
		});
	}

	render() {
		return (
			<div className='container'>
				<GridBlock color='red' playerMove={this.updatePlayerSequence} power={this.state.power}/>
				<GridBlock color='blue' playerMove={this.updatePlayerSequence} power={this.state.power}/>
				<GridBlock color='green' playerMove={this.updatePlayerSequence} power={this.state.power}/>
				<GridBlock color='yellow' playerMove={this.updatePlayerSequence} power={this.state.power}/>
				<Controls 
					round={this.state.round}
					power={this.state.power}
					powerUp={this.powerUp}
					powerDown={this.powerDown}
				/>
			</div>
		)
	}
}

module.exports = App;