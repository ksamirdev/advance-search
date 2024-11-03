import { getData } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("query");

  const data = await getData(decodeURIComponent(query ?? ""));

  console.log(data);

  return NextResponse.json(data);
}
