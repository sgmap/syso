import { ControlledEditor } from '@monaco-editor/react'
import { buildFlatRules } from 'Engine/rules'
import { serializeUnit } from 'Engine/units'
import { safeLoad } from 'js-yaml'
import React, { useEffect, useState } from 'react'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import { analysisWithDefaultsSelector } from 'Selectors/analyseSelectors'
import { setSimulationConfig } from '../../actions/actions'
import { Header } from './Header'

let initialInput = `
a: 
  formule: 10
b: 
  formule: a + 18
c:
  formule:
    multiplication: 
      assiette: 2000
      taux: 3%
d:
  formule: a + b + c
`

export default function SafeStudio() {
	return (
		<div className="app-content ui__ container" css="margin-bottom: 2rem">
			<Header noSubtitle sectionName="Studio" />
			<ErrorBoundary>
				<Studio />
			</ErrorBoundary>
		</div>
	)
}
export function Studio() {
	const defaultTarget = 'b'
	const [ready, setReady] = useState(false)
	const [value, setValue] = useState(initialInput)
	const [target, setTarget] = useState(defaultTarget)

	const dispatch = useDispatch()

	const setRules = rulesString =>
		dispatch({
			type: 'SET_RULES',
			rules: buildFlatRules(safeLoad(rulesString))
		})
	const setTargets = targets =>
		dispatch(setSimulationConfig({ objectifs: targets }))

	useEffect(() => {
		setRules(initialInput)
		setTargets([defaultTarget])
		setReady(true)
	}, [])

	function onChange(ev, newValue) {
		setValue(newValue)
	}

	function updateRules() {
		setTargets([target])
		setRules(value)
	}

	return (
		<div>
			Construisez votre modèle ici :
			<ControlledEditor
				height="40vh"
				language="yaml"
				value={value}
				onChange={onChange}
				options={{ minimap: { enabled: false } }}
			/>
			<div>
				<label htmlFor="objectif">Que voulez-vous calculer ? </label>
				<input
					id="objectif"
					value={target}
					onChange={e => setTarget(e.target.value)}
				/>
			</div>
			<button
				css="display: block; margin-top: 1rem"
				className="ui__ button small"
				onClick={() => updateRules()}
			>
				{emoji('▶️')} Mettre à jour
			</button>
			{ready && <Results />}
		</div>
	)
}
export const Results = () => {
	const analysis = useSelector(state => analysisWithDefaultsSelector(state))
		?.targets[0]
	console.log(analysis)
	return (
		<div>
			<h2>Résultats</h2>
			<ul>
				<li>Valeur : {analysis.nodeValue}</li>
				<li>
					Unité : {analysis.unit ? serializeUnit(analysis.unit) : 'Sans unité'}
				</li>
				<li>Applicable : {analysis.isApplicable ? '✅' : '❌'}</li>
			</ul>
		</div>
	)
}

class ErrorBoundary extends React.Component {
	state = {
		error: false
	}
	static getDerivedStateFromError(error) {
		// Mettez à jour l'état, de façon à montrer l'UI de repli au prochain rendu.
		return { error }
	}

	render() {
		return (
			<>
				{this.state.error && (
					<p css="max-height: 4rem; overflow: hidden; border: 3px solid red;">
						Erreur :{' '}
						{
							this.state.error.message.split(
								'The error may be correlated with'
							)[0]
						}
					</p>
				)}
				{this.props.children}
			</>
		)
	}
}
