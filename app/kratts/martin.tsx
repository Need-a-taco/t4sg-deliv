import martinPic from "../../public/Martin.webp";
import "./kratts_style.css";

function Martin() {
  return (
    <div className="card-component flex items-center space-x-4">
      <img src={martinPic.src} alt="Martin Kratt" className="h-auto w-1/3 object-cover" />
      <p className="w-2/3">
        Martin Kratt is a member of the Wild Kratts crew; he is the older Kratt brother, and one of the main characters
        of Wild Kratts. Although he is the elder brother of Chris Kratt, Martin has a more playful side. He is
        characterized by the color blue. He usually names every animal friend the brothers meet.
      </p>
    </div>
  );
}

export default Martin;
