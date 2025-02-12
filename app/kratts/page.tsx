import { Separator } from "@/components/ui/separator";
import { TypographyH2 } from "@/components/ui/typography";
import Chris from "./chris";
import Kratts from "./kratts";
import Martin from "./martin";

function App() {
  return (
    <>
      <div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-4">
          <TypographyH2>Talk to the Wild Kratts!</TypographyH2>
          <Separator className="my-4" />
          <h4>From wildkratts.fandom.com</h4>
        </div>
        <div className="flex flex-wrap items-center justify-center space-x-20">
          <Chris /> <Martin />
        </div>
        <Separator className="my-4" />
        <div className="flex min-h-screen flex-wrap items-center justify-center">
          <Kratts />
        </div>
      </div>
    </>
  );
}

export default App;
