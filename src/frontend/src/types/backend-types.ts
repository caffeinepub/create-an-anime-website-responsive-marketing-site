import type { Principal } from "@icp-sdk/core/principal";

// ─── Enums ────────────────────────────────────────────────────────────────────

export enum Topics {
  businessPartnerships = "businessPartnerships",
  advertisingInquiries = "advertisingInquiries",
  interviewRequests = "interviewRequests",
  eventOrWorkshopProposals = "eventOrWorkshopProposals",
  publishingSubmissions = "publishingSubmissions",
  challengesAndBounties = "challengesAndBounties",
  generalInquiries = "generalInquiries",
}

export enum UserRole {
  admin = "admin",
  user = "user",
}

// ─── Domain Types ─────────────────────────────────────────────────────────────

export interface Character {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  weapon: string;
  power: string;
  traits: string[];
  sortOrder: bigint;
  displayOrder: bigint;
  createdAt: bigint;
}

export interface NewCharacter {
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  weapon: string;
  power: string;
  traits: string[];
}

export interface Episode {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  episodeNumber: bigint;
  seasonNumber: bigint;
  createdAt: bigint;
}

export interface NewEpisode {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  episodeNumber: bigint;
  seasonNumber: bigint;
}

export interface Content {
  id: string;
  contentType: string;
  title: string;
  body: string;
  imageUrl: string;
  createdAt: bigint;
}

export interface NewContent {
  contentType: string;
  title: string;
  body: string;
  imageUrl?: string;
}

export interface ContactRequest {
  id: string;
  email: string;
  message: string;
  topic: Topics;
  processed: boolean;
  createdAt: bigint;
  timestamp: bigint;
}

export interface NewRequest {
  email: string;
  message: string;
  topic: Topics;
}

export interface UserProfile {
  displayName: string;
  bio: string;
  avatarUrl: string;
}

export interface Worldbuilding {
  content: string;
}

export interface ReferralSource {
  id: string;
  source: string;
  otherText?: string;
  createdAt: bigint;
  timestamp: bigint;
}

export interface BackendActor {
  isCallerAdmin(): Promise<boolean>;
  assignCallerUserRole(principal: Principal, role: UserRole): Promise<void>;
  getCallerUserProfile(): Promise<UserProfile | null>;
  saveCallerUserProfile(profile: UserProfile): Promise<void>;
  submitContactRequest(input: NewRequest): Promise<ContactRequest>;
  getContactRequests(): Promise<ContactRequest[]>;
  markContactRequestProcessed(id: string): Promise<void>;
  getCharacters(): Promise<Character[]>;
  getCharacterById(id: string): Promise<[Character] | []>;
  getCharacterImage(id: string): Promise<string>;
  addCharacter(char: NewCharacter): Promise<Character>;
  updateCharacter(id: string, char: NewCharacter): Promise<Character>;
  deleteCharacter(id: string): Promise<void>;
  saveCharacterOrder(ids: string[]): Promise<void>;
  getEpisodes(): Promise<Episode[]>;
  addEpisode(ep: NewEpisode): Promise<Episode>;
  updateEpisode(id: string, ep: NewEpisode): Promise<Episode>;
  deleteEpisode(id: string): Promise<void>;
  getContentById(id: string): Promise<Content | null>;
  addContent(c: NewContent): Promise<Content>;
  updateContent(id: string, c: NewContent): Promise<Content>;
  deleteContent(id: string): Promise<void>;
  getWorldbuilding(): Promise<Worldbuilding | null>;
  setWorldbuilding(data: Worldbuilding): Promise<void>;
  submitReferral(r: { source: string; otherText?: string }): Promise<void>;
  getReferrals(): Promise<ReferralSource[]>;
  deleteReferral(id: string): Promise<void>;
}
