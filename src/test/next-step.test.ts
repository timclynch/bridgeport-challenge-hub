import { describe, expect, it } from "vitest";
import { fit, JOURNEYS } from "@/data/journeys";
import type { Resource } from "@/data/resources";
import { addStep, removeStep, restoreStep, type Step } from "@/lib/steps";

const pantry: Resource = {
  id: "p", name: "Pantry A", categories: ["food"], helps: "", access: "", contact: {},
  confidence: "published", source: "", unresolved: [], tags: { days: ["Tue"], kind: ["groceries"] },
};
const q = JOURNEYS.food.questions;

describe("fit rules", () => {
  it("Tue-only pantry doesn't fit a Thu-only student", () => {
    expect(fit(pantry, { days: "Thu" }, q).status).toBe("no-fit");
  });
  it("Tue-only pantry fits a Tue student", () => {
    expect(fit(pantry, { days: "Tue" }, q).status).toBe("fits");
  });
  it("unknown details need confirmation", () => {
    expect(fit({ ...pantry, tags: {} }, { days: "Tue" }, q).status).toBe("confirm");
  });
  it("no preferences means fit can't be compared", () => {
    expect(fit(pantry, {}, q).status).toBe("no-prefs");
  });
});

const s = (id: string): Step => ({ id, journey: "food", resourceId: "p", title: id, goal: "", questions: [], status: "deciding", note: "", sensitive: false });

describe("saved steps", () => {
  it("remove then undo restores the card in its place", () => {
    const list = addStep(addStep(addStep([], s("a")), s("b")), s("c"));
    const { list: after, removed } = removeStep(list, "b");
    expect(after.map((x) => x.id)).toEqual(["a", "c"]);
    expect(restoreStep(after, removed!).map((x) => x.id)).toEqual(["a", "b", "c"]);
  });
});
