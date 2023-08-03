import Callable from '@/expressions/functions/Callable'

export default class Dummy extends Callable {
	arity() {
		return 1
	}

	call(args) {
		return args[0]
	}
}
