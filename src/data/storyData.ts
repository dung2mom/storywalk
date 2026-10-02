/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GlossaryItem {
  word: string;
  phonetic: string;
  emoji: string;
  definition: string;
  example: string;
  imageHint?: string;
  koreanMeaning?: string;
}

export interface QuestionChoice {
  text: string;
  emoji: string;
  isCorrect: boolean;
}

export interface PageQuestion {
  type: 'fill_in_the_blank' | 'yes_no' | 'what_you_see';
  prompt: string;
  audioPromptText: string;
  choices: QuestionChoice[];
  hint: string;
  explanation: string;
}

export interface Hotspot {
  id: string;
  label: string;
  emoji: string;
  soundType: 'bark' | 'quack' | 'chirp' | 'whoosh' | 'boing' | 'giggle';
  soundEffectText: string;
  top: string; // percentage
  left: string; // percentage
}

export interface StoryPage {
  pageNumber: number;
  text: string;
  highlightWords: string[]; // key words underlined for glossary
  image: string;
  altText: string;
  sceneTitle: string;
  hotspots: Hotspot[];
  question: PageQuestion;
}

export interface StoryRetellCard {
  id: string;
  order: number;
  stageName: 'Beginning' | 'Problem' | 'Event' | 'Ending';
  title: string;
  description: string;
  emoji: string;
  imageKey: string;
}

import coverImg from '../assets/images/cover_the_lost_hat_1790907042008.jpg';
import windImg from '../assets/images/story_scene_wind_blows_1790907056094.jpg';
import pondImg from '../assets/images/story_scene_duck_pond_1790907070141.jpg';
import birdImg from '../assets/images/story_scene_bird_tree_1790907081042.jpg';
import badgeImg from '../assets/images/badge_story_explorer_1790907091094.jpg';

// Images bundled and supported on both dev and production (Vercel)
export const STORY_IMAGES = {
  cover: coverImg,
  wind: windImg,
  pond: pondImg,
  bird: birdImg,
  badge: badgeImg,
};

// Global picture glossary for 3rd-4th grade learners (CEFR Pre-A1 to A1)
export const GLOSSARY_DICTIONARY: Record<string, GlossaryItem> = {
  bear: {
    word: 'bear',
    phonetic: '/beər/',
    emoji: '🐻',
    definition: 'A large, friendly animal with soft fur and round ears.',
    example: 'Leo is a happy brown bear who loves the park.',
  },
  yellow: {
    word: 'yellow',
    phonetic: '/ˈjel.oʊ/',
    emoji: '💛',
    definition: 'A bright, sunny color like lemons and sunflowers.',
    example: 'Leo wears his bright yellow hat on sunny days.',
  },
  hat: {
    word: 'hat',
    phonetic: '/hæt/',
    emoji: '👒',
    definition: 'Something you wear on your head to keep warm or shade from the sun.',
    example: 'The yellow hat flies in the air.',
  },
  park: {
    word: 'park',
    phonetic: '/pɑːrk/',
    emoji: '🌳',
    definition: 'A big open green place with grass, trees, and flowers to play.',
    example: 'Leo and Pip go to the park together.',
  },
  sunny: {
    word: 'sunny',
    phonetic: '/ˈsʌn.i/',
    emoji: '☀️',
    definition: 'Bright with lots of warm sunlight in the sky.',
    example: 'Today is a warm and sunny morning.',
  },
  puppy: {
    word: 'puppy',
    phonetic: '/ˈpʌp.i/',
    emoji: '🐶',
    definition: 'A young and playful pet dog.',
    example: 'Pip is a happy puppy with floppy ears.',
  },
  wind: {
    word: 'wind',
    phonetic: '/wɪnd/',
    emoji: '💨',
    definition: 'Moving air that you can feel blowing on your face.',
    example: 'A strong wind blows through the trees.',
  },
  blows: {
    word: 'blows',
    phonetic: '/bloʊz/',
    emoji: '🍃',
    definition: 'Pushes things forward using the power of air.',
    example: 'The wind blows the hat off Leo’s head.',
  },
  grass: {
    word: 'grass',
    phonetic: '/ɡræs/',
    emoji: '🌱',
    definition: 'Short green plants covering the ground in gardens and parks.',
    example: 'Pip runs happily across the soft green grass.',
  },
  flies: {
    word: 'flies',
    phonetic: '/flaɪz/',
    emoji: '🪁',
    definition: 'Moves high up through the air like a kite or bird.',
    example: 'The yellow hat flies away into the sky.',
  },
  sky: {
    word: 'sky',
    phonetic: '/skaɪ/',
    emoji: '☁️',
    definition: 'The wide open space high above us where clouds and the sun live.',
    example: 'Look up at the beautiful blue sky.',
  },
  barks: {
    word: 'barks',
    phonetic: '/bɑːrks/',
    emoji: '🐕',
    definition: 'Makes a short, loud dog sound: "Woof woof!"',
    example: 'Pip barks loudly when he chases the hat.',
  },
  runs: {
    word: 'runs',
    phonetic: '/rʌnz/',
    emoji: '🏃',
    definition: 'Moves very fast with feet on the ground.',
    example: 'Pip runs fast to catch the hat.',
  },
  pond: {
    word: 'pond',
    phonetic: '/pɑːnd/',
    emoji: '🌊',
    definition: 'A small body of still water where ducks swim.',
    example: 'Leo looks into the clear blue pond.',
  },
  water: {
    word: 'water',
    phonetic: '/ˈwɔː.tər/',
    emoji: '💧',
    definition: 'Clear liquid that we drink and fish swim in.',
    example: 'The pond water is cool and calm.',
  },
  ducks: {
    word: 'ducks',
    phonetic: '/dʌks/',
    emoji: '🦆',
    definition: 'Water birds with webbed feet that quack and swim.',
    example: 'Two yellow ducks paddle in the pond.',
  },
  tree: {
    word: 'tree',
    phonetic: '/triː/',
    emoji: '🌲',
    definition: 'A tall plant with a thick wooden trunk and green leaves.',
    example: 'Leo looks up into the tall green tree.',
  },
  bird: {
    word: 'bird',
    phonetic: '/bɜːrd/',
    emoji: '🐦',
    definition: 'An animal with feathers and wings that sings in trees.',
    example: 'A tiny blue bird sits in the nest.',
  },
  inside: {
    word: 'inside',
    phonetic: '/ɪnˈsaɪd/',
    emoji: '📦',
    definition: 'In the middle of something or enclosed by it.',
    example: 'The bird is sitting inside the yellow hat!',
  },
  head: {
    word: 'head',
    phonetic: '/hed/',
    emoji: '🐻',
    definition: 'The top part of your body where your eyes, ears, and hat rest.',
    example: 'The hat lands softly right on Leo’s head.',
  },
  chirp: {
    word: 'chirp',
    phonetic: '/tʃɜːrp/',
    emoji: '🐦',
    definition: 'To make a short, high, happy sound like a little bird.',
    example: 'The little blue bird chirps happily in the tree.',
  },
  chirps: {
    word: 'chirp',
    phonetic: '/tʃɜːrp/',
    emoji: '🐦',
    definition: 'To make a short, high, happy sound like a little bird.',
    example: 'The little blue bird chirps happily in the tree.',
  },
  push: {
    word: 'push',
    phonetic: '/pʊʃ/',
    emoji: '🐾',
    definition: 'To use force to move something forward or away from you.',
    example: 'The bird uses its beak to push the hat off the branch.',
  },
  pushes: {
    word: 'push',
    phonetic: '/pʊʃ/',
    emoji: '🐾',
    definition: 'To use force to move something forward or away from you.',
    example: 'The bird uses its beak to push the hat off the branch.',
  },
};

// 10 Guided Story Pages for "The Lost Hat"
export const STORY_PAGES: StoryPage[] = [
  {
    pageNumber: 1,
    sceneTitle: 'A Sunny Morning',
    text: 'Leo is a happy little bear. He puts on his favorite yellow hat.',
    highlightWords: ['bear', 'yellow', 'hat'],
    image: STORY_IMAGES.cover,
    altText: 'Leo the friendly bear wearing his favorite yellow hat in the garden',
    hotspots: [
      { id: 'h1', label: 'Leo the Bear', emoji: '🐻', soundType: 'giggle', soundEffectText: 'Hehe! I love my hat!', top: '48%', left: '42%' },
    ],
    question: {
      type: 'fill_in_the_blank',
      prompt: 'Leo puts on his favorite ___ hat.',
      audioPromptText: 'Leo puts on his favorite blank hat. Which color is it?',
      choices: [
        { text: 'yellow', emoji: '💛', isCorrect: true },
        { text: 'purple', emoji: '💜', isCorrect: false },
        { text: 'green', emoji: '💚', isCorrect: false },
      ],
      hint: 'Look at the color of the hat in the picture! It shines like the sun.',
      explanation: 'Super! Leo puts on his favorite yellow hat!',
    },
  },
  {
    pageNumber: 2,
    sceneTitle: 'Walking with Pip',
    text: 'Leo walks to the sunny park with his friendly puppy, Pip.',
    highlightWords: ['park', 'sunny', 'puppy'],
    image: STORY_IMAGES.cover,
    altText: 'Leo and puppy Pip walking together toward the sunny park',
    hotspots: [
      { id: 'h3', label: 'Pip the Puppy', emoji: '🐶', soundType: 'bark', soundEffectText: 'Woof woof! Let’s play in the park!', top: '68%', left: '60%' },
    ],
    question: {
      type: 'what_you_see',
      prompt: 'Who walks to the park with Leo?',
      audioPromptText: 'Who walks to the park with Leo?',
      choices: [
        { text: 'Pip the puppy', emoji: '🐶', isCorrect: true },
        { text: 'A big tiger', emoji: '🐯', isCorrect: false },
        { text: 'A grumpy frog', emoji: '🐸', isCorrect: false },
      ],
      hint: 'Listen closely: "with his friendly puppy, Pip!"',
      explanation: 'Great job! Pip the puppy walks with Leo!',
    },
  },
  {
    pageNumber: 3,
    sceneTitle: 'A Strong Wind!',
    text: 'Whoosh! A strong wind blows across the grass.',
    highlightWords: ['wind', 'blows', 'grass'],
    image: STORY_IMAGES.wind,
    altText: 'A sudden gust of wind blowing leaves and swirling across the park',
    hotspots: [
      { id: 'h5', label: 'The Big Wind', emoji: '💨', soundType: 'whoosh', soundEffectText: 'Whoooosh! Swirling through the park!', top: '35%', left: '30%' },
      { id: 'h6', label: 'Green Grass', emoji: '🌱', soundType: 'boing', soundEffectText: 'Swish swish in the cool breeze!', top: '80%', left: '50%' },
    ],
    question: {
      type: 'yes_no',
      prompt: 'Does a strong wind blow across the grass?',
      audioPromptText: 'Does a strong wind blow across the grass? Yes or no?',
      choices: [
        { text: 'Yes, it does!', emoji: '✅', isCorrect: true },
        { text: 'No, it is raining.', emoji: '❌', isCorrect: false },
      ],
      hint: 'The story says: "Whoosh! A strong wind blows across the grass."',
      explanation: 'Spot on! A strong wind blows across the grass!',
    },
  },
  {
    pageNumber: 4,
    sceneTitle: 'Flying Away',
    text: 'Oh no! The yellow hat flies high into the blue sky.',
    highlightWords: ['yellow', 'hat', 'flies', 'sky'],
    image: STORY_IMAGES.wind,
    altText: 'The yellow hat caught by the wind, flying high above the bear',
    hotspots: [
      { id: 'h7', label: 'Flying Hat', emoji: '👒', soundType: 'whoosh', soundEffectText: 'Wheee! Up into the sky!', top: '18%', left: '65%' },
      { id: 'h8', label: 'Surprised Leo', emoji: '😮', soundType: 'giggle', soundEffectText: 'Oh no, my favorite hat!', top: '55%', left: '38%' },
    ],
    question: {
      type: 'fill_in_the_blank',
      prompt: 'The hat flies high into the blue ___ .',
      audioPromptText: 'The hat flies high into the blue what? Sky, box, or car?',
      choices: [
        { text: 'sky', emoji: '☁️', isCorrect: true },
        { text: 'box', emoji: '📦', isCorrect: false },
        { text: 'car', emoji: '🚗', isCorrect: false },
      ],
      hint: 'Where do clouds float? High up in the blue...',
      explanation: 'Excellent! The yellow hat flies high into the blue sky!',
    },
  },
  {
    pageNumber: 5,
    sceneTitle: 'Pip Chases the Hat',
    text: 'Pip barks and runs, but the hat does not fall down.',
    highlightWords: ['barks', 'runs', 'hat'],
    image: STORY_IMAGES.wind,
    altText: 'Pip running fast with paws in the air, trying to catch the hat',
    hotspots: [
      { id: 'h9', label: 'Running Pip', emoji: '🐶', soundType: 'bark', soundEffectText: 'Woof! Wait for me, hat!', top: '70%', left: '72%' },
    ],
    question: {
      type: 'what_you_see',
      prompt: 'What does Pip do when the hat flies?',
      audioPromptText: 'What does Pip do when the hat flies?',
      choices: [
        { text: 'He barks and runs', emoji: '🐕', isCorrect: true },
        { text: 'He goes to sleep', emoji: '😴', isCorrect: false },
        { text: 'He eats an apple', emoji: '🍎', isCorrect: false },
      ],
      hint: 'Pip is very fast! He barks and...',
      explanation: 'Wonderful! Pip barks and runs to catch it!',
    },
  },
  {
    pageNumber: 6,
    sceneTitle: 'By the Big Pond',
    text: 'Leo looks near the big pond. "Is my hat in the water?" he asks.',
    highlightWords: ['pond', 'water', 'hat'],
    image: STORY_IMAGES.pond,
    altText: 'Leo and Pip peering into the calm blue park pond',
    hotspots: [
      { id: 'h10', label: 'Blue Pond', emoji: '🌊', soundType: 'boing', soundEffectText: 'Splash! Clear cool pond water.', top: '65%', left: '45%' },
      { id: 'h11', label: 'Leo Searching', emoji: '🐻', soundType: 'giggle', soundEffectText: 'Where could my yellow hat be?', top: '48%', left: '22%' },
    ],
    question: {
      type: 'fill_in_the_blank',
      prompt: 'Leo looks near the big ___ .',
      audioPromptText: 'Leo looks near the big blank. Pond, mountain, or kitchen?',
      choices: [
        { text: 'pond', emoji: '🌊', isCorrect: true },
        { text: 'mountain', emoji: '⛰️', isCorrect: false },
        { text: 'kitchen', emoji: '🍳', isCorrect: false },
      ],
      hint: 'Ducks swim in it! A small body of water.',
      explanation: 'You got it! Leo looks near the big pond.',
    },
  },
  {
    pageNumber: 7,
    sceneTitle: 'Two Sweet Ducks',
    text: 'Two sweet ducks shake their heads. "Quack! No hat here!"',
    highlightWords: ['ducks', 'water'],
    image: STORY_IMAGES.pond,
    altText: 'Two yellow ducks paddling and quacking friendly in the water',
    hotspots: [
      { id: 'h12', label: 'Yellow Ducks', emoji: '🦆', soundType: 'quack', soundEffectText: 'Quack quack! No yellow hat down here!', top: '55%', left: '68%' },
    ],
    question: {
      type: 'yes_no',
      prompt: 'Is the yellow hat inside the pond?',
      audioPromptText: 'Is the yellow hat inside the pond? Yes or no?',
      choices: [
        { text: 'No, it is not!', emoji: '❌', isCorrect: true },
        { text: 'Yes, it is floating.', emoji: '✅', isCorrect: false },
      ],
      hint: 'The ducks say: "Quack! No hat here!"',
      explanation: 'Correct! The hat is not in the pond!',
    },
  },
  {
    pageNumber: 8,
    sceneTitle: 'The Tall Tree',
    text: 'Leo looks up at the tall green tree. Pip wags his tail.',
    highlightWords: ['tree', 'puppy', 'head'],
    image: STORY_IMAGES.bird,
    altText: 'Leo and Pip looking up toward the leafy branches of a tall green tree',
    hotspots: [
      { id: 'h13', label: 'Tall Green Tree', emoji: '🌲', soundType: 'whoosh', soundEffectText: 'Rustle rustle in the gentle leaves!', top: '25%', left: '50%' },
      { id: 'h14', label: 'Pip Wagging Tail', emoji: '🐕', soundType: 'bark', soundEffectText: 'Wag wag! I see something up there!', top: '75%', left: '60%' },
    ],
    question: {
      type: 'what_you_see',
      prompt: 'Where does Leo look next?',
      audioPromptText: 'Where does Leo look next?',
      choices: [
        { text: 'At the tall green tree', emoji: '🌳', isCorrect: true },
        { text: 'Under the heavy rock', emoji: '🪨', isCorrect: false },
        { text: 'Inside a tiny hole', emoji: '🕳️', isCorrect: false },
      ],
      hint: 'He looks up high where branches grow!',
      explanation: 'Nice! Leo looks up at the tall green tree!',
    },
  },
  {
    pageNumber: 9,
    sceneTitle: 'A Surprise Nest!',
    text: 'Look! A tiny bird is sitting inside the yellow hat!',
    highlightWords: ['bird', 'sitting', 'inside', 'hat'],
    image: STORY_IMAGES.bird,
    altText: 'A cute little bluebird happily nestled inside the yellow hat on a branch',
    hotspots: [
      { id: 'h15', label: 'Tiny Bird', emoji: '🐦', soundType: 'chirp', soundEffectText: 'Chirp chirp! What a cozy yellow nest!', top: '35%', left: '48%' },
      { id: 'h16', label: 'Hat in Tree', emoji: '👒', soundType: 'boing', soundEffectText: 'Found you! Safe on the branch.', top: '38%', left: '55%' },
    ],
    question: {
      type: 'what_you_see',
      prompt: 'What is sitting inside the yellow hat?',
      audioPromptText: 'What is sitting inside the yellow hat?',
      choices: [
        { text: 'A tiny bird', emoji: '🐦', isCorrect: true },
        { text: 'A sleeping cat', emoji: '🐱', isCorrect: false },
        { text: 'A big pineapple', emoji: '🍍', isCorrect: false },
      ],
      hint: 'It has feathers and sings chirp chirp!',
      explanation: 'Brilliant! A tiny bird is sitting inside the hat!',
    },
  },
  {
    pageNumber: 10,
    sceneTitle: 'The Hat Returns!',
    text: 'The bird chirps and pushes the hat. It drops right onto Leo\'s head! Hurray!',
    highlightWords: ['chirp', 'push', 'chirps', 'pushes'],
    image: STORY_IMAGES.bird,
    altText: 'The yellow hat landing gently back on Leo’s head as everyone cheers',
    hotspots: [
      { id: 'h17', label: 'Happy Leo', emoji: '🐻', soundType: 'giggle', soundEffectText: 'Hurray! My hat is back! Thank you, bird!', top: '65%', left: '42%' },
      { id: 'h18', label: 'Gentle Bird', emoji: '🐦', soundType: 'chirp', soundEffectText: 'Chirp! Have a wonderful day, Leo!', top: '28%', left: '46%' },
    ],
    question: {
      type: 'fill_in_the_blank',
      prompt: 'The hat drops right onto Leo’s ___ !',
      audioPromptText: 'The hat drops right onto Leo’s blank! Head, shoe, or hand?',
      choices: [
        { text: 'head', emoji: '🐻', isCorrect: true },
        { text: 'shoe', emoji: '👟', isCorrect: false },
        { text: 'hand', emoji: '🖐️', isCorrect: false },
      ],
      hint: 'Where do bears wear their hats?',
      explanation: 'You did it! The hat drops right onto Leo’s head! Hurray!',
    },
  },
];

// Story Map Retelling Cards (Beginning -> Problem -> Event -> Ending)
export const RETELL_CARDS: StoryRetellCard[] = [
  {
    id: 'c1',
    order: 1,
    stageName: 'Beginning',
    title: 'Sunny Walk',
    description: 'Leo puts on his yellow hat and walks with Pip to the sunny park.',
    emoji: '☀️',
    imageKey: 'cover',
  },
  {
    id: 'c2',
    order: 2,
    stageName: 'Problem',
    title: 'The Wind Blows',
    description: 'A strong wind blows whoosh! The yellow hat flies high into the sky.',
    emoji: '💨',
    imageKey: 'wind',
  },
  {
    id: 'c3',
    order: 3,
    stageName: 'Event',
    title: 'Searching Everywhere',
    description: 'Leo and Pip search the pond and look up into the tall green tree.',
    emoji: '🔍',
    imageKey: 'pond',
  },
  {
    id: 'c4',
    order: 4,
    stageName: 'Ending',
    title: 'Hat is Back!',
    description: 'A tiny bird pushes the hat, and it drops right back onto Leo’s head!',
    emoji: '🎉',
    imageKey: 'bird',
  },
];

// Reflection Sentence Starter Options
export const REFLECTION_OPTIONS = {
  subjects: [
    { text: 'Pip the puppy', emoji: '🐶' },
    { text: 'the yellow hat', emoji: '👒' },
    { text: 'the tiny bird', emoji: '🐦' },
    { text: 'Leo the bear', emoji: '🐻' },
    { text: 'the two sweet ducks', emoji: '🦆' },
  ],
  reasons: [
    { text: 'it helped Leo find his hat', emoji: '🤝' },
    { text: 'it was super cute and playful', emoji: '✨' },
    { text: 'it made the story so exciting', emoji: '🎈' },
    { text: 'it had a very happy ending', emoji: '🌟' },
    { text: 'it was funny when the wind blew', emoji: '😄' },
  ],
};

// Additional Stories Teasers for "Choose Another Story"
export const MORE_STORIES = [
  {
    id: 'story-2',
    title: 'The Lost Hat 2: A Snowy Day',
    subtitle: 'Winter Adventure with Leo & Pip',
    level: 'CEFR Pre-A1 · 350 words',
    pages: 10,
    coverColor: 'from-sky-400 to-indigo-500',
    description: 'Snow falls in the park! Leo makes a friendly snowman who needs a warm hat.',
    badge: 'Coming Up Next',
  },
  {
    id: 'story-3',
    title: "Pip's Big Red Balloon",
    subtitle: 'A park adventure about sharing',
    level: 'CEFR A1 · 380 words',
    pages: 10,
    coverColor: 'from-rose-400 to-amber-500',
    description: 'Pip gets a shiny red balloon at the park fair. Where does it float to?',
    badge: 'Popular Favorite',
  },
];
