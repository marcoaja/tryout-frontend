import {
  Question,
  QuestionCreateInput,
  QuestionUpdateInput,
} from "@/types/question";

const API_BASE = "http://localhost:8000/api/v1";

/**
 * Fetch all questions for a tryout
 */
export async function fetchQuestions(tryoutId: string): Promise<Question[]> {
  try {
    const response = await fetch(`${API_BASE}/tryouts/${tryoutId}/questions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch questions");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
}

/**
 * Fetch a single question by ID
 */
export async function fetchQuestion(id: string): Promise<Question> {
  try {
    const response = await fetch(`${API_BASE}/questions/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch question");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching question ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new question for a tryout
 */
export async function createQuestion(
  tryoutId: string,
  question: QuestionCreateInput
): Promise<Question> {
  try {
    const response = await fetch(`${API_BASE}/tryouts/${tryoutId}/questions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(question),
    });

    if (!response.ok) {
      throw new Error("Failed to create question");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating question:", error);
    throw error;
  }
}

/**
 * Update an existing question
 */
export async function updateQuestion(
  id: string,
  updates: QuestionUpdateInput
): Promise<Question> {
  try {
    const response = await fetch(`${API_BASE}/questions/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error("Failed to update question");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error updating question ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a question
 */
export async function deleteQuestion(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/questions/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete question");
    }
  } catch (error) {
    console.error(`Error deleting question ${id}:`, error);
    throw error;
  }
}
