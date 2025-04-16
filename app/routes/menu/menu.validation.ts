import { Type as t, type Static } from "@sinclair/typebox";
import { uuidObj } from "~/utils/types/uuid";
import { Nullable } from "~/utils/types/nullable";

// DEPRECATED
export const menuTObj = t.Object({
	id: uuidObj,
	created_at: t.Date(),
	created_by: uuidObj,
	name: t.String(),
});
export type Menu = Static<typeof menuTObj>;

// DEPRECATED
export const itemOnMenuTObj = t.Object({
	item_id: t.Integer(),
	menu_id: uuidObj,
});
export type ItemOnMenu = Static<typeof itemOnMenuTObj>;

export const itemOptionTObj = t.Object({
	label: t.String(),
	type: t.Union([t.Literal("one"), t.Literal("many"), t.Literal("text")]),
});
export type ItemOption = Static<typeof itemOptionTObj>;

export const itemSelectTObj = t.Object({
	label: t.String(),
	price: t.Integer(),
	is_default: t.Boolean(),
});
export type ItemSelection = Static<typeof itemSelectTObj>;

export const itemTObj = t.Object({
	id: t.Integer(),
	name: t.String(),
	description: t.Optional(Nullable(t.String())),
	img_url: t.Optional(Nullable(t.String({ format: "uri" }))),
	base_price: t.Integer(),
});
export type Item = Static<typeof itemTObj>;

export const sessionDetailsTObj = t.Object({
	menu_name: t.String(),
	expires_at: t.Date(),
	items: t.Array(
		t.Intersect([
			// Item
			itemTObj,
			t.Object({
				// Options
				options: t.Array(
					t.Intersect([
						itemOptionTObj,
						t.Object({
							// Selections
							selections: t.Array(itemSelectTObj),
						}),
					]),
				),
			}),
		]),
	),
});
export type SessionDetails = Static<typeof sessionDetailsTObj>;
