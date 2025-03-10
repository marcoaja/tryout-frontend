import { Tryout, TryoutCreateInput, TryoutUpdateInput } from "@/types/tryout";

const API_BASE = "http://localhost:8000/api/v1";

/**
 * Fetch all tryouts with optional filters
 */
export async function fetchTryouts(filters?: {
  title?: string;
  startDate?: string;
  endDate?: string;
  isPublic?: boolean;
}): Promise<Tryout[]> {
  try {
    // Build query string from filters
    let queryParams = new URLSearchParams();

    if (filters?.title) {
      queryParams.append("title", filters.title);
    }

    if (filters?.startDate) {
      queryParams.append("startDate", filters.startDate);
    }

    if (filters?.endDate) {
      queryParams.append("endDate", filters.endDate);
    }

    if (filters?.isPublic !== undefined) {
      queryParams.append("isPublic", filters.isPublic.toString());
    }

    const queryString = queryParams.toString()
      ? `?${queryParams.toString()}`
      : "";

    const response = await fetch(`${API_BASE}/tryouts${queryString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch tryouts");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching tryouts:", error);
    throw error;
  }
}

/**
 * Fetch a single tryout by ID
 */
export async function fetchTryout(id: string): Promise<Tryout> {
  try {
    const response = await fetch(`${API_BASE}/tryouts/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch tryout");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching tryout ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new tryout
 */
export async function createTryout(tryout: TryoutCreateInput): Promise<Tryout> {
  try {
    const response = await fetch(`${API_BASE}/tryouts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tryout),
    });

    if (!response.ok) {
      throw new Error("Failed to create tryout");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating tryout:", error);
    throw error;
  }
}

/**
 * Update an existing tryout
 */
export async function updateTryout(
  id: string,
  updates: TryoutUpdateInput
): Promise<Tryout> {
  try {
    const response = await fetch(`${API_BASE}/tryouts/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error("Failed to update tryout");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error updating tryout ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a tryout
 */
export async function deleteTryout(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/tryouts/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete tryout");
    }
  } catch (error) {
    console.error(`Error deleting tryout ${id}:`, error);
    throw error;
  }
}
