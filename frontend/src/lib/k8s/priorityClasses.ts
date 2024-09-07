/** This module is deprecated as its name was pluralized.
 * Use the priorityClass module instead. */
// @todo Remove this module when appropriate.
import PriorityClass, { KubePriorityClass } from './priorityClass.ts';
export * from './priorityClass.ts';
export type KubePriorityClasses = KubePriorityClass;
export default PriorityClass;
