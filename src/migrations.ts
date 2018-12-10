import { OmitId } from './lib'
import { BlueprintMapping } from './studio'
import {
	IBlueprintShowStyleVariant,
	ISourceLayer,
	IOutputLayer
} from './showStyle'
import { ConfigItemValue } from './common'
import { DeviceOptions } from 'timeline-state-resolver-types'

export interface MigrationStepInput {
	stepId?: string // automatically filled in later
	label: string
	description?: string
	inputType: 'text' | 'multiline' | 'int' | 'checkbox' | 'dropdown' | 'switch' | null // EditAttribute types, null = dont display edit field
	attribute: string | null
	defaultValue?: any
}
export interface MigrationStepInputResult {
	stepId: string
	attribute: string
	value: any
}
export interface MigrationStepInputFilteredResult {
	[attribute: string]: any
}

export type ValidateFunctionCore 			= (afterMigration: boolean) => boolean | string
export type ValidateFunctionStudio 			= (context: MigrationContextStudio, afterMigration: boolean) => boolean | string
export type ValidateFunctionShowStyle 		= (context: MigrationContextShowStyle, afterMigration: boolean) => boolean | string
export type ValidateFunction = ValidateFunctionStudio | ValidateFunctionShowStyle | ValidateFunctionCore

export type MigrateFunctionCore 			= (input: MigrationStepInputFilteredResult) => void
export type MigrateFunctionStudio 			= (context: MigrationContextStudio, input: MigrationStepInputFilteredResult) => void
export type MigrateFunctionShowStyle 		= (context: MigrationContextShowStyle, input: MigrationStepInputFilteredResult) => void
export type MigrateFunction = MigrateFunctionStudio | MigrateFunctionShowStyle | MigrateFunctionCore

export type InputFunctionCore 				= () => Array<MigrationStepInput>
export type InputFunctionStudio 			= (context: MigrationContextStudio) => Array<MigrationStepInput>
export type InputFunctionShowStyle 			= (context: MigrationContextShowStyle) => Array<MigrationStepInput>
export type InputFunction = InputFunctionStudio | InputFunctionShowStyle | InputFunctionCore

export interface MigrationContextStudio {
	getMapping: (mappingId: string) => BlueprintMapping | undefined
	insertMapping: (mappingId: string, mapping: OmitId<BlueprintMapping>) => string
	updateMapping: (mappingId: string, mapping: Partial<BlueprintMapping>) => void
	removeMapping: (mappingId: string) => void

	getConfig: (configId: string) => ConfigItemValue | undefined
	setConfig: (configId: string, value: ConfigItemValue) => void
	removeConfig: (configId: string) => void

	getDevice: (deviceId: string) => DeviceOptions | undefined
	insertDevice: (deviceId: string, device: DeviceOptions) => string | null
	updateDevice: (deviceId: string, device: Partial<DeviceOptions>) => void
	removeDevice: (deviceId: string) => void
}

export interface ShowStyleVariantPart { // TODO - is this needed or can it share base props with the main exposed interface?
	name: string
}
export interface MigrationContextShowStyle {
	getAllVariants: () => IBlueprintShowStyleVariant[]
	getVariantId: (variantId: string) => string
	getVariant: (variantId: string) => IBlueprintShowStyleVariant | undefined
	insertVariant: (variantId: string, variant: OmitId<ShowStyleVariantPart>) => string
	updateVariant: (variantId: string, variant: Partial<ShowStyleVariantPart>) => void
	removeVariant: (variantId: string) => void

	getSourceLayer: (sourceLayerId: string) => ISourceLayer | undefined
	insertSourceLayer: (layer: ISourceLayer) => string
	updateSourceLayer: (sourceLayerId: string, layer: Partial<ISourceLayer>) => void
	removeSourceLayer: (sourceLayerId: string) => void

	getOutputLayer: (outputLayerId: string) => IOutputLayer | undefined
	insertOutputLayer: (layer: IOutputLayer) => string
	updateOutputLayer: (outputLayerId: string, layer: Partial<IOutputLayer>) => void
	removeOutputLayer: (outputLayerId: string) => void

	getBaseConfig: (configId: string) => ConfigItemValue | undefined
	setBaseConfig: (configId: string, value: ConfigItemValue) => void
	removeBaseConfig: (configId: string) => void

	getVariantConfig: (variantId: string, configId: string) => ConfigItemValue | undefined
	setVariantConfig: (variantId: string, configId: string, value: ConfigItemValue) => void
	removeVariantConfig: (variantId: string, configId: string) => void
}

export interface MigrationStepBase {
	/** Unique id for this step */
	id: string
	/** If this step overrides another step. Note: It's only possible to override steps in previous versions */
	overrideSteps?: Array<string>

	/** The validate function determines whether the step is to be applied
	 * (it can for example check that some value in the database is present)
	 * The function should return falsy if step is fullfilled (ie truthy if migrate function should be applied, return value could then be a string describing why)
	 * The function is also run after the migration-script has been applied (and should therefore return false if all is good)
	 */
	validate: ValidateFunction

	/** If true, this step can be run automatically, without prompting for user input */
	canBeRunAutomatically: boolean
	/** The migration script. This is the script that performs the updates.
	 * Input to the function is the result from the user prompt (for manual steps)
	 * The miggration script is optional, and may be omitted if the user is expected to perform the update manually
	 * @param result Input from the user query
	 */
	migrate?: MigrateFunction
	/** Query user for input, used in manual steps */
	input?: Array<MigrationStepInput> | InputFunction

	/** If this step depend on the result of another step. Will pause the migration before this step in that case. */
	dependOnResultFrom?: string
}
export interface MigrationStep extends MigrationStepBase {
	/** The version this Step applies to */
	version: string
}

export interface MigrationStepCore extends MigrationStep {
	validate: ValidateFunctionCore
	migrate?: MigrateFunctionCore
	input?: Array<MigrationStepInput> | InputFunctionCore
}
export interface MigrationStepStudio extends MigrationStep {
	validate: ValidateFunctionStudio
	migrate?: MigrateFunctionStudio
	input?: Array<MigrationStepInput> | InputFunctionStudio
}
export interface MigrationStepShowStyle extends MigrationStep {
	validate: ValidateFunctionShowStyle
	migrate?: MigrateFunctionShowStyle
	input?: Array<MigrationStepInput> | InputFunctionShowStyle
}
