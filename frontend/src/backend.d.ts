import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface Rank {
    title: string;
    privileges: Array<string>;
    responsibilities: Array<string>;
    rankingRequirements: Array<string>;
    order: bigint;
    description: string;
    symbol: string;
}
export interface Content {
    id: string;
    title: string;
    contentType: string;
    body: string;
    imageUrl?: string;
}
export interface NewCharacter {
    bio: string;
    traits: Array<string>;
    name: string;
    role: string;
    imageUrl: string;
    power: string;
    weapon: string;
}
export interface ShiranagiFamily {
    symbols: Array<string>;
    bloodlinePowers: Array<string>;
    coreEthos: string;
    history: string;
    affiliations: Array<string>;
    notableMembers: Array<string>;
    familyValues: Array<string>;
    evolutionOverTime: string;
}
export interface PowerSystemElement {
    categories: Array<string>;
    name: string;
    description: string;
    masteryLevels: Array<string>;
    symbol: string;
}
export interface Character {
    id: string;
    bio: string;
    displayOrder: bigint;
    traits: Array<string>;
    name: string;
    role: string;
    imageUrl: string;
    power: string;
    weapon: string;
}
export interface Episode {
    id: string;
    title: string;
    thumbnailUrl: string;
    description: string;
    seasonNumber: bigint;
    episodeNumber: bigint;
    videoUrl: string;
}
export interface NewRequest {
    topic: Topics;
    email: string;
    message: string;
}
export interface ContactRequest {
    id: string;
    topic: Topics;
    email: string;
    message: string;
    timestamp: Time;
    processed: boolean;
}
export interface NewContent {
    title: string;
    contentType: string;
    body: string;
    imageUrl?: string;
}
export interface ClanEyeRule {
    description: string;
    symbol: string;
}
export interface Clan {
    name: string;
    description: string;
    uniqueAbilities: Array<string>;
    notableMembers: Array<string>;
    symbol: string;
}
export interface Worldbuilding {
    powerSystem: Array<PowerSystemElement>;
    clanEyeRules: Array<ClanEyeRule>;
    clans: Array<Clan>;
    shiranagiFamily: ShiranagiFamily;
    rankSystem: Array<Rank>;
}
export interface NewEpisode {
    title: string;
    thumbnailUrl: string;
    description: string;
    seasonNumber: bigint;
    episodeNumber: bigint;
    videoUrl: string;
}
export interface UserProfile {
    name: string;
    email?: string;
}
export enum Topics {
    businessPartnerships = "businessPartnerships",
    interviewRequests = "interviewRequests",
    publishingSubmissions = "publishingSubmissions",
    eventOrWorkshopProposals = "eventOrWorkshopProposals",
    advertisingInquiries = "advertisingInquiries",
    challengesAndBounties = "challengesAndBounties",
    generalInquiries = "generalInquiries"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCharacter(newChar: NewCharacter): Promise<Character>;
    addContent(newContent: NewContent): Promise<Content>;
    addEpisode(newEp: NewEpisode): Promise<Episode>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteCharacter(id: string): Promise<void>;
    deleteContent(id: string): Promise<void>;
    deleteEpisode(id: string): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCharacters(): Promise<Array<Character>>;
    getContactRequests(): Promise<Array<ContactRequest>>;
    getContentById(id: string): Promise<Content | null>;
    getEpisodes(): Promise<Array<Episode>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWorldbuilding(): Promise<Worldbuilding | null>;
    isCallerAdmin(): Promise<boolean>;
    markContactRequestProcessed(id: string): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveCharacterOrder(orderedIds: Array<string>): Promise<void>;
    setWorldbuilding(worldbuildingData: Worldbuilding): Promise<void>;
    submitContactRequest(request: NewRequest): Promise<ContactRequest>;
    updateCharacter(id: string, updatedChar: NewCharacter): Promise<Character | null>;
    updateContent(id: string, updatedContent: NewContent): Promise<Content | null>;
    updateEpisode(id: string, updatedEp: NewEpisode): Promise<Episode | null>;
}
