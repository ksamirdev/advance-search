"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { insertData } from "./lib/db";
import { insertStoryAction } from "./actions/story";
import toast from "react-hot-toast";

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
      <form
        action={async (fd) => {
          const resp = await insertStoryAction(fd);

          const t = toast.loading("Inserting....");

          if (!resp.success) {
            toast.error(resp.message, { id: t });
            return;
          }

          toast.success(resp.message, { id: t });
          return;
        }}
        className="space-y-2 bg-secondary p-3 rounded-md"
      >
        <h1 className="font-semibold text-lg">Insert data</h1>
        <Input name="title" className="bg-black" placeholder="Enter title" />
        <Textarea name="story" placeholder="Enter story" required />
        <Input
          name="tags"
          className="bg-black"
          placeholder="Enter tags"
          required
        />
        <Button size="sm">Insert story</Button>
      </form>

      <hr />

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
