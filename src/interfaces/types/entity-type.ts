/**
 * entity-type.ts
 *
 * Defines and exports the EntityType union type, which combines all
 * entity interfaces used in the application.
 */

import { Member } from "@/interfaces/models/entities/member";
import { Posting } from "@/interfaces/models/entities/posting";

export type EntityType =
  | Member
  | Posting;
