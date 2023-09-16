declare module 'stencil'

export function compile(
	input: any,
	providedContext: any,
	providedOptions: any,
): any
export function extractData(input: string, options: any): any

export declare class CompilationError {
	output: string
}
