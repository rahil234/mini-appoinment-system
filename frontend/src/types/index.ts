export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// User & Auth Types
export type UserRole = "ADMIN" | "USER";

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface UpdateUserDto {
    isDeleted?: boolean;
    role?: UserRole;
}

export interface AuthResponse {
    accessToken: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
}

// Appointment Types
export type AppointmentStatus =
    | "PENDING"
    | "CONFIRMED"
    | "CANCELLED"
    | "COMPLETED";

export interface Appointment {
    id: string;
    title: string;
    date: string;
    status: AppointmentStatus;
    userId: string;
    user?: User;
    createdAt: string;
    updatedAt: string;
}

export interface CreateAppointmentDto {
    title: string;
    date: string;
    userId: string;
}

export interface UpdateAppointmentDto {
    status?: AppointmentStatus;
    title?: string;
    date?: string;
}

export interface AppointmentFilters {
    page?: number;
    limit?: number;
    status?: AppointmentStatus;
    userId?: string;
    date?: string;
    search?: string;
}

// Case Types
export interface Case {
    id: string;
    title: string;
    description: string;
    assignedUserId?: string;
    assignedUser?: User;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCaseDto {
    title: string;
    description: string;
}

export interface AssignCaseDto {
    userId: string;
}

// API Response Types
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ApiError {
    success: false;
    message: string;
}

export interface AppointmentStats {
    total: number;
    pending: number;
    confirmed: number;
    cancelled: number;
}

export interface CaseStats {
    total: number;
    unassigned: number;
}

export interface RecentAppointment {
    id: string;
    title: string;
    date: string;
    status: AppointmentStatus;
}

export interface DashboardAnalytics {
    appointments: AppointmentStats;
    recentAppointments: RecentAppointment[];

    /**
     * Present only if user is ADMIN
     */
    cases?: CaseStats;
}
