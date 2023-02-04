/**
 * return True if T is `any`, otherwise return False
 * taken from https://github.com/joonhocho/tsdef
 *
 * @internal
 */
export type IsAny<T, True, False = never> =
	// test if we are going the left AND right path in the condition
	true | false extends (T extends never ? true : false) ? True : False;

/**
 * return True if T is `unknown`, otherwise return False
 * taken from https://github.com/joonhocho/tsdef
 *
 * @internal
 */
export type IsUnknown<T, True, False = never> = unknown extends T ? IsAny<T, False, True> : False;

/**
 * @internal
 */
export type IfVoid<P, True, False> = [void] extends [P] ? True : False;
