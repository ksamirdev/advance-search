"use server";

import { insertData } from "../lib/db";

export const insertStoryAction = async (formData: FormData) => {
  const title = formData.get("title");
  const story = formData.get("story");
  const tags = formData.get("tags");

  if (
    typeof title !== "string" ||
    typeof story !== "string" ||
    typeof tags !== "string"
  ) {
    return {
      success: 0,
      message: "Invalid fields provided!",
    };
  }

  if (title === "" || story === "" || tags === "") {
    return {
      success: 0,
      message: "Invalid data provided!",
    };
  }

  try {
    await insertData(title, story, tags);
  } catch (e) {
    return {
      success: 0,
      message: String(e),
    };
  }

  return {
    success: 1,
    message: "Inserted the data!",
  };
};
