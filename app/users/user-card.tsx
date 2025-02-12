"use client";

import { Button } from "@/components/ui/button";
import { type Database } from "@/lib/schema.js";
import { useRouter } from "next/navigation";
import { useState } from "react";
// import EditSpeciesDialog from "./edit-species-dialog.tsx";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default function UserCard({ user, sessionId }: { user: Profile; sessionId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleEditClick = () => {
    router.push("/settings/profile");
  };

  return (
    <div className="z-1 m-4 w-72 min-w-72 flex-none rounded border-2 p-3 shadow">
      <h3 className="mt-3 text-2xl font-semibold">{user.display_name}</h3>
      <p className="italic">{user.email}</p>
      <hr />
      <p>{user.biography}</p>
      <Button className="mt-3 w-full" onClick={() => setOpen(true)}>
        See Bio
      </Button>
      {sessionId == user.id && (
        <Button
          className="mt-3 w-full"
          style={{ backgroundColor: "rgba(237, 21, 21, 0.3)", color: "white" }}
          onClick={handleEditClick}
        >
          Edit Profile
        </Button>
      )}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="z-60 relative mt-8 w-[90vw] max-w-md rounded bg-white p-6 shadow-lg">
            <div className="mb-2">
              <h3 className="text-xl font-semibold text-black">{user.display_name}</h3>
              <h3 className="text-lg font-light italic">{user.email}</h3>
            </div>
            <hr className="my-4" />
            <p className="mt-2 text-teal-600">{user.biography ? user.biography : ""}</p>
            <Button className="z-60 mt-6 w-full" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
