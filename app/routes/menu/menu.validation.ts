import { Type as t, type Static } from "@sinclair/typebox";
import { uuidObj } from "~/utils/types/uuid";
import { Nullable } from "~/utils/types/nullable";

export const menuObj = t.Object({
	id: uuidObj,
	created_at: t.Date(),
	created_by: uuidObj,
	name: t.String(),
});
export type Menu = Static<typeof menuObj>;

export const itemOnMenuObj = t.Object({
	item_id: t.Integer(),
	menu_id: uuidObj,
});
export type ItemOnMenu = Static<typeof itemOnMenuObj>;

export const itemObj = t.Object({
	id: t.Integer(),
	name: t.String(),
	description: t.Optional(Nullable(t.String())),
	img_url: t.Optional(Nullable(t.String({ format: "uri" }))),
	base_price: t.Integer(),
});
export type Item = Static<typeof itemObj>;

export const sessionDetailsObj = t.Object({
	menu_name: t.String(),
	expires_at: t.Date(),
	items: t.Array(itemObj),
});
export type SessionDetails = Static<typeof sessionDetailsObj>;
