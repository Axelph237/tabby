import { type Static, Type as t } from "@sinclair/typebox";

export const uuidObj = t.String({ format: "uuid" });
export type UUID = Static<typeof uuidObj>;
