declare module 'stencil'

export function compile(input: any, providedContext: any, meta: any): any
export function extractData(input: string): any

export declare class CompilationError {
	output: string
}
