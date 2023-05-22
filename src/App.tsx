/** @format */

import React, { useState } from 'react'
import './App.css'

console.clear()

type Players = {
	id: string
	position: number
	preposition: number
	chance: boolean
	color: string
	name: string
}
let chance = 0
function getRandomColor() {
	const letters = '0123456789ABCDEF'
	let color = '#'
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)]
	}
	return color
}
function App() {
	// const num: number = 34
	// const str: string = 'string'
	// const obj: object = { hello: 'world' }
	// const arr: Array<object> = [{ hello: 'sh' }, { world: 'sh' }]
	// console.clear();

	const [diceNum, setDiceNum] = useState<string>('')
	const [players, setPlayers] = useState<Players[]>([])
	const [blackhole, setBlackHoles] = useState<number[]>([5, 19, 28, 43, 51, 66, 80, 87, 92])

	function reverse(start: number, end: number, reverse: boolean) {
		let arr = []
		for (let i = start; i < end; i++) {
			arr.push(i)
		}
		return (reverse && arr.reverse()) || arr
	}
	function makeGrid(max: number = 100) {
		let rev = true
		let arr = []
		for (let i = 1; i <= max; i += 10) {
			if (i % 10 === 1) rev = !rev
			if (rev === false) {
				arr.push(reverse(i, i + 10, rev))
			}
			if (rev === true) {
				arr.push(reverse(i, i + 10, rev))
			}
		}
		// console.log(arr)
		return arr
	}
	const grid = makeGrid().reverse()
	function onAddPlayer() {
		setPlayers((ps) => [
			...ps,
			{
				id: generateId(),
				position: 1,
				preposition: 1,
				chance: false,
				name: 'Anonymous',
				color: getRandomColor(),
			},
		])
	}
	function onChangePlayer(e: React.FormEvent<HTMLInputElement>, pos: number = 1) {
		const data = players.map(
			(player) =>
				(player.id === e.currentTarget.id && {
					...player,
					position: pos,
					name: e.currentTarget.value,
				}) ||
				player
		)
		console.log(data)
		setPlayers(data)
	}
	function onDeletePlayer(id: string) {
		const data = players.filter((player) => player.id !== id)
		setPlayers(data)
	}
	function generateId() {
		return '_' + Math.ceil(Math.random() * 1000)
	}
	function randomeDice() {
		const num = Math.ceil(Math.random() * 6)
		// console.log(num)
		setDiceNum('roll')
		setTimeout(() => {
			setDiceNum('roll-' + num)
			movePlayer(num)
		}, 1000)
	}
	function movePlayer(position: number) {
		const getchance = changePlayerChance() - 1
		const data = players.map((player, index) =>
			index === getchance
				? {
						...player,
						position:
							(blackhole.includes(position) &&
								blackhole[Math.floor(Math.random() * blackhole.length)]) ||
							(player.position + position > 100 && 100) ||
							player.position + position,
						preposition: player.position,
						chance: true,
				  }
				: { ...player, chance: false }
		)
		setPlayers(data)
		function changePlayerChance() {
			chance = (chance < players.length && chance + 1) || 1
			console.log(chance)
			return chance
		}
	}
	function dangerBlock() {
		const arr = Array(10)
		// console.log(arr.map(() => Math.ceil(Math.random() * 100)))
	}
	dangerBlock()

	return (
		<div className='App'>
			<div className=' d-flex flex-wrap align-items-center justify-content-center gap-5'>
				<div>
					<div className='players'>
						<div className=' d-flex flex-column align-items-center gap-3'>
							<div className='d-flex'>
								<span className='me-5'>Players</span>
								<button className='btn-roll px-4 py-0' onClick={onAddPlayer}>
									+
								</button>
							</div>
							{players.map((player) => (
								<div
									key={player.id}
									className={`d-flex gap-2 align-items-center ${
										(player.chance && ' active-player ') || ''
									}`}>
									<div>
										<i
											className='player-marker'
											style={{ backgroundColor: player.color }}></i>
									</div>
									<input
										type='text'
										value={player.name}
										id={player.id}
										onChange={onChangePlayer}
									/>
									<div>
										<span>{player.position}</span>
									</div>
									<button
										className='btn-roll align-items-center px-2 py-0'
										onClick={() => onDeletePlayer(player.id)}>
										-
									</button>
								</div>
							))}
						</div>
					</div>
				</div>
				<div>
					<div className='grid'>
						{grid.map((row, ir) => (
							<div key={ir} className='row'>
								{row.map((col, ic) => (
									<div
										key={ic}
										className='col'
										// style={{ '--i': `${col / 5}s` } as React.CSSProperties}
									>
										<small className='position'>{col}</small>
										<i className='onboard-players d-flex flex-wrap'>
											{players.map((player, i) => {
												const delay = col / 50
												player.position >= col &&
													player.preposition <= col &&
													console.log(delay, col, player.preposition)
												return (
													player.position >= col &&
													player.preposition <= col && (
														<span
															key={i}
															className={`player-marker 
															${(player.position === col && 'active') || (player.preposition === col && 'deactive') || ''}
															`}
															style={
																{
																	backgroundColor: player.color,
																	'--delay': delay + 's',
																} as React.CSSProperties
															}></span>
													)
												)
											})}
										</i>
										{blackhole.includes(col) && (
											<img
												className='position-absolute top-0 start-0 m-auto'
												height={50}
												width={50}
												src='./blackhole.svg'
												alt=''
											/>
										)}
									</div>
								))}
							</div>
						))}
					</div>
				</div>
				<div>
					<div className='dice-wrap'>
						<div className={'dice ' + diceNum}>
							<div className='core'>
								<div className='front'>1</div>
								<div className='back'>2</div>
								<div className='left'>3</div>
								<div className='right'>4</div>
								<div className='top'>5</div>
								<div className='down'>6</div>
							</div>
						</div>
					</div>
				</div>
				<div>
					<button className='btn-roll' type='button' onClick={randomeDice}>
						ROLL
					</button>
				</div>
			</div>
		</div>
	)
}

export default App
