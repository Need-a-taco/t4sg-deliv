"use client";

/*
Note: "use client" is a Next.js App Router directive that tells React to render the component as
a client component rather than a server component. This establishes the server-client boundary,
providing access to client-side functionality such as hooks and event handlers to this component and
any of its imported children. Although the SpeciesCard component itself does not use any client-side
functionality, it is beneficial to move it to the client because it is rendered in a list with a unique
key prop in species/page.tsx. When multiple component instances are rendered from a list, React uses the unique key prop
on the client-side to correctly match component state and props should the order of the list ever change.
React server components don't track state between rerenders, so leaving the uniquely identified components (e.g. SpeciesCard)
can cause errors with matching props and state in child components if the list order changes.
*/

import { Button } from "@/components/ui/button";
import { type Database } from "@/lib/schema.js";
import Image from "next/image";
import { useState } from "react";
import EditSpeciesDialog from "./edit-species-dialog.tsx";

type Species = Database["public"]["Tables"]["species"]["Row"];

export default function SpeciesCard({ species, display_name }: { species: Species; display_name?: string }) {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const handleEditClick = () => {
    setEditOpen(true);
  };

  const handleDialogClose = () => {
    setEditOpen(false);
  };

  return (
    <div className="z-1 m-4 w-72 min-w-72 flex-none rounded border-2 p-3 shadow">
      {species.image && (
        <div className="z-1 relative h-40 w-full">
          <Image src={species.image} alt={species.scientific_name} fill style={{ objectFit: "cover" }} />
        </div>
      )}
      <h3 className="mt-3 text-2xl font-semibold">{species.scientific_name}</h3>
      <h4 className="text-lg font-light italic">{species.common_name}</h4>
      <hr />
      <p>{species.description ? species.description.slice(0, 150).trim() + "..." : ""}</p>
      <hr />
      <p>Posted by: {display_name}</p>
      {species.is_endangered == true ? (
        <p style={{ color: "red" }}>Endangered</p>
      ) : (
        <p style={{ color: "green" }}>Not Endangered</p>
      )}

      <Button className="mt-3 w-full" onClick={() => setOpen(true)}>
        See Details
      </Button>
      <Button
        className="mt-3 w-full"
        style={{ backgroundColor: "rgba(237, 21, 21, 0.3)", color: "white" }}
        onClick={handleEditClick}
      >
        Edit Species
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="z-60 relative mt-8 w-[90vw] max-w-md rounded bg-white p-6 shadow-lg">
            <div className="z-60 relative mb-4 h-40 w-full">
              <Image src={species.image} alt={species.scientific_name} fill style={{ objectFit: "contain" }} />
            </div>
            <h3 style={{ color: "black" }} className="z-3 mb-4 text-xl font-semibold">
              Details: {species.common_name}
            </h3>
            <p style={{ color: "teal" }}>{species.description ? species.description : ""}</p>
            <Button className="z-60 mt-4 w-full" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      )}

      {editOpen && <EditSpeciesDialog speciesData={species} onClose={handleDialogClose} />}
    </div>
  );
}
