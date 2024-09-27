import { AbilityForm } from "./AbilityForm.js";

const abilityForm = AbilityForm.GetInstance();
abilityForm.Element.dispatchEvent(new Event("load"));