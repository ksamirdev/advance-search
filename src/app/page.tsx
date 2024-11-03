"use client";

import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function Home() {
  const [search, setSearch] = useState("");

  const query = useQuery<
    {
      id: string;
      title: string;
      story: string;
      tags: string;
    }[]
  >({
    queryKey: ["data", search],
    queryFn: async () => {
      const resp = await fetch(`/api/search?query=${search}`);
      return await resp.json();
    },
  });

  return (
    <div className="container py-[20vh] space-y-3">
      <Input
        value={search}
        onChange={(ev) => setSearch(ev.currentTarget.value)}
        placeholder="Search a story"
      />

      {(query.data?.length ?? 0) > 0 ? (
        query.data?.map((data) => {
          return (
            <div key={data.id} className="p-5 bg-secondary rounded">
              <div>
                <b>Title:</b> {data.title}
              </div>
              <div>
                <b>Story:</b> {data.story}
              </div>
              <div>
                <b>Tags:</b> {data.tags}
              </div>
            </div>
          );
        })
      ) : !query.isLoading ? (
        <div className="text-center text-lg">No result!</div>
      ) : (
        ""
      )}

      {query.isLoading && (
        <div className="text-center text-lg">Loading....!</div>
      )}
    </div>
  );
}
