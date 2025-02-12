import { Separator } from "@/components/ui/separator";
import { TypographyH2 } from "@/components/ui/typography";
import { createServerSupabaseClient } from "@/lib/server-utils";
import { redirect } from "next/navigation";
// import AddSpeciesDialog from "./add-species-dialog";
import UserCard from "./user-card";

export default async function UsersList() {
  // Create supabase server component client and obtain user session from stored cookie
  const supabase = createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // this is a protected route - only users who are signed in can view this route
    redirect("/");
  }

  // Obtain the ID of the currently signed-in user
  const sessionId = session.user.id;
  const { data: users } = await supabase.from("profiles").select("*").order("id", { ascending: false });

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <TypographyH2>Profiles List</TypographyH2>
      </div>
      <Separator className="my-4" />
      <div className="flex flex-wrap justify-center">
        {users?.map((user) => <UserCard key={user.id} user={user} sessionId={sessionId} />)}
      </div>
    </>
  );
}
