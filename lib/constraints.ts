export type ConstraintType =
  | "string"
  | "number"
  | "integer"
  | "boolean"
  | "date-time"
  | "array"
  | "object"
  | "null"
  | "any";

export interface BaseConstraint {
  type?: ConstraintType;
  required?: boolean;
  enum?: any[];
  const?: any;
  description?: string;
}

export interface StringConstraint extends BaseConstraint {
  type: "string";
  minLength?: number;
  maxLength?: number;
  pattern?: string; // regex
  format?: string; // e.g., "email", "date-time"
}

export interface NumberConstraint extends BaseConstraint {
  type: "number" | "integer";
  greaterThan?: number;
  greaterThanOrEqual?: number;
  lessThan?: number;
  lessThanOrEqual?: number;
  multipleOf?: number;
}

export interface BooleanConstraint extends BaseConstraint {
  type: "boolean";
}

export interface ArrayConstraint extends BaseConstraint {
  type: "array";
  items?: Constraint; // recursive
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;
}

export interface DateConstraint extends BaseConstraint {
  type: "date-time";
  greaterThan?: string; // ISO 8601 date-time string
  greaterThanOrEqual?: string; // ISO 8601 date-time string
  lessThan?: string; // ISO 8601 date-time string
  lessThanOrEqual?: string; // ISO 8601 date-time string
}

export interface ObjectConstraint extends BaseConstraint {
  type: "object";
  properties?: { [key: string]: Constraint };
  requiredProperties?: string[];
  additionalProperties?: boolean | Constraint;
  minProperties?: number;
  maxProperties?: number;
}

export type Constraint =
  | StringConstraint
  | NumberConstraint
  | BooleanConstraint
  | ArrayConstraint
  | ObjectConstraint
  | DateConstraint
  | BaseConstraint; // fallback for "any", "null", etc.
