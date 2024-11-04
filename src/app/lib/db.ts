import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);
export async function getData(keyword: string) {
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

export async function insertData(title: string, story: string, tags: string) {
  await sql`
    INSERT INTO blogs(title, story, tags) VALUES (${title}, ${story}, ${tags})
    `;
}
