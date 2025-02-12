import chrisPic from "../../public/Chris.webp";
import "./kratts_style.css";

function Chris() {
  return (
    <div className="card-component flex items-center space-x-4">
      <img src={chrisPic.src} alt="Chris Kratt" className="h-auto w-1/3 object-cover" />
      <p className="w-2/3">
        Chris Kratt is a member of the Wild Kratts crew and the younger of the two Kratt brothers. Together, he and his
        brother Martin Kratt are the main protagonists of Wild Kratts. Chris is sometimes the more sensible and
        analytical of the two. Though he can have a hard time loosening up, luckily Martin always knows what to do about
        that. He is characterized by the color green.
      </p>
    </div>
  );
}

export default Chris;
