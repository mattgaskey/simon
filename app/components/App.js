var React = require('react');
require('../index.css');
var ReactRouter = require('react-router-dom');


//Each game square is a component
class GridBlock extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			flash: ''
		}

		this.handleClick = this.handleClick.bind(this);
	}

	//adds the color name to the playerSequence array list
	handleClick() {
		this.props.playerMove(this.props.color);
	}

	render() {

		//class toggle from props for initial flash of all game squares
		var componentClasses = ['grid-block', this.props.color];
			if (this.props.init) {
				componentClasses.push('flash');
			}

		return(
			<div 
				className={ componentClasses.join(' ') }
				onClick={this.handleClick}
				id={this.props.color}
			>
			</div>
		)
	}
}

//Controls area is its own component
function Controls(props) {
	
	//power button slider sets/resets initial state
	var powerButton = function() {
		if (!props.power) {
			props.powerUp();
		}
		if (props.power) {
			props.powerDown();
		}
	}

	//class toggle for display on/off
	var counterClasses = ['counter'];
	if (!props.power) {
		counterClasses.push('counter-faded');
	}

	return(
		<div className='controls'>
			<div className='controls-relative-container'>
				<div className='simon'>Simon!</div>
				<div className='counter-bg'>88</div>
				<div className={ counterClasses.join(' ') }>{props.round}</div>
				<div className='label-off'>OFF</div>
				<div className='power'>
					<label className="switch">
					  <input type="checkbox" onClick={powerButton} />
					  <span className="slider round"></span>
					</label>
				</div>
				<div className='label-on'>ON</div>
			</div>
		</div>
	)
}

//main App parent component
class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			//used to translate computer choice from random number to 
			//color association
			grid: ['red', 'blue', 'yellow', 'green'],
			//round counter for display and game status check
			round: 0,
			//computer-built sequence
			matchSequence: [],
			//player-built sequence
			playerSequence: [],
			//power toggle
			power: false,
			//state passed to GridBlocks for initial flash
			initState: false,
			//turn status handler, keeps user clicks in check
			playerTurn: false
		}

		this.updatePlayerSequence = this.updatePlayerSequence.bind(this);
		this.computerMove = this.computerMove.bind(this);
		this.checkPlayerMove = this.checkPlayerMove.bind(this);
		this.playerMistake = this.playerMistake.bind(this);
		this.playerSuccess = this.playerSuccess.bind(this);
		this.init = this.init.bind(this);
		this.powerDown = this.powerDown.bind(this);
		this.powerUp = this.powerUp.bind(this);
	}

	//add player's game square click to playerSequence array list
	updatePlayerSequence(move) {
		if (this.state.playerTurn) {
			var arrayvar = this.state.playerSequence;
			arrayvar.push(move);

			this.setState(function() {
				return {
					playerSequence: arrayvar
				}
			});

			//check game status after every click
			this.checkPlayerMove();
		}
	}

	//choose random number between 0 and 3 and add the item from 
	//grid array to the matchSequence array
	computerMove() {
		var x = Math.floor(Math.random() * 4);
		var move = this.state.grid[x];
		var arrayvar = this.state.matchSequence;
		arrayvar.push(move);

		this.setState(function() {
			return {
				matchSequence: arrayvar,
				playerTurn: true
			}
		});
	}

	//logic selector to check player moves against the matchSequence
	checkPlayerMove() {
		var n = this.state.playerSequence.length;
		var lastMove = this.state.playerSequence[n - 1];
		var matchSoFar = this.state.matchSequence[n - 1];

		//player makes a move which does not match the matchSequence
		if (matchSoFar !== lastMove) {
			this.playerMistake();
		}

		//player has successfully matched the entire matchSequence
		if (this.state.matchSequence.length === n && matchSoFar === lastMove) {
			this.playerSuccess();
			setTimeout(this.computerMove(), 500);
		}	

		//becuase player moves are checked after each addition, 
		//no need to check for positive moves that do not complete
		//the round
	}

	//reset to initial state
	playerMistake() {
		this.setState(function() {
			return {
				round: 1,
				playerTurn: false,
				matchSequence: [],
				playerSequence: [],
				initState: true
			}
		});
		setTimeout(this.init, 1000);
	}

	//increment the round, reset playerSequence and add computer move
	//to matchSequence 
	playerSuccess() {
		var x = this.state.round + 1;
		this.setState(function() {
			return {
				round: x,
				playerTurn: false,
				playerSequence: []
			}
		});
	}

	//first round is automatic after init flash
	init() {
		this.computerMove();
		this.setState(function() {
			return {
				initState: false
			}
		});
	}

	//power off, reset all states
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

	//power on and begin init
	powerUp() {
		this.setState(function() {
			return {
				round: 1,
				power: true,
				initState: true
			}
		});
		setTimeout(this.init, 1000);
	}

	render() {
		return (
			<div className='container'>
				<GridBlock color='red' 
					playerMove={this.updatePlayerSequence}
					init={this.state.initState}
				/>
				<GridBlock color='blue' 
					playerMove={this.updatePlayerSequence}
					init={this.state.initState}
				/>
				<GridBlock color='green' 
					playerMove={this.updatePlayerSequence}  
					init={this.state.initState}
				/>
				<GridBlock color='yellow' 
					playerMove={this.updatePlayerSequence} 
					init={this.state.initState}
				/>
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