// Importing local images for the event/club cards from src/assets/images
import Knitting from "../assets/images/Knitting.png";
import QuizNight from "../assets/images/QuizNight.png";
import FootballTraining from "../assets/images/FootballTraining.png";
import DesignEvent from "../assets/images/DesignEvent.png";
import ScrollBarParty from "../assets/images/ScrollBarParty.png";

import PadelClub from "../assets/images/PaddelClub.png";
import PhotographyClub from "../assets/images/PhotographyClub.png";
import ConnectIT from "../assets/images/ConneIT.png";
import Node from "../assets/images/Node.png";
import Analog from "../assets/images/Analog.png";

export const RECENT_EVENTS = [
  {
    id: "event-1",
    img: Knitting,
    title: "Knitting Together",
    org: "KnitIT",
    date: "15/10/25",
    time: "15:00 - 18:00",
    location: "Aud. 3A14",
  },
  {
    id: "event-2",
    img: QuizNight,
    title: "Quiz Night",
    org: "Analog & Node",
    date: "15/10/25",
    time: "16:00 - 20:00",
    location: "Analog Café",
  },
  {
    id: "event-3",
    img: FootballTraining,
    title: "Football Training",
    org: "ITUActive",
    date: "15/10/25",
    time: "18:00 - 20:00",
    location: "Raffinaderivej 20",
  },
  {
    id: "event-4",
    img: DesignEvent,
    title: "Design Event",
    org: "DAK",
    date: "16/10/25",
    time: "15:00 - 16:00",
    location: "Aud. 2A52",
  },
  {
    id: "event-5",
    img: ScrollBarParty,
    title: "Scroll Bar Party",
    org: "Scroll Bar",
    date: "16/10/25",
    time: "19:00 - 01:00",
    location: "Scroll Bar",
  },
];

export const YOUR_CLUBS = [
  {
    id: "club-1",
    img: PadelClub,
    name: "Padel Club",
    category: "Sports & Fitness",
  },
  {
    id: "club-2",
    img: PhotographyClub,
    name: "Photography Club",
    category: "Arts & Culture",
  },
  {
    id: "club-3",
    img: ConnectIT,
    name: "ConnectIT",
    category: "Arts & Culture",
  },
  {
    id: "club-4",
    img: Node,
    name: "Node",
    category: "Arts & Culture",
  },
  {
    id: "club-5",
    img: Analog,
    name: "Analog",
    category: "Hobbies & Lifestyle",
  },
];
