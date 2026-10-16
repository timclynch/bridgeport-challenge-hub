import { describe, expect, it } from "vitest";
import { fit, JOURNEYS, rankOptions } from "@/data/journeys";
import { DEMO, REAL, factLabel, getFact, getResource } from "@/data/resources";
import { addStep, removeStep, restoreStep, type Step } from "@/lib/steps";

const food = JOURNEYS.food;
const demoPantry = DEMO.find((r) => r.id === "demo-pantry")!;

describe("fit rules", () => {
  it("Tue-only demo pantry doesn't fit a Thu-only student", () => {
    expect(fit(demoPantry, { days: "Thu" }, food.questions).status).toBe("no-fit");
  });
  it("Tue-only demo pantry fits a Tue student", () => {
    expect(fit(demoPantry, { days: "Tue" }, food.questions).status).toBe("fits");
  });
  it("a resource with no published window needs confirmation for a day preference", () => {
    const pantry = getResource("pantry")!;
    expect(fit(pantry, { days: "Tue" }, food.questions).status).toBe("confirm");
  });
  it("no preferences means fit can't be compared", () => {
    expect(fit(demoPantry, {}, food.questions).status).toBe("no-prefs");
  });
});

describe("fact labels", () => {
  it("an unknown fact never reads as 'no requirement'", () => {
    const l = factLabel(getFact(getResource("community-211")!, "documents"));
    expect(l.text).toBe("Unknown — ask");
  });
  it("a conflicting fact has no single value", () => {
    const f = getFact(getResource("counseling")!, "location");
    expect(f.status).toBe("conflicting");
    expect(f.value).toBeNull();
    expect(factLabel(f).tone).toBe("conflict");
  });
});

describe("demo switch", () => {
  it("catalog has 68 real resources", () => {
    expect(REAL).toHaveLength(68);
  });
  it("demo records only appear when the switch is on", () => {
    expect(rankOptions(food, {}, false).some((x) => x.resource.sample)).toBe(false);
    expect(rankOptions(food, {}, true).some((x) => x.resource.id === "demo-pantry")).toBe(true);
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
