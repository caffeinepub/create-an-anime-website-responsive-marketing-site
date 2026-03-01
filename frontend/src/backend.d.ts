import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
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
export type Time = bigint;
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
export interface NewEpisode {
    title: string;
    thumbnailUrl: string;
    description: string;
    seasonNumber: bigint;
    episodeNumber: bigint;
    videoUrl: string;
}
export interface Character {
    id: string;
    bio: string;
    traits: Array<string>;
    name: string;
    role: string;
    imageUrl: string;
    power: string;
    weapon: string;
}
export interface UserProfile {
    name: string;
    email?: string;
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
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCharacter(newCharacter: NewCharacter): Promise<string>;
    createContent(newContent: NewContent): Promise<string>;
    createEpisode(newEpisode: NewEpisode): Promise<string>;
    deleteCharacter(characterId: string): Promise<void>;
    deleteContactRequest(requestId: string): Promise<void>;
    deleteContent(contentId: string): Promise<void>;
    deleteEpisode(episodeId: string): Promise<void>;
    getAllCharacters(): Promise<Array<Character>>;
    getAllContents(): Promise<Array<Content>>;
    getAllEpisodes(): Promise<Array<Episode>>;
    getAllRequests(): Promise<Array<ContactRequest>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCharacter(characterId: string): Promise<Character | null>;
    getContent(contentId: string): Promise<Content | null>;
    getEpisode(episodeId: string): Promise<Episode | null>;
    getRequestsByStatus(processed: boolean): Promise<Array<ContactRequest>>;
    getRequestsByTopic(requestedTopic: Topics): Promise<Array<ContactRequest>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    grantAdminRole(userPrincipal: Principal): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitRequest(input: NewRequest): Promise<string>;
    updateCharacter(characterId: string, updatedCharacter: NewCharacter): Promise<void>;
    updateContent(contentId: string, updatedContent: NewContent): Promise<void>;
    updateEpisode(episodeId: string, updatedEpisode: NewEpisode): Promise<void>;
    updateRequestStatus(requestId: string, processed: boolean): Promise<void>;
}
