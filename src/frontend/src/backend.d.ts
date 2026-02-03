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
export type Time = bigint;
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
    getAllRequests(): Promise<Array<ContactRequest>>;
    getCallerUserRole(): Promise<UserRole>;
    getRequestsByStatus(processed: boolean): Promise<Array<ContactRequest>>;
    getRequestsByTopic(requestedTopic: Topics): Promise<Array<ContactRequest>>;
    isCallerAdmin(): Promise<boolean>;
    submitRequest(input: NewRequest): Promise<string>;
    updateRequestStatus(requestId: string, processed: boolean): Promise<void>;
}
