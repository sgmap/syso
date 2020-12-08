import { ConstantNode, Leaf } from './mecanisms/common'
import Allègement from './mecanisms/Allègement'
import ApplicableSi from './mecanisms/Applicable'
import Arrondi from './mecanisms/Arrondi'
import Barème from './mecanisms/Barème'
import Durée from './mecanisms/Durée'
import Grille from './mecanisms/Grille'
import InversionNumérique from './mecanisms/InversionNumérique'
import Maximum from './mecanisms/Maximum'
import Minimum from './mecanisms/Minimum'
import NonApplicable from './mecanisms/NonApplicable'
import Operation from './mecanisms/Operation'
import ParDéfaut from './mecanisms/ParDéfaut'
import Plafond from './mecanisms/Plafond'
import Plancher from './mecanisms/Plancher'
import Product from './mecanisms/Product'
import Recalcul from './mecanisms/Recalcul'
import ReplacementRule from './mecanisms/ReplacementRule'
import Rule from './mecanisms/Rule'
import Situation from './mecanisms/Situation'
import Somme from './mecanisms/Somme'
import Synchronisation from './mecanisms/Synchronisation'
import TauxProgressif from '../components/mecanisms/TauxProgressif'
import ToutesCesConditions from './mecanisms/ToutesCesConditions'
import UneDeCesConditions from './mecanisms/UneDeCesConditions'
import UnePossibilité from './mecanisms/UnePossibilité'
import Unité from './mecanisms/Unité'
import Variations from './mecanisms/Variations'

const UIComponents = {
	constant: ConstantNode,
	allègement: Allègement,
	'applicable si': ApplicableSi,
	arrondi: Arrondi,
	barème: Barème,
	durée: Durée,
	grille: Grille,
	inversion: InversionNumérique,
	maximum: Maximum,
	minimum: Minimum,
	'non applicable si': NonApplicable,
	operation: Operation,
	'par défaut': ParDéfaut,
	plafond: Plafond,
	plancher: Plancher,
	produit: Product,
	reference: Leaf,
	rule: Rule,
	'nom dans la situation': Situation,
	somme: Somme,
	synchronisation: Synchronisation,
	recalcul: Recalcul,
	replacementRule: ReplacementRule,
	'taux progressif': TauxProgressif,
	'toutes ces conditions': ToutesCesConditions,
	'une de ces conditions': UneDeCesConditions,
	'une possibilité': UnePossibilité,
	unité: Unité,
	'variable temporelle': () => '[variable temporelle]',
	variations: Variations,
} as const

export default function Explanation({ node }) {
	// Temporary switch, during the migration
	const Component = node.jsx ?? UIComponents[node.nodeKind]
	if (!Component) {
		throw new Error(`unknown mecanism ${node.nodeKind}`)
	}
	return <Component {...node} />
}
