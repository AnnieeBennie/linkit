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
    category: "Hobbies & Lifestyle",
    date: "15/10/25",
    time: "15:00 - 18:00",
    location: "Aud. 3A14",
    description:
      "Looking to pick up a relaxing new hobby or improve your creative skills? Our Knitting Event is the perfect place to unwind, craft, and connect. Whether you’re a total beginner or an experienced maker, we’ll provide a friendly space to learn new techniques, work on projects, and share ideas. Come join us for a calm, cosy session of creativity and conversation!",
  },
  {
    id: "event-2",
    img: QuizNight,
    title: "Quiz Night",
    org: "Analog & Node",
    category: "Hobbies & Lifestyle",
    date: "15/10/25",
    time: "16:00 - 20:00",
    location: "Analog Café",
    description:
      "Think you’ve got what it takes to claim the title of quiz champion? Join our Quiz Night for an exciting evening of trivia, teamwork, and friendly competition! With questions ranging from pop culture to general knowledge, there’s something for everyone — and plenty of laughs along the way. Bring a team or join one on the spot. Who knows? You might just walk away as the winners!",
  },
  {
    id: "event-3",
    img: FootballTraining,
    title: "Football Training",
    org: "ITUActive",
    category: "Sports & Fitness",
    date: "15/10/25",
    time: "18:00 - 20:00",
    location: "Raffinaderivej 20",
    description:
      "Want to improve your skills, stay active, or train with a friendly group of students? Our Football Training session is open to all levels — from complete beginners to experienced players. Join us for a high-energy evening of drills, teamwork, and match play. It’s a great way to boost your fitness, develop your technique, and connect with other football enthusiasts in a supportive environment!",
  },
  {
    id: "event-4",
    img: DesignEvent,
    title: "Design Event",
    org: "DAK",
    category: "Arts & Culture",
    date: "16/10/25",
    time: "15:00 - 16:00",
    location: "Aud. 2A52",
    description:
      "Curious about design or looking to express your creativity? Our Design Event is the perfect chance to explore new ideas, learn creative techniques, and collaborate with other design-minded students. Whether you're into graphic design, drawing, digital art, or just want to try something new, this session welcomes all skill levels. Come create, experiment, and get inspired!",
  },
  {
    id: "event-5",
    img: ScrollBarParty,
    title: "Scroll Bar Party",
    org: "Scroll Bar",
    category: "Party",
    date: "16/10/25",
    time: "19:00 - 01:00",
    location: "Scroll Bar",
    //description:
    // "Looking to unwind after a long week or meet new people in a relaxed setting? Join us for our Bar Party — an evening full of good music, great vibes, and unforgettable moments! Whether you’re coming with friends or flying solo, this is the perfect chance to socialise, enjoy your favourite drinks, and connect with students from across the university. Expect a lively atmosphere, fun conversations, and a night to remember!",
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
