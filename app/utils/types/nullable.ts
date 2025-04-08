import { type TSchema, Type as t } from "@sinclair/typebox";

export const Nullable = <T extends TSchema>(T: T) => {
	return t.Union([T, t.Null()]);
};
