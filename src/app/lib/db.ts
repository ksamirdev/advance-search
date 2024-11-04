import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);
export async function getData(keyword: string) {
  // Transform the keyword for full-text search and split for fuzzy matching
  const searchQuery = keyword.replace(/\s+/g, " & ").toLowerCase();
  const words = keyword.split(/\s+/);

  // Build fuzzy match conditions for each word in the keyword
  const fuzzyConditions = words
    .map((word) => `story % '${word}' OR title % '${word}'`)
    .join(" OR ");

  // Build similarity ranking for each word in the keyword
  const similarityRanking = words
    .map((word) => `similarity(story, '${word}')`)
    .join(", ");

  const query = `
      SELECT id, title, story, tags
      FROM blogs
      WHERE
        tsv @@ to_tsquery($1)
        OR (${fuzzyConditions})
      ORDER BY
        ts_rank(tsv, to_tsquery($1)) DESC,
        GREATEST(${similarityRanking}) DESC;
    `;

  const results = await sql(query, [searchQuery]);

  return results;
}

export async function insertData(title: string, story: string, tags: string) {
  await sql`
    INSERT INTO blogs(title, story, tags) VALUES (${title}, ${story}, ${tags})
    `;
}
