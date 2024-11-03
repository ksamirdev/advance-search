import { neon } from "@neondatabase/serverless";

export async function getData(keyword: string) {
  const sql = neon(process.env.DATABASE_URL!);

  const searchQuery = keyword
    .replace(/\s+/g, " & ")
    .replace(/&/g, " | ")
    .toLowerCase();

  const data = await sql`
    SELECT id, title, story, tags
    FROM blogs
    WHERE tsv @@ to_tsquery(${searchQuery})
       OR title ILIKE '%' || ${keyword} || '%'
       OR story ILIKE '%' || ${keyword} || '%'
       OR tags ILIKE '%' || ${keyword} || '%'
    ORDER BY ts_rank(tsv, to_tsquery(${searchQuery})) DESC,
             similarity(title, ${keyword}) DESC,
             similarity(story, ${keyword}) DESC;
  `;

  return data;
}
