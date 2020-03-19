import RuleLink from 'Components/RuleLink'
import {
	EngineContext,
	Evaluation,
	Provider,
	useEvaluation
} from 'Engine/react'
import RuleInput from 'Engine/RuleInput'
import React, { useContext, useState } from 'react'
import styled from 'styled-components'

const extraRules = `
contrat salarié . rémunération . net . sans chômage partiel:
	formule:
		recalcul:
			règle: contrat salarié . rémunération . net
			avec:
				contrat salarié . chômage partiel: non

perte de revenu chômage partiel:
	formule:
		somme:
			- contrat salarié . rémunération . net
			- (- contrat salarié . rémunération . net . sans chômage partiel)
`

export default function Coronavirus() {
	return (
		<>
			<h1>Coronavirus et chômage partiel : quel impact sur mes revenus ?</h1>
			<p>
				Le gouvernement met en place des mesures de soutien aux salariés et
				indépendants touchés par la crise du Coronavirus. Nos simulateurs
				permettent d'estimer l'impact de ces mesures sur vos revenus.
			</p>
			<SimulateurSalarié />
		</>
	)
}

function SimulateurSalarié() {
	const [situation, setSituation] = useState({
		'contrat salarié . chômage partiel': 'oui',
		'contrat salarié . chômage partiel . heures chômées': 30
	})
	const tempsPlein = 151.67
	return (
		<Provider situation={situation} extra={extraRules}>
			<section className="ui__ light card">
				<div id="targetSelection">
					<ul className="targets">
						<SimpleField
							dottedName={'contrat salarié . rémunération . brut de base'}
							onChange={value =>
								setSituation(state => ({
									...state,
									'contrat salarié . rémunération . brut de base': value
								}))
							}
						/>
						{/* <SimpleField
							dottedName={
								'contrat salarié . chômage partiel . heures chômées . proportion'
							}
							onChange={value =>
								setSituation(state => ({
									...state,
									'contrat salarié . chômage partiel . heures chômées . proportion': value
								}))
							}
						/> */}
					</ul>
				</div>
			</section>
			<div
				className="ui__ card"
				css={`
					margin-top: 20px;
					padding: 20px;
					line-height: 1.6em;
				`}
			>
				<h3>Première estimation</h3>
				<span
					css={`
						font-size: 1.3em;
					`}
				>
					<RuleLink
						dottedName="contrat salarié . rémunération . net"
						title="Revenu net"
					/>{' '}
					<Evaluation expression="contrat salarié . rémunération . net" />
				</span>
				<br />
				dont indemnité chômage partiel :{' '}
				<Evaluation expression="contrat salarié . chômage partiel . indemnité d'activité partielle" />
				<br />
				perte de revenu chômage partiel :{' '}
				<Evaluation expression="perte de revenu chômage partiel" />
			</div>
		</Provider>
	)
}

const SliderLegend = styled.div`
	display: flex;
	justify-content: space-between;
	font-size: 0.8em;
	line-height: 1.1em;

	span:last-child {
		text-align: right;
	}
`

function SimpleField({ dottedName, onChange }) {
	const rule = useEvaluation(dottedName)
	const { engine } = useContext(EngineContext)
	if (engine === null) {
		return null
	}

	const rules = engine.rules
	const situation = engine.situation

	return (
		<li>
			<div className="main">
				<div className="header">
					<label htmlFor={`step-${dottedName}`}>
						<span className="optionTitle">{rule.question || rule.titre}</span>
						<p>{rule.résumé}</p>
					</label>
				</div>
				<div className="targetInputOrValue">
					<RuleInput
						className="targetInput"
						isTarget
						dottedName={dottedName}
						rules={rules}
						value={situation[dottedName]}
						onChange={onChange}
						useSwitch
					/>
				</div>
			</div>
		</li>
	)
}
