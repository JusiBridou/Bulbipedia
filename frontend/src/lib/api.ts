import axios from "axios";
import { getAPIBaseURL } from "./config";

const TOKEN_KEY = "bulbipedia_token";

export type User = {
	id: string;
	email: string;
	username: string;
	avatarUrl?: string | null;
	role: "USER" | "ADMIN";
	createdAt?: string;
};

export type Article = {
	id: string;
	slug: string;
	title: string;
	summary: string | null;
	content: string;
	heroImageUrl?: string | null;
	published: boolean;
	publishedAt: string | null;
	createdAt: string;
	updatedAt: string;
	author?: {
		id: string;
		username: string;
		avatarUrl?: string | null;
	};
	ratingCount?: number;
	ratingAverage?: number;
};

export type PublicProfile = {
	id: string;
	username: string;
	avatarUrl?: string | null;
	createdAt: string;
	articleCount: number;
	ratingCount: number;
	ratingAverage: number;
};

export type PublicProfileArticle = {
	id: string;
	slug: string;
	title: string;
	summary: string | null;
	publishedAt: string | null;
	updatedAt: string;
	ratingCount: number;
	ratingAverage: number;
};

export type AuthResponse = {
	token: string;
	user: User;
};

export type AdminUser = {
	id: string;
	email: string;
	username: string;
	avatarUrl?: string | null;
	role: "USER" | "ADMIN";
	createdAt: string;
	_count: {
		articles: number;
		ratings: number;
	};
};

export type AdminArticle = {
	id: string;
	slug: string;
	title: string;
	published: boolean;
	createdAt: string;
	updatedAt: string;
	author: {
		id: string;
		username: string;
	};
};

const http = axios.create({
	timeout: 10000
});

http.interceptors.request.use((config) => {
 config.baseURL = getAPIBaseURL();

	const token = localStorage.getItem(TOKEN_KEY);
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

function setToken(token: string) {
	localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
	localStorage.removeItem(TOKEN_KEY);
}

function getToken() {
	return localStorage.getItem(TOKEN_KEY);
}

function appendIfDefined(formData: FormData, key: string, value: string | boolean | Blob | null | undefined) {
	if (value === undefined || value === null || value === "") {
		return;
	}

	formData.append(key, value instanceof Blob ? value : String(value));
}

function appendOptionalFile(formData: FormData, key: string, file: File | null | undefined) {
	if (!file) {
		return;
	}

	formData.append(key, file);
}

function toMediaURL(path?: string | null) {
	if (!path) {
		return "";
	}

	if (/^(https?:)?\/\//i.test(path) || path.startsWith("data:") || path.startsWith("blob:")) {
		return path;
	}

	const baseURL = getAPIBaseURL();
	if (!baseURL) {
		return path;
	}

	return `${baseURL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

export const api = {
	auth: {
		async register(payload: { email: string; username: string; password: string; avatarFile?: File | null; avatarUrl?: string }) {
			const formData = new FormData();
			appendIfDefined(formData, "email", payload.email);
			appendIfDefined(formData, "username", payload.username);
			appendIfDefined(formData, "password", payload.password);
			appendOptionalFile(formData, "avatarImage", payload.avatarFile);
			appendIfDefined(formData, "avatarUrl", payload.avatarUrl);

			const { data } = await http.post<AuthResponse>("/api/auth/register", formData);
			setToken(data.token);
			return data;
		},
		async login(payload: { email: string; password: string }) {
			const { data } = await http.post<AuthResponse>("/api/auth/login", payload);
			setToken(data.token);
			return data;
		},
		async me() {
			const { data } = await http.get<{ user: User }>("/api/auth/me");
			return data.user;
		},
		logout() {
			clearToken();
		},
		getToken
	},
	articles: {
		async search(params?: { q?: string; author?: string }) {
			const { data } = await http.get<{ articles: Article[] }>("/api/articles", { params });
			return data.articles;
		},
		async mine() {
			const { data } = await http.get<{ articles: Article[] }>("/api/articles/mine");
			return data.articles;
		},
		async bySlug(slug: string) {
			const { data } = await http.get<{ article: Article }>(`/api/articles/${slug}`);
			return data.article;
		},
		async create(payload: { title: string; summary?: string; content: string; heroImageFile?: File | null; heroImageUrl?: string; published?: boolean }) {
			const formData = new FormData();
			appendIfDefined(formData, "title", payload.title);
			appendIfDefined(formData, "summary", payload.summary);
			appendIfDefined(formData, "content", payload.content);
			appendOptionalFile(formData, "heroImage", payload.heroImageFile);
			appendIfDefined(formData, "heroImageUrl", payload.heroImageUrl);
			appendIfDefined(formData, "published", payload.published ?? undefined);

			const { data } = await http.post<{ article: Article }>("/api/articles", formData);
			return data.article;
		},
		async update(
			slug: string,
			payload: Partial<Pick<Article, "title" | "summary" | "content" | "heroImageUrl" | "published">> & {
				heroImageFile?: File | null;
			}
		) {
			const formData = new FormData();
			appendIfDefined(formData, "title", payload.title);
			appendIfDefined(formData, "summary", payload.summary);
			appendIfDefined(formData, "content", payload.content);
			appendOptionalFile(formData, "heroImage", payload.heroImageFile);
			appendIfDefined(formData, "heroImageUrl", payload.heroImageUrl);
			appendIfDefined(formData, "published", payload.published ?? undefined);

			const { data } = await http.patch<{ article: Article }>(`/api/articles/${slug}`, formData);
			return data.article;
		},
		async rate(slug: string, value: number) {
			const { data } = await http.post<{ average: number; count: number; yourRating: number }>(
				`/api/articles/${slug}/rating`,
				{ value }
			);
			return data;
		},
		async ratings(slug: string) {
			const { data } = await http.get<{ average: number; count: number }>(`/api/articles/${slug}/ratings`);
			return data;
		}
	},
	admin: {
		async users() {
			const { data } = await http.get<{ users: AdminUser[] }>("/api/admin/users");
			return data.users;
		},
		async deleteUser(userId: string) {
			await http.delete(`/api/admin/users/${userId}`);
		},
		async articles() {
			const { data } = await http.get<{ articles: AdminArticle[] }>("/api/admin/articles");
			return data.articles;
		},
		async deleteArticle(articleId: string) {
			await http.delete(`/api/admin/articles/${articleId}`);
		}
	},
	media: {
		async uploadImage(image: File) {
			const formData = new FormData();
			formData.append("image", image);

			const { data } = await http.post<{ url: string }>("/api/uploads/image", formData);
			return data.url;
		}
	},
	users: {
		async profile(username: string) {
			const { data } = await http.get<{ profile: PublicProfile; articles: PublicProfileArticle[] }>(
				`/api/users/${encodeURIComponent(username)}`
			);
			return data;
		},
		async updateMe(payload: { username?: string; avatarFile?: File | null; avatarUrl?: string | null }) {
			const formData = new FormData();
			appendIfDefined(formData, "username", payload.username);
			appendOptionalFile(formData, "avatarImage", payload.avatarFile);
			appendIfDefined(formData, "avatarUrl", payload.avatarUrl);

			const { data } = await http.patch<{ user: User }>("/api/users/me", formData);
			return data.user;
		}
	}
};

export { toMediaURL as resolveMediaURL };

export function getApiErrorMessage(error: unknown): string {
	if (axios.isAxiosError(error)) {
		return (error.response?.data as { error?: string } | undefined)?.error || error.message;
	}
	return "Une erreur inattendue est survenue.";
}
