import Callable from '@/expressions/functions/Callable'

export default class DummyInfinite extends Callable {
	arity() {
		return Infinity
	}

	call(args) {
		return args[0]
	}
}
