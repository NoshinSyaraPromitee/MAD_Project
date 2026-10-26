// Sample reviews, keyed by product id.
// Each product can have zero or more reviews.
const reviews = {
  1: [
    {
      id: "r1",
      name: "Rafiul Hasan",
      rating: 5,
      date: "2026-06-02",
      comment: "Arrived healthy and well packed. Already growing new leaves!",
    },
    {
      id: "r2",
      name: "Sadia Islam",
      rating: 4,
      date: "2026-05-18",
      comment: "Good sapling, a little smaller than I expected but healthy.",
    },
    {
      id: "r7",
      name: "Mizanur Rahman",
      rating: 5,
      date: "2026-06-20",
      comment: "Delivered in two days. The roots were well wrapped and the plant looks strong.",
    },
  ],
  2: [
    {
      id: "r11",
      name: "Shamima Nasrin",
      rating: 5,
      date: "2026-06-08",
      comment: "Started fruiting in the first season. Very sweet guavas.",
    },
    {
      id: "r12",
      name: "Rakib Hasan",
      rating: 4,
      date: "2026-05-30",
      comment: "Healthy plant. Packaging could be a little better.",
    },
  ],
  3: [
    {
      id: "r3",
      name: "Tanvir Ahmed",
      rating: 5,
      date: "2026-06-10",
      comment: "Sturdy clay pot, no cracks, looks great on my balcony.",
    },
    {
      id: "r8",
      name: "Mehnaz Chowdhury",
      rating: 4,
      date: "2026-06-05",
      comment: "Nice quality for the price. Drainage hole is a bit small.",
    },
  ],
  4: [
    {
      id: "r4",
      name: "Nusrat Jahan",
      rating: 5,
      date: "2026-06-14",
      comment: "My plants love this. Noticed greener leaves within two weeks.",
    },
    {
      id: "r5",
      name: "Imran Kabir",
      rating: 4,
      date: "2026-05-29",
      comment: "Works well, smell is a bit strong at first but fades quickly.",
    },
    {
      id: "r9",
      name: "Jahid Hossain",
      rating: 5,
      date: "2026-06-22",
      comment: "Used it on my tomato plants and the growth difference is clear.",
    },
  ],
  5: [
    {
      id: "r13",
      name: "Taslima Begum",
      rating: 4,
      date: "2026-06-12",
      comment: "Good size for my balcony plants. Handle feels sturdy.",
    },
  ],
  6: [
    {
      id: "r6",
      name: "Farhana Akter",
      rating: 5,
      date: "2026-06-01",
      comment: "Great germination rate, exactly as described.",
    },
    {
      id: "r10",
      name: "Abdul Karim",
      rating: 5,
      date: "2026-05-25",
      comment: "Good clean seeds. Almost all of them sprouted in a week.",
    },
  ],
  7: [
    {
      id: "r14",
      name: "Kamal Uddin",
      rating: 5,
      date: "2026-06-03",
      comment: "Strong sapling with good roots. Planted it in the garden and it is settling well.",
    },
  ],
  8: [
    {
      id: "r15",
      name: "Rubina Yasmin",
      rating: 4,
      date: "2026-06-15",
      comment: "Healthy coconut sapling. Delivery took three days but it arrived fine.",
    },
  ],
  9: [
    {
      id: "r16",
      name: "Sohel Rana",
      rating: 5,
      date: "2026-06-18",
      comment: "Great seeds. My lau vines are growing fast on the rooftop.",
    },
  ],
  10: [
    {
      id: "r17",
      name: "Anika Tabassum",
      rating: 5,
      date: "2026-06-09",
      comment: "Solid trowel, does not bend in hard soil.",
    },
    {
      id: "r18",
      name: "Fahim Reza",
      rating: 4,
      date: "2026-05-27",
      comment: "Good value. Handle grip could be softer.",
    },
  ],
  11: [
    {
      id: "r19",
      name: "Lamia Sultana",
      rating: 5,
      date: "2026-06-21",
      comment: "Already has small lemons on it. Very happy with the plant.",
    },
  ],
  12: [
    {
      id: "r20",
      name: "Nazmul Haque",
      rating: 4,
      date: "2026-06-11",
      comment: "Grows quickly. Needs a sunny spot but the plant is healthy.",
    },
  ],
  13: [
    {
      id: "r21",
      name: "Sharmin Akter",
      rating: 5,
      date: "2026-06-17",
      comment: "Beautiful red flowers within a few weeks of planting.",
    },
  ],
  14: [
    {
      id: "r22",
      name: "Asif Mahmud",
      rating: 5,
      date: "2026-06-06",
      comment: "Perfect for my rooftop garden. Light and easy to move around.",
    },
    {
      id: "r23",
      name: "Moushumi Khan",
      rating: 4,
      date: "2026-05-31",
      comment: "Good quality bags. I wish they came with a few more in the set.",
    },
  ],
  15: [
    {
      id: "r24",
      name: "Tahmina Rahman",
      rating: 4,
      date: "2026-06-13",
      comment: "Looks nice in my window. Drainage works well.",
    },
  ],
  16: [
    {
      id: "r25",
      name: "Habibur Rahman",
      rating: 5,
      date: "2026-06-19",
      comment: "Noticed fewer pests in my pots after a few weeks.",
    },
  ],
  17: [
    {
      id: "r26",
      name: "Mahfuza Khatun",
      rating: 5,
      date: "2026-06-04",
      comment: "Well decomposed and no bad smell. My vegetables are doing great.",
    },
    {
      id: "r27",
      name: "Shakil Ahmed",
      rating: 4,
      date: "2026-05-28",
      comment: "Good compost for the price. Packaging was a bit messy.",
    },
  ],
  18: [
    {
      id: "r28",
      name: "Rezaul Karim",
      rating: 5,
      date: "2026-06-16",
      comment: "Sharp and clean cuts. Works well on thicker branches too.",
    },
  ],
  19: [
    {
      id: "r29",
      name: "Sumaiya Islam",
      rating: 5,
      date: "2026-06-07",
      comment: "Excellent germination. Chili plants are producing in pots.",
    },
  ],
  20: [
    {
      id: "r30",
      name: "Delwar Hossain",
      rating: 5,
      date: "2026-06-23",
      comment: "Ready to harvest in about a month, just as the description says.",
    },
  ],
};

export default reviews;
