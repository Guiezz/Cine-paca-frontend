// ─── Pagination ───────────────────────────────────────────
export interface PaginationMeta {
  page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
  filters?: Record<string, unknown>;
}

// ─── Auth ─────────────────────────────────────────────────
export interface LoginDto {
  email: string;
  password: string;
}

export interface AdminProfile {
  id: string;
  email: string;
  name: string;
}

export interface AuthTokensResponse {
  admin: AdminProfile;
  access_token: string;
  expires_in: number;
  token_type: string;
}

export interface RefreshTokensResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export interface MeResponse {
  admin: AdminProfile;
}

export interface ChangePasswordDto {
  current_password: string;
  new_password: string;
}

// ─── Admin ────────────────────────────────────────────────
export type AdminStatus = "active" | "inactive";
export type AdminRole = "admin" | "superadmin";

export interface AdminEntity {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: AdminStatus;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateAdminDto {
  name: string;
  email: string;
  password: string;
}

export interface UpdateAdminDto {
  name?: string;
  status?: AdminStatus;
  password?: string;
}

// ─── Themes ───────────────────────────────────────────────
export interface ThemeEntity {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface CreateThemeDto {
  name: string;
  slug?: string;
}

export interface UpdateThemeDto {
  name?: string;
  slug?: string;
}

// ─── Institutions ─────────────────────────────────────────
export type InstitutionType = "school" | "university" | "cultural_center" | "other";

export interface InstitutionEntity {
  id: string;
  name: string;
  slug: string;
  type: InstitutionType;
  website_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateInstitutionDto {
  name: string;
  slug?: string;
  type: InstitutionType;
  website_url?: string;
}

export interface UpdateInstitutionDto {
  name?: string;
  slug?: string;
  type?: InstitutionType;
  website_url?: string;
}

// ─── BNCC Skills ──────────────────────────────────────────
export interface BnccSkillEntity {
  id: string;
  code: string;
  description: string;
  area: string;
  stage: string;
}

export interface CreateBnccDto {
  code: string;
  description: string;
  area: string;
  stage: string;
}

export interface UpdateBnccDto {
  code?: string;
  description?: string;
  area?: string;
  stage?: string;
}

// ─── Works ────────────────────────────────────────────────
export type WorkType = "short_film" | "feature_film" | "documentary" | "animation" | "series";
export type WorkStatus = "draft" | "published" | "archived";
export type WorkVisibility = "public" | "private";
export type Rating = "L" | "10" | "12" | "14" | "16" | "18";
export type PedagogicalUse = "debate" | "cultural_repertoire" | "image_reading" | "practical_project" | string;

export interface WorkThemeSummary {
  id: string;
  name: string;
  slug: string;
}

export interface WorkBnccSkillSummary {
  id: string;
  code: string;
  description: string;
  area: string;
  stage: string;
}

export interface WorkInstitutionSummary {
  id: string;
  name: string;
  slug: string;
  type: InstitutionType;
  website_url: string | null;
}

export interface WorkEntity {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  synopsis: string;
  type: WorkType;
  release_year: number | null;
  duration_minutes: number;
  rating: Rating;
  stage: string | null;
  age_range: string | null;
  status: WorkStatus;
  visibility: WorkVisibility;
  thumbnail_image_url: string | null;
  hero_image_url: string | null;
  external_video_url: string | null;
  external_video_provider: string | null;
  director: string | null;
  producer: string | null;
  country: string | null;
  language: string | null;
  pedagogical_use: string | null;
  trigger_question: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  themes?: WorkThemeSummary[];
  bncc_skills?: WorkBnccSkillSummary[];
  institutions?: WorkInstitutionSummary[];
}

export interface CreateWorkDto {
  title: string;
  slug?: string;
  short_description?: string;
  synopsis: string;
  type: WorkType;
  release_year?: number;
  duration_minutes: number;
  rating: Rating;
  stage?: string;
  age_range?: string;
  thumbnail_image_url?: string;
  hero_image_url?: string;
  external_video_url?: string;
  director?: string;
  producer?: string;
  country?: string;
  language?: string;
  pedagogical_use?: string;
  trigger_question?: string;
  theme_ids?: string[];
  bncc_skill_ids?: string[];
  institution_ids?: string[];
}

export interface UpdateWorkDto {
  title?: string;
  slug?: string;
  short_description?: string;
  synopsis?: string;
  type?: WorkType;
  release_year?: number;
  duration_minutes?: number;
  rating?: Rating;
  stage?: string;
  age_range?: string;
  thumbnail_image_url?: string;
  hero_image_url?: string;
  external_video_url?: string;
  director?: string;
  producer?: string;
  country?: string;
  language?: string;
  pedagogical_use?: string;
  trigger_question?: string;
  theme_ids?: string[];
  bncc_skill_ids?: string[];
  institution_ids?: string[];
}

// ─── Lists (Curadorias) ───────────────────────────────────
export type ListStatus = "draft" | "published" | "archived";
export type ListVisibility = "public" | "private";

export interface ListItemWorkSummary {
  id: string;
  title: string;
  slug: string;
  type: WorkType;
  rating: Rating;
  duration_minutes: number;
  thumbnail_image_url: string | null;
  status: WorkStatus;
  visibility: WorkVisibility;
}

export interface ListItemEntity {
  id: string;
  position: number;
  section_label: string | null;
  admin_comment: string | null;
  work: ListItemWorkSummary;
}

export interface ListThemeSummary {
  id: string;
  name: string;
  slug: string;
}

export interface ListBnccSummary {
  id: string;
  code: string;
  description: string;
  area: string;
  stage: string;
}

export interface ListEntity {
  id: string;
  title: string;
  slug: string;
  description: string;
  admin_note: string | null;
  stage: string | null;
  age_range: string | null;
  estimated_duration_minutes: number | null;
  status: ListStatus;
  visibility: ListVisibility;
  cover_image_url: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  items?: ListItemEntity[];
  themes?: ListThemeSummary[];
  bncc_skills?: ListBnccSummary[];
}

export interface CreateListDto {
  title: string;
  slug?: string;
  description: string;
  admin_note?: string;
  stage?: string;
  age_range?: string;
  cover_image_url?: string;
  theme_ids?: string[];
  bncc_skill_ids?: string[];
}

export interface UpdateListDto {
  title?: string;
  slug?: string;
  description?: string;
  admin_note?: string;
  stage?: string;
  age_range?: string;
  cover_image_url?: string;
  theme_ids?: string[];
  bncc_skill_ids?: string[];
}

export interface AddListItemDto {
  work_id: string;
  section_label?: string;
  admin_comment?: string;
}

export interface ReorderItemsDto {
  item_ids: string[];
}

// ─── Upload ───────────────────────────────────────────────
export interface UploadResult {
  url: string;
  filename: string;
  size: number;
  mime_type: string;
}

// ─── Audit ────────────────────────────────────────────────
export interface AuditActor {
  id: string;
  name: string;
  email: string;
}

export interface AuditLogEntity {
  id: string;
  actor_user_id: string;
  actor: AuditActor;
  action: string;
  entity_type: string;
  entity_id: string;
  metadata: Record<string, unknown> | null;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

// ─── Health ───────────────────────────────────────────────
export interface HealthEntity {
  status: string;
  database: string;
  timestamp: string;
}

// ─── Errors ───────────────────────────────────────────────
export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}

export interface PublicationErrorDetail {
  field: string;
  message: string;
}

export interface PublicationError {
  code: string;
  message: string;
  details: PublicationErrorDetail[];
}

export interface TaxonomyInUseDetails {
  works: number;
  lists?: number;
}
