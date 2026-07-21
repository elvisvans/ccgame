(() => {
  "use strict";

  const PLAY_QUESTIONS = 10;
  const CHOICES_BY_LEVEL = { 1: 2, 2: 3, 3: 4 };
  const STICKER_UNLOCK_MIN = 8;
  const STICKER_STORAGE_KEY = "hb-stickers-v1";
  const MUSIC_STORAGE_KEY = "hb-music-v1";
  const STICKERS_PER_PAGE = 9;

  /**
   * 2 books × 3×3 grid. Replace assets/stickers/p{page}-{slot}.png with your cartoon art.
   * Placeholder emoji shows until custom art loads.
   */
  const STICKER_BOOKS = [
    {
      id: 1,
      title: "Book 1 · Friends",
      stickers: [
        { id: "p1-1", name: "Anpanman", emoji: "🍞", src: "assets/stickers/p1-1.png" },
        { id: "p1-2", name: "Melonpanna", emoji: "🍈", src: "assets/stickers/p1-2.webp" },
        { id: "p1-3", name: "Currypanman", emoji: "🍛", src: "assets/stickers/p1-3.webp" },
        { id: "p1-4", name: "Creampanda", emoji: "🐼", src: "assets/stickers/p1-4.webp" },
        { id: "p1-5", name: "Baikinman", emoji: "🦠", src: "assets/stickers/p1-5.webp" },
        { id: "p1-6", name: "Dokinchan", emoji: "💗", src: "assets/stickers/p1-6.webp" },
        { id: "p1-7", name: "Butterko", emoji: "🧈", src: "assets/stickers/p1-7.webp" },
        { id: "p1-8", name: "Horrorman", emoji: "🦴", src: "assets/stickers/p1-8.webp" },
        { id: "p1-9", name: "Shokupanman", emoji: "🥖", src: "assets/stickers/p1-9.webp" },
      ],
    },
    {
      id: 2,
      title: "Book 2 · Fun day",
      stickers: [
        { id: "p2-1", name: "Jam Ojisan", emoji: "🍓", src: "assets/stickers/p2-1.webp" },
        { id: "p2-2", name: "Kokinchan", emoji: "📘", src: "assets/stickers/p2-2.webp" },
        { id: "p2-3", name: "Dokin basket", emoji: "🧺", src: "assets/stickers/p2-3.webp" },
        { id: "p2-4", name: "Creampanda", emoji: "😲", src: "assets/stickers/p2-4.webp" },
        { id: "p2-5", name: "Blue Tears", emoji: "💧", src: "assets/stickers/p2-5.webp" },
        { id: "p2-6", name: "Friends", emoji: "🤝", src: "assets/stickers/p2-6.webp" },
        { id: "p2-7", name: "Adventure 1", emoji: "🎬", src: "assets/stickers/p2-7.webp" },
        { id: "p2-8", name: "Adventure 2", emoji: "🌟", src: "assets/stickers/p2-8.webp" },
        { id: "p2-9", name: "All friends", emoji: "🎉", src: "assets/stickers/p2-9.jpg" },
      ],
    },
  ];

  // Openmoji CC BY-SA 4.0 — local copies from unpkg openmoji
  const ANIMALS = {
    bunny: {
      id: "bunny",
      name: "Bunny",
      src: "assets/animals/bunny.svg",
      cdn: "https://unpkg.com/openmoji@15.0.0/color/svg/1F430.svg",
    },
    cat: {
      id: "cat",
      name: "Cat",
      src: "assets/animals/cat.svg",
      cdn: "https://unpkg.com/openmoji@15.0.0/color/svg/1F431.svg",
    },
    dog: {
      id: "dog",
      name: "Dog",
      src: "assets/animals/dog.svg",
      cdn: "https://unpkg.com/openmoji@15.0.0/color/svg/1F436.svg",
    },
    pig: {
      id: "pig",
      name: "Piggy",
      src: "assets/animals/pig.svg",
      cdn: "https://unpkg.com/openmoji@15.0.0/color/svg/1F437.svg",
    },
    shark: {
      id: "shark",
      name: "Baby Shark",
      src: "assets/animals/shark.svg",
      cdn: "https://unpkg.com/openmoji@15.0.0/color/svg/1F988.svg",
    },
    bear: {
      id: "bear",
      name: "Bear",
      src: "assets/animals/bear.svg",
      cdn: "https://unpkg.com/openmoji@15.0.0/color/svg/1F43B.svg",
    },
  };

  const FEELING_BADGE = {
    happy: { emoji: "😊", icon: "assets/items/happy.svg", code: "1F60A" },
    hungry: { emoji: "😋", icon: "assets/items/hungry.svg", code: "1F60B" },
    thirsty: { emoji: "💧", icon: "assets/items/thirsty.svg", code: "1F4A7" },
    sleepy: { emoji: "😴", icon: "assets/items/sleepy.svg", code: "1F634" },
    sad: { emoji: "😢", icon: "assets/items/sad.svg", code: "1F622" },
    angry: { emoji: "😠", icon: "assets/items/angry.svg", code: "1F620" },
    scared: { emoji: "😨", icon: "assets/items/scared.svg", code: "1F628" },
    love: { emoji: "🥰", icon: "assets/items/love.svg", code: "1F970" },
    surprised: { emoji: "😲", icon: "assets/items/surprised.svg", code: "1F632" },
  };

  /** Always available background music (assets/music) */
  const BASE_MUSIC = [
    { id: "bgm-50on", src: "assets/music/01. Bgm 50on.mp3", label: "Bgm 50on", free: true },
    { id: "ad-06", src: "assets/music/03. Ad 06 An Inst.mp3", label: "Ad 06 Inst", free: true },
    { id: "bgm-block", src: "assets/music/03. Bgm Block.mp3", label: "Bgm Block", free: true },
    { id: "bg-dokin", src: "assets/music/07. Bg 04 Dokin.mp3", label: "Bg Dokin", free: true },
    { id: "rh-haru", src: "assets/music/65. Rh 04 Haru.mp3", label: "Rh Haru", free: true },
    { id: "rh-musu", src: "assets/music/66. Rh 05 Musu.mp3", label: "Rh Musu", free: true },
  ];

  /** Unlockable songs from assets/unlock-music (Play mode 8+ correct) */
  const UNLOCK_MUSIC = [
    { id: "u-courage", src: "assets/unlock-music/01. Courage Ringing.mp3", label: "Courage Ringing", free: false },
    { id: "u-march", src: "assets/unlock-music/02. March.mp3", label: "March", free: false },
    { id: "u-akhp", src: "assets/unlock-music/03. Song Akhp.mp3", label: "Song Akhp", free: false },
    { id: "u-aond", src: "assets/unlock-music/04. Song Aond.mp3", label: "Song Aond", free: false },
    { id: "u-apts", src: "assets/unlock-music/05. Song Apts.mp3", label: "Song Apts", free: false },
    { id: "u-hige", src: "assets/unlock-music/06. Song Hige.mp3", label: "Song Hige", free: false },
    { id: "u-tewo", src: "assets/unlock-music/07. Song Tewo.mp3", label: "Song Tewo", free: false },
    { id: "u-sunsun", src: "assets/unlock-music/08. Sun Sun.mp3", label: "Sun Sun", free: false },
  ];

  const ALL_MUSIC = BASE_MUSIC.concat(UNLOCK_MUSIC);

  // Openmoji item icons (local + unpkg fallback)
  function iconPaths(file, code) {
    return {
      icon: `assets/items/${file}`,
      cdn: `https://unpkg.com/openmoji@15.0.0/color/svg/${code}.svg`,
    };
  }

  /** @type {{ id: string, label: string, emoji: string, icon: string, cdn: string }[]} */
  const ITEMS = [
    { id: "banana", label: "Banana", emoji: "🍌", ...iconPaths("banana.svg", "1F34C") },
    { id: "apple", label: "Apple", emoji: "🍎", ...iconPaths("apple.svg", "1F34E") },
    { id: "carrot", label: "Carrot", emoji: "🥕", ...iconPaths("carrot.svg", "1F955") },
    { id: "cookie", label: "Cookie", emoji: "🍪", ...iconPaths("cookie.svg", "1F36A") },
    { id: "fish", label: "Fish", emoji: "🐟", ...iconPaths("fish.svg", "1F41F") },
    { id: "bone", label: "Bone", emoji: "🦴", ...iconPaths("bone.svg", "1F9B4") },
    { id: "milk", label: "Milk", emoji: "🥛", ...iconPaths("milk.svg", "1F95B") },
    { id: "water", label: "Water", emoji: "💧", ...iconPaths("water.svg", "1F4A7") },
    { id: "bed", label: "Bed", emoji: "🛏️", ...iconPaths("bed.svg", "1F6CF") },
    { id: "ball", label: "Ball", emoji: "⚽", ...iconPaths("ball.svg", "26BD") },
    { id: "hug", label: "Hug", emoji: "🤗", ...iconPaths("hug.svg", "1F917") },
    { id: "soap", label: "Soap", emoji: "🧼", ...iconPaths("soap.svg", "1F9FC") },
    { id: "brush", label: "Brush", emoji: "🪥", ...iconPaths("brush.svg", "1FAA5") },
    { id: "toy", label: "Toy", emoji: "🧸", ...iconPaths("toy.svg", "1F9F8") },
    { id: "sun", label: "Sun", emoji: "☀️", ...iconPaths("sun.svg", "2600") },
    { id: "moon", label: "Moon", emoji: "🌙", ...iconPaths("moon.svg", "1F319") },
    { id: "hat", label: "Hat", emoji: "🎩", ...iconPaths("hat.svg", "1F3A9") },
    { id: "shoes", label: "Shoes", emoji: "👟", ...iconPaths("shoes.svg", "1F45F") },
    { id: "chair", label: "Chair", emoji: "🪑", ...iconPaths("chair.svg", "1FA91") },
    { id: "tv", label: "TV", emoji: "📺", ...iconPaths("tv.svg", "1F4FA") },
    { id: "carousel", label: "Merry-go-round", emoji: "🎠", ...iconPaths("carousel.svg", "1F3A0") },
    { id: "slide", label: "Slide", emoji: "🛝", ...iconPaths("slide.svg", "1F6DD") },
    { id: "swing", label: "Swing", emoji: "🏞️", ...iconPaths("park.svg", "1F3DE") },
    { id: "tree", label: "Tree", emoji: "🌳", ...iconPaths("tree.svg", "1F333") },
    { id: "book", label: "Book", emoji: "📖", ...iconPaths("book.svg", "1F4D6") },
    { id: "car", label: "Car", emoji: "🚗", ...iconPaths("car.svg", "1F697") },
    { id: "park", label: "Park", emoji: "🏞️", ...iconPaths("park.svg", "1F3DE") },
    { id: "ice-cream", label: "Ice cream", emoji: "🍦", ...iconPaths("ice-cream.svg", "1F366") },
    { id: "bread", label: "Bread", emoji: "🍞", ...iconPaths("bread.svg", "1F35E") },
    { id: "phone", label: "Phone", emoji: "📱", ...iconPaths("phone.svg", "1F4F1") },
    { id: "lamp", label: "Lamp", emoji: "💡", ...iconPaths("lamp.svg", "1F4A1") },
    { id: "door", label: "Door", emoji: "🚪", ...iconPaths("door.svg", "1F6AA") },
    { id: "window", label: "Window", emoji: "🪟", ...iconPaths("window.svg", "1FA9F") },
  ];

  const MOTION_BY_ANSWER = {
    banana: "act-eat",
    apple: "act-eat",
    carrot: "act-eat",
    cookie: "act-eat",
    fish: "act-eat",
    bone: "act-eat",
    bread: "act-eat",
    "ice-cream": "act-eat",
    milk: "act-drink",
    water: "act-drink",
    bed: "act-sleep",
    moon: "act-sleep",
    ball: "act-play",
    toy: "act-play",
    carousel: "act-spin",
    slide: "act-hop",
    swing: "act-play",
    park: "act-play",
    hug: "act-hug",
    soap: "act-wash",
    brush: "act-wash",
    hat: "act-spin",
    shoes: "act-hop",
    sun: "act-spin",
    chair: "act-sleep",
    tv: "act-spin",
    book: "act-hug",
    car: "act-hop",
    tree: "act-wiggle",
    phone: "act-spin",
    lamp: "act-spin",
    door: "act-hop",
    window: "act-spin",
  };

  const MOTION_BY_FEELING = {
    hungry: "act-eat",
    thirsty: "act-drink",
    sleepy: "act-sleep",
    sad: "act-hug",
    happy: "act-play",
    angry: "act-wiggle",
    scared: "act-hug",
    love: "act-hug",
    surprised: "act-hop",
  };

  /**
   * Round templates. {name} is replaced with the animal name.
   * correctPool / wrongPool use item ids.
   * feeling drives the face expression.
   * animals: optional list — if set, only for those animals.
   */
  const ROUND_TEMPLATES = [
    // Feelings + care
    {
      id: "hungry",
      feeling: "hungry",
      prompt: "{name} is hungry. Give food!",
      praise: "Yum yum! {name} loves that!",
      correctPool: ["banana", "apple", "carrot", "cookie"],
      wrongPool: ["ball", "bed", "hug", "soap"],
    },
    {
      id: "hungry-fruit",
      feeling: "hungry",
      prompt: "{name} wants fruit. What fruit?",
      praise: "Yes! Fruit for {name}!",
      correctPool: ["banana", "apple"],
      wrongPool: ["bone", "ball", "soap"],
    },
    {
      id: "thirsty",
      feeling: "thirsty",
      prompt: "{name} is thirsty. Give a drink!",
      praise: "Sip sip! So good!",
      correctPool: ["milk", "water"],
      wrongPool: ["cookie", "ball", "bed", "bone"],
    },
    {
      id: "thirsty-milk",
      feeling: "thirsty",
      prompt: "{name} wants milk. Find milk!",
      praise: "Milk! Yummy!",
      correctPool: ["milk"],
      wrongPool: ["water", "cookie", "ball"],
    },
    {
      id: "sleepy",
      feeling: "sleepy",
      prompt: "{name} is sleepy. Time for bed!",
      praise: "Night night, {name}!",
      correctPool: ["bed"],
      wrongPool: ["banana", "ball", "cookie", "sun"],
    },
    {
      id: "sleepy-moon",
      feeling: "sleepy",
      prompt: "It is night. What do you see?",
      praise: "The moon! Sleep tight!",
      correctPool: ["moon"],
      wrongPool: ["sun", "ball", "cookie"],
    },
    {
      id: "sad",
      feeling: "sad",
      prompt: "{name} is sad. Give a hug!",
      praise: "Aww, big hug! {name} feels better!",
      correctPool: ["hug"],
      wrongPool: ["apple", "ball", "carrot", "soap"],
    },
    {
      id: "happy-play",
      feeling: "happy",
      prompt: "{name} is happy! Let's play!",
      praise: "Yay! {name} loves to play!",
      correctPool: ["ball", "toy"],
      wrongPool: ["bed", "milk", "soap"],
    },
    {
      id: "happy-ball",
      feeling: "happy",
      prompt: "Throw the ball to {name}!",
      praise: "Catch! Good throw!",
      correctPool: ["ball"],
      wrongPool: ["bed", "hat", "soap"],
    },
    // Food focus
    {
      id: "food-apple",
      feeling: "hungry",
      prompt: "Find the apple!",
      praise: "Apple! Crunch crunch!",
      correctPool: ["apple"],
      wrongPool: ["banana", "cookie", "carrot"],
    },
    {
      id: "food-banana",
      feeling: "hungry",
      prompt: "Find the banana!",
      praise: "Banana! Yellow and yummy!",
      correctPool: ["banana"],
      wrongPool: ["apple", "carrot", "cookie"],
    },
    {
      id: "food-carrot",
      feeling: "hungry",
      prompt: "Find the carrot!",
      praise: "Carrot! Crunchy!",
      correctPool: ["carrot"],
      wrongPool: ["cookie", "bone", "ball"],
    },
    {
      id: "food-cookie",
      feeling: "hungry",
      prompt: "{name} wants a cookie!",
      praise: "Cookie! Sweet treat!",
      correctPool: ["cookie"],
      wrongPool: ["soap", "ball", "shoes"],
    },
    {
      id: "food-water",
      feeling: "thirsty",
      prompt: "Find water for {name}!",
      praise: "Water! Fresh and cool!",
      correctPool: ["water"],
      wrongPool: ["milk", "cookie", "hat"],
    },
    // Animal-specific food
    {
      id: "cat-fish",
      feeling: "hungry",
      prompt: "Cat likes fish. Give fish!",
      praise: "Fish for Cat! Meow!",
      correctPool: ["fish"],
      wrongPool: ["bone", "ball", "cookie"],
      animals: ["cat"],
    },
    {
      id: "dog-bone",
      feeling: "hungry",
      prompt: "Dog likes a bone. Give bone!",
      praise: "Bone for Dog! Woof!",
      correctPool: ["bone"],
      wrongPool: ["fish", "hat", "soap"],
      animals: ["dog"],
    },
    {
      id: "bunny-carrot",
      feeling: "hungry",
      prompt: "Bunny loves carrot. Find carrot!",
      praise: "Carrot for Bunny! Hop hop!",
      correctPool: ["carrot"],
      wrongPool: ["bone", "fish", "shoes"],
      animals: ["bunny"],
    },
    // Care / clean
    {
      id: "dirty",
      feeling: "sad",
      prompt: "{name} is dirty. Time to wash!",
      praise: "All clean! Nice and fresh!",
      correctPool: ["soap"],
      wrongPool: ["cookie", "ball", "bone"],
    },
    {
      id: "brush",
      feeling: "happy",
      prompt: "Brush {name}'s teeth!",
      praise: "Sparkly clean teeth!",
      correctPool: ["brush"],
      wrongPool: ["ball", "cookie", "hat"],
    },
    // Day / night / clothes
    {
      id: "day-sun",
      feeling: "happy",
      prompt: "It is day. What is in the sky?",
      praise: "The sun! Bright and warm!",
      correctPool: ["sun"],
      wrongPool: ["moon", "bed", "bone"],
    },
    {
      id: "cold-hat",
      feeling: "sad",
      prompt: "{name} is cold. Put on a hat!",
      praise: "Warm hat! Cozy!",
      correctPool: ["hat"],
      wrongPool: ["banana", "ball", "soap"],
    },
    {
      id: "walk-shoes",
      feeling: "happy",
      prompt: "Let's go for a walk! What do we wear?",
      praise: "Shoes on! Let's go!",
      correctPool: ["shoes"],
      wrongPool: ["bed", "cookie", "moon"],
    },
    {
      id: "toy-friend",
      feeling: "happy",
      prompt: "{name} wants a soft toy!",
      praise: "A cuddly toy! So soft!",
      correctPool: ["toy"],
      wrongPool: ["soap", "brush", "shoes"],
    },
    // Feeling name practice
    {
      id: "feel-hungry-word",
      feeling: "hungry",
      prompt: "{name} wants to eat. Is {name} hungry or sleepy?",
      praise: "Yes! Hungry!",
      correctPool: ["banana"],
      wrongPool: ["bed"],
      choiceOverride: [
        { id: "banana", label: "Hungry", emoji: "😋" },
        { id: "bed", label: "Sleepy", emoji: "😴" },
      ],
      choiceOverrideL2: [
        { id: "banana", label: "Hungry", emoji: "😋" },
        { id: "bed", label: "Sleepy", emoji: "😴" },
        { id: "water", label: "Thirsty", emoji: "💧" },
      ],
    },
    {
      id: "feel-happy-word",
      feeling: "happy",
      prompt: "{name} is smiling. Is {name} happy or sad?",
      praise: "Yes! Happy!",
      correctPool: ["hug"],
      wrongPool: ["soap"],
      choiceOverride: [
        { id: "hug", label: "Happy", emoji: "😊" },
        { id: "soap", label: "Sad", emoji: "😢" },
      ],
      choiceOverrideL2: [
        { id: "hug", label: "Happy", emoji: "😊" },
        { id: "soap", label: "Sad", emoji: "😢" },
        { id: "bed", label: "Sleepy", emoji: "😴" },
      ],
    },
    {
      id: "feel-sleepy-word",
      feeling: "sleepy",
      prompt: "{name} is yawning. Is {name} sleepy or thirsty?",
      praise: "Yes! Sleepy!",
      correctPool: ["bed"],
      wrongPool: ["water"],
      choiceOverride: [
        { id: "bed", label: "Sleepy", emoji: "😴" },
        { id: "water", label: "Thirsty", emoji: "💧" },
      ],
      choiceOverrideL2: [
        { id: "bed", label: "Sleepy", emoji: "😴" },
        { id: "water", label: "Thirsty", emoji: "💧" },
        { id: "hug", label: "Happy", emoji: "😊" },
      ],
    },
    {
      id: "hungry-cookie-or-fruit",
      feeling: "hungry",
      prompt: "{name} wants a sweet snack. Find the cookie!",
      praise: "Cookie time! Delicious!",
      correctPool: ["cookie"],
      wrongPool: ["carrot", "soap", "shoes", "bed"],
    },
    {
      id: "thirsty-water-only",
      feeling: "thirsty",
      prompt: "{name} needs cool water!",
      praise: "Ahh, cool water!",
      correctPool: ["water"],
      wrongPool: ["milk", "banana", "ball", "hat"],
    },
    {
      id: "play-toy",
      feeling: "happy",
      prompt: "Find a soft toy for {name}!",
      praise: "Cuddle toy! So nice!",
      correctPool: ["toy"],
      wrongPool: ["bone", "soap", "sun", "brush"],
    },
    {
      id: "night-bed",
      feeling: "sleepy",
      prompt: "Good night! Where does {name} sleep?",
      praise: "In bed! Sweet dreams!",
      correctPool: ["bed"],
      wrongPool: ["shoes", "ball", "sun", "fish"],
    },
    {
      id: "morning-sun",
      feeling: "happy",
      prompt: "Good morning! What shines in the sky?",
      praise: "The sun! Hello day!",
      correctPool: ["sun"],
      wrongPool: ["moon", "bed", "cookie", "bone"],
    },
    {
      id: "sad-hug-soft",
      feeling: "sad",
      prompt: "{name} needs love. Give a hug!",
      praise: "Warm hug! Feeling better!",
      correctPool: ["hug"],
      wrongPool: ["soap", "hat", "banana", "shoes"],
    },
    {
      id: "wash-soap",
      feeling: "happy",
      prompt: "Wash hands with soap!",
      praise: "Clean hands! Great job!",
      correctPool: ["soap"],
      wrongPool: ["cookie", "milk", "toy", "moon"],
    },
    {
      id: "teeth-brush",
      feeling: "happy",
      prompt: "Time to brush teeth!",
      praise: "Brush brush! Clean teeth!",
      correctPool: ["brush"],
      wrongPool: ["banana", "ball", "hat", "bed"],
    },
    {
      id: "cold-day-hat",
      feeling: "sad",
      prompt: "Brr! It is cold. Find a hat!",
      praise: "Hat on! Warm and cozy!",
      correctPool: ["hat"],
      wrongPool: ["water", "moon", "fish", "cookie"],
    },
    {
      id: "walk-shoes-2",
      feeling: "happy",
      prompt: "Put on shoes to go outside!",
      praise: "Shoes on! Ready to go!",
      correctPool: ["shoes"],
      wrongPool: ["bed", "hat", "soap", "bone"],
    },
    {
      id: "find-ball",
      feeling: "happy",
      prompt: "Find the ball!",
      praise: "Ball! Bounce bounce!",
      correctPool: ["ball"],
      wrongPool: ["apple", "bed", "moon", "brush"],
    },
    {
      id: "find-milk",
      feeling: "thirsty",
      prompt: "Find the milk!",
      praise: "Milk! White and yummy!",
      correctPool: ["milk"],
      wrongPool: ["water", "soap", "carrot", "shoes"],
    },
    {
      id: "find-banana-2",
      feeling: "hungry",
      prompt: "Yellow fruit! Find the banana!",
      praise: "Banana! Peel and eat!",
      correctPool: ["banana"],
      wrongPool: ["apple", "bone", "hat", "ball"],
    },
    {
      id: "find-apple-2",
      feeling: "hungry",
      prompt: "Red fruit! Find the apple!",
      praise: "Apple! Crunchy and sweet!",
      correctPool: ["apple"],
      wrongPool: ["banana", "cookie", "soap", "moon"],
    },
    {
      id: "feel-sad-word",
      feeling: "sad",
      prompt: "{name} is crying. Is {name} sad or happy?",
      praise: "Yes! Sad. Let's hug!",
      correctPool: ["soap"],
      wrongPool: ["hug"],
      choiceOverride: [
        { id: "soap", label: "Sad", emoji: "😢" },
        { id: "hug", label: "Happy", emoji: "😊" },
      ],
      choiceOverrideL2: [
        { id: "soap", label: "Sad", emoji: "😢" },
        { id: "hug", label: "Happy", emoji: "😊" },
        { id: "bed", label: "Sleepy", emoji: "😴" },
      ],
    },
    {
      id: "feel-thirsty-word",
      feeling: "thirsty",
      prompt: "{name} wants a drink. Is {name} thirsty or hungry?",
      praise: "Yes! Thirsty!",
      correctPool: ["water"],
      wrongPool: ["banana"],
      choiceOverride: [
        { id: "water", label: "Thirsty", emoji: "💧" },
        { id: "banana", label: "Hungry", emoji: "😋" },
      ],
      choiceOverrideL2: [
        { id: "water", label: "Thirsty", emoji: "💧" },
        { id: "banana", label: "Hungry", emoji: "😋" },
        { id: "bed", label: "Sleepy", emoji: "😴" },
      ],
    },
    {
      id: "cat-fish-2",
      feeling: "hungry",
      prompt: "Meow! What does Cat like to eat?",
      praise: "Fish! Yummy for Cat!",
      correctPool: ["fish"],
      wrongPool: ["bone", "carrot", "cookie", "hat"],
      animals: ["cat"],
    },
    {
      id: "dog-bone-2",
      feeling: "hungry",
      prompt: "Woof! What does Dog like?",
      praise: "A bone! Good dog!",
      correctPool: ["bone"],
      wrongPool: ["fish", "apple", "soap", "moon"],
      animals: ["dog"],
    },
    {
      id: "bunny-carrot-2",
      feeling: "hungry",
      prompt: "Hop hop! What does Bunny love?",
      praise: "Carrot! Crunch crunch!",
      correctPool: ["carrot"],
      wrongPool: ["bone", "fish", "hat", "shoes"],
      animals: ["bunny"],
    },
    {
      id: "play-or-sleep",
      feeling: "happy",
      prompt: "{name} wants to play. Find the ball!",
      praise: "Ball! Let's play!",
      correctPool: ["ball"],
      wrongPool: ["bed", "soap", "moon"],
    },
    {
      id: "drink-or-food",
      feeling: "thirsty",
      prompt: "{name} is thirsty. Find a drink!",
      praise: "A drink! Smart choice!",
      correctPool: ["milk", "water"],
      wrongPool: ["cookie", "ball", "hat", "shoes"],
    },
    // —— animal-specific new friends ——
    {
      id: "pig-mud-fun",
      feeling: "happy",
      prompt: "Piggy loves to play! Find the ball!",
      praise: "Oink oink! Fun play!",
      correctPool: ["ball"],
      wrongPool: ["bed", "soap", "moon", "chair"],
      animals: ["pig"],
    },
    {
      id: "pig-hungry",
      feeling: "hungry",
      prompt: "Piggy is hungry. Find food!",
      praise: "Yum! Piggy is happy!",
      correctPool: ["apple", "cookie", "bread", "carrot"],
      wrongPool: ["hat", "tv", "car", "soap"],
      animals: ["pig"],
    },
    {
      id: "shark-fish",
      feeling: "hungry",
      prompt: "Baby Shark is hungry. Find fish!",
      praise: "Fish! Chomp chomp!",
      correctPool: ["fish"],
      wrongPool: ["bone", "cookie", "hat", "chair"],
      animals: ["shark"],
    },
    {
      id: "shark-water",
      feeling: "happy",
      prompt: "Baby Shark loves water! Find water!",
      praise: "Splash! Doo doo doo!",
      correctPool: ["water"],
      wrongPool: ["milk", "bed", "shoes", "tv"],
      animals: ["shark"],
    },
    {
      id: "bear-honey-food",
      feeling: "hungry",
      prompt: "Bear is hungry. Find a yummy snack!",
      praise: "Nom nom! Bear loves it!",
      correctPool: ["cookie", "apple", "bread", "fish"],
      wrongPool: ["soap", "car", "phone", "door"],
      animals: ["bear"],
    },
    {
      id: "bear-sleep",
      feeling: "sleepy",
      prompt: "Bear is sleepy. Time for bed!",
      praise: "Night night, Bear!",
      correctPool: ["bed"],
      wrongPool: ["car", "slide", "ball", "tv"],
      animals: ["bear"],
    },
    // —— home / furniture (all levels) ——
    {
      id: "home-chair",
      feeling: "happy",
      prompt: "Where do we sit? Find the chair!",
      praise: "Chair! Sit sit!",
      correctPool: ["chair"],
      wrongPool: ["bed", "ball", "door", "tree"],
    },
    {
      id: "home-tv",
      feeling: "happy",
      prompt: "What shows pictures? Find the TV!",
      praise: "TV! Watch watch!",
      correctPool: ["tv"],
      wrongPool: ["book", "window", "ball", "soap"],
    },
    {
      id: "home-door",
      feeling: "happy",
      prompt: "How do we go in? Find the door!",
      praise: "Door! Open close!",
      correctPool: ["door"],
      wrongPool: ["window", "chair", "hat", "moon"],
    },
    {
      id: "home-window",
      feeling: "happy",
      prompt: "Look outside! Find the window!",
      praise: "Window! Peek-a-boo!",
      correctPool: ["window"],
      wrongPool: ["door", "tv", "bed", "cookie"],
    },
    {
      id: "home-lamp",
      feeling: "happy",
      prompt: "It is dark. What gives light?",
      praise: "Lamp! Bright light!",
      correctPool: ["lamp"],
      wrongPool: ["moon", "bed", "soap", "car"],
    },
    {
      id: "home-phone",
      feeling: "happy",
      prompt: "Ring ring! Find the phone!",
      praise: "Phone! Hello!",
      correctPool: ["phone"],
      wrongPool: ["book", "ball", "apple", "door"],
    },
    {
      id: "home-book",
      feeling: "happy",
      prompt: "Story time! Find the book!",
      praise: "Book! Read read!",
      correctPool: ["book"],
      wrongPool: ["tv", "cookie", "shoes", "car"],
    },
    // —— playground ——
    {
      id: "play-carousel",
      feeling: "happy",
      prompt: "Spin around! Find the merry-go-round!",
      praise: "Merry-go-round! Wheee!",
      correctPool: ["carousel"],
      wrongPool: ["bed", "chair", "soap", "moon"],
    },
    {
      id: "play-slide",
      feeling: "happy",
      prompt: "Whoosh down! Find the slide!",
      praise: "Slide! So fun!",
      correctPool: ["slide"],
      wrongPool: ["chair", "tv", "bed", "brush"],
    },
    {
      id: "play-swing",
      feeling: "happy",
      prompt: "Swing high! Find the park swing!",
      praise: "Swing swing! Higher!",
      correctPool: ["park", "swing"],
      wrongPool: ["door", "milk", "hat", "bone"],
    },
    {
      id: "play-park",
      feeling: "happy",
      prompt: "Let's go outside! Find the park!",
      praise: "Park! Play time!",
      correctPool: ["park"],
      wrongPool: ["bed", "tv", "chair", "soap"],
    },
    {
      id: "play-tree",
      feeling: "happy",
      prompt: "Green and tall! Find the tree!",
      praise: "Tree! Leaves and shade!",
      correctPool: ["tree"],
      wrongPool: ["car", "lamp", "cookie", "phone"],
    },
    {
      id: "play-car",
      feeling: "happy",
      prompt: "Beep beep! Find the car!",
      praise: "Car! Vroom vroom!",
      correctPool: ["car"],
      wrongPool: ["bed", "tree", "milk", "book"],
    },
    // —— more food ——
    {
      id: "food-icecream",
      feeling: "happy",
      prompt: "{name} wants a cold treat! Find ice cream!",
      praise: "Ice cream! Yummy cold!",
      correctPool: ["ice-cream"],
      wrongPool: ["bread", "soap", "hat", "car", "milk"],
    },
    {
      id: "food-bread",
      feeling: "hungry",
      prompt: "Find the bread!",
      praise: "Bread! Soft and yummy!",
      correctPool: ["bread"],
      wrongPool: ["ball", "phone", "door", "moon"],
    },
    // —— more emotions ——
    {
      id: "feel-angry",
      feeling: "angry",
      prompt: "{name} is angry. Give a hug to help!",
      praise: "Hug helps! Feeling calmer!",
      correctPool: ["hug"],
      wrongPool: ["soap", "car", "tv", "bone"],
    },
    {
      id: "feel-scared",
      feeling: "scared",
      prompt: "{name} is scared. What helps? A hug!",
      praise: "Safe hug! Brave buddy!",
      correctPool: ["hug"],
      wrongPool: ["ball", "cookie", "slide", "phone"],
    },
    {
      id: "feel-love",
      feeling: "love",
      prompt: "{name} feels love! Give a big hug!",
      praise: "So much love!",
      correctPool: ["hug"],
      wrongPool: ["soap", "car", "door", "brush"],
    },
    {
      id: "feel-surprised",
      feeling: "surprised",
      prompt: "Wow! {name} is surprised! Find a toy!",
      praise: "Surprise toy! Fun!",
      correctPool: ["toy", "ball"],
      wrongPool: ["soap", "bed", "door", "brush"],
    },
    {
      id: "feel-angry-word",
      feeling: "angry",
      prompt: "{name} is mad. Is {name} angry or happy?",
      praise: "Yes! Angry. Let's calm down!",
      correctPool: ["soap"],
      wrongPool: ["hug"],
      choiceOverride: [
        { id: "soap", label: "Angry", emoji: "😠" },
        { id: "hug", label: "Happy", emoji: "😊" },
      ],
      choiceOverrideL2: [
        { id: "soap", label: "Angry", emoji: "😠" },
        { id: "hug", label: "Happy", emoji: "😊" },
        { id: "bed", label: "Sleepy", emoji: "😴" },
      ],
      choiceOverrideL3: [
        { id: "soap", label: "Angry", emoji: "😠" },
        { id: "hug", label: "Happy", emoji: "😊" },
        { id: "bed", label: "Sleepy", emoji: "😴" },
        { id: "water", label: "Scared", emoji: "😨" },
      ],
    },
    {
      id: "feel-scared-word",
      feeling: "scared",
      prompt: "{name} is shaking. Is {name} scared or sleepy?",
      praise: "Yes! Scared. Hug time!",
      correctPool: ["water"],
      wrongPool: ["bed"],
      choiceOverride: [
        { id: "water", label: "Scared", emoji: "😨" },
        { id: "bed", label: "Sleepy", emoji: "😴" },
      ],
      choiceOverrideL2: [
        { id: "water", label: "Scared", emoji: "😨" },
        { id: "bed", label: "Sleepy", emoji: "😴" },
        { id: "hug", label: "Happy", emoji: "😊" },
      ],
      choiceOverrideL3: [
        { id: "water", label: "Scared", emoji: "😨" },
        { id: "bed", label: "Sleepy", emoji: "😴" },
        { id: "hug", label: "Happy", emoji: "😊" },
        { id: "soap", label: "Angry", emoji: "😠" },
      ],
    },
    // —— Advanced only (minLevel: 3) ——
    {
      id: "adv-sit-chair",
      feeling: "happy",
      prompt: "{name} wants to sit down. What do we need?",
      praise: "A chair! Perfect!",
      correctPool: ["chair"],
      wrongPool: ["bed", "slide", "car", "tree", "tv"],
      minLevel: 3,
    },
    {
      id: "adv-watch-tv",
      feeling: "happy",
      prompt: "Cartoon time! What do we watch on?",
      praise: "The TV! Great!",
      correctPool: ["tv"],
      wrongPool: ["book", "window", "phone", "lamp", "door"],
      minLevel: 3,
    },
    {
      id: "adv-merry",
      feeling: "happy",
      prompt: "At the playground, what goes round and round?",
      praise: "Merry-go-round! Spin!",
      correctPool: ["carousel"],
      wrongPool: ["slide", "tree", "chair", "car", "bed"],
      minLevel: 3,
    },
    {
      id: "adv-slide-down",
      feeling: "happy",
      prompt: "At the playground, what do we slide down?",
      praise: "The slide! Whoosh!",
      correctPool: ["slide"],
      wrongPool: ["carousel", "chair", "door", "book", "tv"],
      minLevel: 3,
    },
    {
      id: "adv-read-book",
      feeling: "happy",
      prompt: "Quiet time. What do we read?",
      praise: "A book! Smart buddy!",
      correctPool: ["book"],
      wrongPool: ["tv", "phone", "cookie", "ball", "car"],
      minLevel: 3,
    },
    {
      id: "adv-open-door",
      feeling: "happy",
      prompt: "We leave the room. What do we open?",
      praise: "The door! Bye-bye room!",
      correctPool: ["door"],
      wrongPool: ["window", "chair", "lamp", "hat", "tree"],
      minLevel: 3,
    },
    {
      id: "adv-look-window",
      feeling: "surprised",
      prompt: "Bird outside! Where do we look?",
      praise: "The window! Hello bird!",
      correctPool: ["window"],
      wrongPool: ["door", "tv", "book", "bed", "phone"],
      minLevel: 3,
    },
    {
      id: "adv-light-lamp",
      feeling: "happy",
      prompt: "Night is dark. What turns on light inside?",
      praise: "The lamp! Cozy light!",
      correctPool: ["lamp"],
      wrongPool: ["sun", "moon", "tv", "car", "soap"],
      minLevel: 3,
    },
    {
      id: "adv-call-phone",
      feeling: "happy",
      prompt: "Call Grandma! What do we use?",
      praise: "The phone! Ring ring!",
      correctPool: ["phone"],
      wrongPool: ["tv", "book", "ball", "hat", "door"],
      minLevel: 3,
    },
    {
      id: "adv-park-tree",
      feeling: "happy",
      prompt: "In the park, what has green leaves?",
      praise: "A tree! Nature!",
      correctPool: ["tree"],
      wrongPool: ["car", "slide", "chair", "lamp", "cookie"],
      minLevel: 3,
    },
    {
      id: "adv-drive-car",
      feeling: "happy",
      prompt: "Go to the park! What do we drive?",
      praise: "A car! Vroom!",
      correctPool: ["car"],
      wrongPool: ["bed", "chair", "slide", "book", "fish"],
      minLevel: 3,
    },
    {
      id: "adv-emotion-love",
      feeling: "love",
      prompt: "{name} loves you. Find the hug!",
      praise: "Love hug! Heart full!",
      correctPool: ["hug"],
      wrongPool: ["soap", "ball", "car", "door", "tv"],
      minLevel: 3,
    },
    {
      id: "adv-ice-vs-bread",
      feeling: "hungry",
      prompt: "Cold and sweet dessert. Find ice cream!",
      praise: "Ice cream! Not bread!",
      correctPool: ["ice-cream"],
      wrongPool: ["bread", "milk", "apple", "cookie", "water"],
      minLevel: 3,
    },
    {
      id: "adv-sit-not-bed",
      feeling: "happy",
      prompt: "Sit at the table. Chair or bed?",
      praise: "Chair! Beds are for sleep!",
      correctPool: ["chair"],
      wrongPool: ["bed", "slide", "car", "moon"],
      minLevel: 3,
    },
    {
      id: "adv-playground-set",
      feeling: "happy",
      prompt: "Playground fun! Find the merry-go-round!",
      praise: "Yes! Round and round!",
      correctPool: ["carousel"],
      wrongPool: ["tv", "door", "phone", "lamp", "soap"],
      minLevel: 3,
    },
  ];

  const el = {
    title: document.getElementById("screen-title"),
    pick: document.getElementById("screen-pick"),
    level: document.getElementById("screen-level"),
    play: document.getElementById("screen-play"),
    celebrate: document.getElementById("screen-celebrate"),
    stickers: document.getElementById("screen-stickers"),
    musicLib: document.getElementById("screen-music"),
    btnModePlay: document.getElementById("btn-mode-play"),
    btnModePractice: document.getElementById("btn-mode-practice"),
    btnStickers: document.getElementById("btn-stickers"),
    btnMusicLib: document.getElementById("btn-music-lib"),
    btnCelebrateStickers: document.getElementById("btn-celebrate-stickers"),
    btnCelebrateMusic: document.getElementById("btn-celebrate-music"),
    btnStickersBack: document.getElementById("btn-stickers-back"),
    btnMusicBack: document.getElementById("btn-music-back"),
    btnResetMusic: document.getElementById("btn-reset-music"),
    btnAgain: document.getElementById("btn-again"),
    btnSwitch: document.getElementById("btn-switch"),
    btnBye: document.getElementById("btn-bye"),
    btnHome: document.getElementById("btn-home"),
    btnPickBack: document.getElementById("btn-pick-back"),
    btnLevelBack: document.getElementById("btn-level-back"),
    btnPracAnimal: document.getElementById("btn-prac-animal"),
    btnPracLevel: document.getElementById("btn-prac-level"),
    btnSay: document.getElementById("btn-say"),
    btnMusic: document.getElementById("btn-music"),
    btnMusicPlay: document.getElementById("btn-music-play"),
    animalGrid: document.getElementById("animal-grid"),
    levelGrid: document.getElementById("level-grid"),
    levelChip: document.getElementById("level-chip"),
    modeChip: document.getElementById("mode-chip"),
    resultBarWrap: document.getElementById("result-bar-wrap"),
    resultBar: document.getElementById("result-bar"),
    resultCount: document.getElementById("result-count"),
    practiceHud: document.getElementById("practice-hud"),
    practiceTools: document.getElementById("practice-tools"),
    practiceCount: document.getElementById("practice-count"),
    practiceOk: document.getElementById("practice-ok"),
    scoreSummary: document.getElementById("score-summary"),
    resultBarFinal: document.getElementById("result-bar-final"),
    scoreLine: document.getElementById("score-line"),
    celebrateTitle: document.getElementById("celebrate-title"),
    stickerUnlockBanner: document.getElementById("sticker-unlock-banner"),
    stickerUnlockLabel: document.getElementById("sticker-unlock-label"),
    stickerUnlockPreview: document.getElementById("sticker-unlock-preview"),
    stickerUnlockName: document.getElementById("sticker-unlock-name"),
    stickerGrid: document.getElementById("sticker-grid"),
    stickerPageLabel: document.getElementById("sticker-page-label"),
    stickerProgressTitle: document.getElementById("sticker-progress-title"),
    stickerProgressChip: document.getElementById("sticker-progress-chip"),
    musicProgressTitle: document.getElementById("music-progress-title"),
    musicProgressChip: document.getElementById("music-progress-chip"),
    musicListFree: document.getElementById("music-list-free"),
    musicListUnlock: document.getElementById("music-list-unlock"),
    musicHint: document.getElementById("music-hint"),
    stickerHint: document.getElementById("sticker-hint"),
    btnResetStickers: document.getElementById("btn-reset-stickers"),
    stickerViewer: document.getElementById("sticker-viewer"),
    stickerViewerImg: document.getElementById("sticker-viewer-img"),
    stickerViewerName: document.getElementById("sticker-viewer-name"),
    btnStickerViewerBack: document.getElementById("btn-sticker-viewer-back"),
    buddy: document.getElementById("buddy"),
    buddyImg: document.getElementById("buddy-img"),
    buddyWrap: document.getElementById("buddy-wrap"),
    celebrateBuddy: document.getElementById("celebrate-buddy"),
    feelingChip: document.getElementById("feeling-chip"),
    feelingBadge: document.getElementById("feeling-badge"),
    zzzFloat: document.getElementById("zzz-float"),
    promptText: document.getElementById("prompt-text"),
    choices: document.getElementById("choices"),
    sparkles: document.getElementById("sparkles"),
    confetti: document.getElementById("confetti"),
    celebrateMsg: document.getElementById("celebrate-msg"),
    bgMusic: document.getElementById("bg-music"),
    musicLabel: document.getElementById("music-label"),
  };

  const state = {
    mode: "play", // "play" | "practice"
    questionIndex: 0,
    /** @type {("pending"|"right"|"wrong")[]} */
    results: [],
    questionMissed: false,
    practiceTotal: 0,
    practiceCorrectFirst: 0,
    misses: 0,
    locked: false,
    musicOn: false,
    animalId: "bunny",
    level: 1,
    lastRoundId: null,
    recentRoundIds: [],
    lastTrackId: null,
    stickerPage: 1,
    /** @type {string[]} unlocked sticker ids */
    unlockedStickers: [],
    /** @type {string[]} unlocked music ids (unlock tracks only) */
    unlockedMusic: [],
    /** @type {null | object} */
    lastUnlockedSticker: null,
    /** @type {null | { type: string, item: object }} */
    lastReward: null,
    motionTimer: null,
    practiceSwap: false,
    /** @type {null | { id: string, feeling: string, prompt: string, praise: string, correctId: string, options: { id: string, label: string, emoji: string, icon?: string, cdn?: string }[] }} */
    round: null,
    audioCtx: null,
  };

  function animal() {
    return ANIMALS[state.animalId] || ANIMALS.bunny;
  }

  function fillName(text) {
    return text.replace(/\{name\}/g, animal().name);
  }

  function itemById(id) {
    return ITEMS.find((i) => i.id === id);
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function showScreen(name) {
    const map = {
      title: el.title,
      pick: el.pick,
      level: el.level,
      play: el.play,
      celebrate: el.celebrate,
      stickers: el.stickers,
      music: el.musicLib,
    };
    Object.entries(map).forEach(([key, node]) => {
      if (!node) return;
      const on = key === name;
      node.hidden = !on;
      node.classList.toggle("active", on);
    });
  }

  function allStickerDefs() {
    return STICKER_BOOKS.flatMap((b) => b.stickers);
  }

  function loadStickers() {
    try {
      const raw = localStorage.getItem(STICKER_STORAGE_KEY);
      if (!raw) {
        state.unlockedStickers = [];
        return;
      }
      const data = JSON.parse(raw);
      state.unlockedStickers = Array.isArray(data.unlocked) ? data.unlocked : [];
    } catch (_) {
      state.unlockedStickers = [];
    }
  }

  function saveStickers() {
    try {
      localStorage.setItem(
        STICKER_STORAGE_KEY,
        JSON.stringify({ unlocked: state.unlockedStickers })
      );
    } catch (_) {}
  }

  function loadMusicUnlocks() {
    try {
      const raw = localStorage.getItem(MUSIC_STORAGE_KEY);
      if (!raw) {
        state.unlockedMusic = [];
        return;
      }
      const data = JSON.parse(raw);
      state.unlockedMusic = Array.isArray(data.unlocked) ? data.unlocked : [];
    } catch (_) {
      state.unlockedMusic = [];
    }
  }

  function saveMusicUnlocks() {
    try {
      localStorage.setItem(
        MUSIC_STORAGE_KEY,
        JSON.stringify({ unlocked: state.unlockedMusic })
      );
    } catch (_) {}
  }

  function isStickerUnlocked(id) {
    return state.unlockedStickers.indexOf(id) !== -1;
  }

  function isMusicUnlocked(id) {
    const track = ALL_MUSIC.find((t) => t.id === id);
    if (track && track.free) return true;
    return state.unlockedMusic.indexOf(id) !== -1;
  }

  function stickerCount() {
    return {
      have: state.unlockedStickers.length,
      total: allStickerDefs().length,
    };
  }

  function musicCount() {
    return {
      have: state.unlockedMusic.length,
      total: UNLOCK_MUSIC.length,
    };
  }

  function updateStickerProgressUI() {
    const { have, total } = stickerCount();
    const text = `${have}/${total}`;
    if (el.stickerProgressTitle) el.stickerProgressTitle.textContent = text;
    if (el.stickerProgressChip) el.stickerProgressChip.textContent = text;
  }

  function updateMusicProgressUI() {
    const { have, total } = musicCount();
    const text = `${have}/${total}`;
    if (el.musicProgressTitle) el.musicProgressTitle.textContent = text;
    if (el.musicProgressChip) el.musicProgressChip.textContent = text;
  }

  function nextLockedSticker() {
    const locked = allStickerDefs().filter((s) => !isStickerUnlocked(s.id));
    if (!locked.length) return null;
    return locked[Math.floor(Math.random() * locked.length)];
  }

  function nextLockedMusic() {
    const locked = UNLOCK_MUSIC.filter((t) => !isMusicUnlocked(t.id));
    if (!locked.length) return null;
    return locked[Math.floor(Math.random() * locked.length)];
  }

  /**
   * Play mode reward: randomly sticker OR song (whichever still available).
   * @returns {{ type: "sticker"|"music", item: object } | null}
   */
  function tryUnlockRewardFromPlay(rights) {
    state.lastUnlockedSticker = null;
    state.lastReward = null;
    if (!isPlayMode()) return null;
    if (rights < STICKER_UNLOCK_MIN) return null;

    const sticker = nextLockedSticker();
    const music = nextLockedMusic();
    if (!sticker && !music) return null;

    let pickType = "sticker";
    if (sticker && music) pickType = Math.random() < 0.5 ? "sticker" : "music";
    else if (music) pickType = "music";
    else pickType = "sticker";

    if (pickType === "sticker" && sticker) {
      state.unlockedStickers.push(sticker.id);
      saveStickers();
      state.lastUnlockedSticker = sticker;
      state.lastReward = { type: "sticker", item: sticker };
      updateStickerProgressUI();
      return state.lastReward;
    }
    if (music) {
      state.unlockedMusic.push(music.id);
      saveMusicUnlocks();
      state.lastReward = { type: "music", item: music };
      updateMusicProgressUI();
      return state.lastReward;
    }
    return null;
  }

  function availableMusicTracks() {
    return ALL_MUSIC.filter((t) => isMusicUnlocked(t.id));
  }

  function renderMusicLibrary() {
    const freeHost = el.musicListFree;
    const unlockHost = el.musicListUnlock;
    if (!freeHost || !unlockHost) return;

    freeHost.innerHTML = "";
    unlockHost.innerHTML = "";

    BASE_MUSIC.forEach((t) => {
      freeHost.appendChild(renderMusicRow(t, true));
    });
    UNLOCK_MUSIC.forEach((t) => {
      unlockHost.appendChild(renderMusicRow(t, isMusicUnlocked(t.id)));
    });

    const { have, total } = musicCount();
    if (el.musicHint) {
      if (have >= total) {
        el.musicHint.textContent = "All songs unlocked! Tap one to play.";
      } else {
        el.musicHint.textContent = `Play mode · 8+ correct · random sticker or song (${have}/${total} songs)`;
      }
    }
    updateMusicProgressUI();
  }

  function renderMusicRow(track, unlocked) {
    const row = document.createElement(unlocked ? "button" : "div");
    if (unlocked) row.type = "button";
    row.className = "music-row" + (unlocked ? " unlocked" : " locked");
    row.dataset.id = track.id;

    const icon = document.createElement("span");
    icon.className = "music-row-icon";
    icon.textContent = unlocked ? "🎵" : "🔒";
    icon.setAttribute("aria-hidden", "true");

    const meta = document.createElement("span");
    meta.className = "music-row-meta";
    const title = document.createElement("span");
    title.className = "music-row-title";
    title.textContent = unlocked ? track.label : "???";
    const sub = document.createElement("span");
    sub.className = "music-row-sub";
    sub.textContent = unlocked
      ? track.free
        ? "Tap to play"
        : "Unlocked · tap to play"
      : "Locked";
    meta.appendChild(title);
    meta.appendChild(sub);

    row.appendChild(icon);
    row.appendChild(meta);

    if (unlocked) {
      if (state.lastTrackId === track.id && state.musicOn) {
        row.classList.add("playing");
      }
      row.addEventListener("click", () => playSelectedTrack(track));
    }
    return row;
  }

  function playSelectedTrack(track) {
    ensureAudio();
    loadTrack(track);
    state.musicOn = true;
    el.btnMusic.setAttribute("aria-pressed", "true");
    el.btnMusicPlay.setAttribute("aria-pressed", "true");
    startLoadedMusic(0.32);
    sfxPick();
    speak(track.label);
    renderMusicLibrary();
  }

  function openMusicLibrary() {
    window.speechSynthesis && window.speechSynthesis.cancel();
    closeStickerViewer();
    renderMusicLibrary();
    showScreen("music");
    const { have, total } = musicCount();
    speak(
      have >= total
        ? "Song book is full! Pick a song!"
        : `Song book! You unlocked ${have} special songs.`
    );
  }

  function resetMusicBook() {
    const { have } = musicCount();
    if (have === 0) {
      speak("No songs to reset!");
      return;
    }
    const ok = window.confirm("Reset unlock songs? Free soft music stays.");
    if (!ok) return;
    state.unlockedMusic = [];
    state.lastReward = null;
    saveMusicUnlocks();
    // If current track was unlock-only, fall back to free
    const cur = ALL_MUSIC.find((t) => t.id === state.lastTrackId);
    if (cur && !cur.free) {
      stopMusic();
      state.musicOn = false;
      el.btnMusic.setAttribute("aria-pressed", "false");
      el.btnMusicPlay.setAttribute("aria-pressed", "false");
      if (el.musicLabel) el.musicLabel.textContent = "";
    }
    updateMusicProgressUI();
    renderMusicLibrary();
    sfxWrong();
    speak("Unlock songs reset!");
  }

  function renderStickerCell(sticker, unlocked, opts) {
    const cell = document.createElement(unlocked ? "button" : "div");
    if (unlocked) cell.type = "button";
    cell.className = "sticker-cell" + (unlocked ? " unlocked" : " locked");
    cell.dataset.id = sticker.id;
    cell.setAttribute("aria-label", unlocked ? sticker.name : "Locked sticker");

    const inner = document.createElement("div");
    inner.className = "sticker-face";

    if (unlocked) {
      const img = document.createElement("img");
      img.className = "sticker-art";
      img.alt = sticker.name;
      img.draggable = false;
      img.src = sticker.src;
      img.onerror = () => {
        img.remove();
        const em = document.createElement("span");
        em.className = "sticker-emoji";
        em.textContent = sticker.emoji;
        em.setAttribute("aria-hidden", "true");
        inner.prepend(em);
      };
      inner.appendChild(img);
    } else {
      // Fully blocked — no preview art
      const lock = document.createElement("span");
      lock.className = "sticker-lock";
      lock.textContent = "🔒";
      lock.setAttribute("aria-hidden", "true");
      inner.appendChild(lock);
    }

    const name = document.createElement("span");
    name.className = "sticker-name";
    name.textContent = unlocked ? sticker.name : "???";

    cell.appendChild(inner);
    cell.appendChild(name);

    if (unlocked && !(opts && opts.noClick)) {
      cell.addEventListener("click", () => openStickerViewer(sticker));
    }

    if (opts && opts.highlight) cell.classList.add("just-unlocked");
    return cell;
  }

  function openStickerViewer(sticker) {
    if (!el.stickerViewer || !sticker) return;
    if (el.stickerViewerImg) {
      el.stickerViewerImg.src = sticker.src;
      el.stickerViewerImg.alt = sticker.name;
      el.stickerViewerImg.onerror = () => {
        el.stickerViewerImg.removeAttribute("src");
        el.stickerViewerImg.alt = sticker.emoji + " " + sticker.name;
      };
    }
    if (el.stickerViewerName) el.stickerViewerName.textContent = sticker.name;
    el.stickerViewer.hidden = false;
    el.stickerViewer.classList.add("open");
    sfxPick();
    speak(sticker.name);
  }

  function closeStickerViewer() {
    if (!el.stickerViewer) return;
    el.stickerViewer.hidden = true;
    el.stickerViewer.classList.remove("open");
    if (el.stickerViewerImg) {
      el.stickerViewerImg.removeAttribute("src");
      el.stickerViewerImg.alt = "";
    }
  }

  function renderStickerGrid() {
    if (!el.stickerGrid) return;
    const book = STICKER_BOOKS.find((b) => b.id === state.stickerPage) || STICKER_BOOKS[0];
    el.stickerGrid.innerHTML = "";
    if (el.stickerPageLabel) el.stickerPageLabel.textContent = book.title;

    book.stickers.forEach((st) => {
      const unlocked = isStickerUnlocked(st.id);
      const highlight =
        state.lastUnlockedSticker && state.lastUnlockedSticker.id === st.id;
      el.stickerGrid.appendChild(renderStickerCell(st, unlocked, { highlight }));
    });

    document.querySelectorAll(".sticker-tab").forEach((tab) => {
      const p = Number(tab.dataset.page);
      const on = p === state.stickerPage;
      tab.classList.toggle("active", on);
      tab.setAttribute("aria-selected", String(on));
    });

    const { have, total } = stickerCount();
    if (el.stickerHint) {
      if (have >= total) {
        el.stickerHint.textContent = "All stickers collected! You're a super star!";
      } else {
        el.stickerHint.textContent = `Play 8+ correct · random sticker or song (${have}/${total} stickers)`;
      }
    }
    updateStickerProgressUI();
  }

  function resetStickerBook() {
    const { have } = stickerCount();
    if (have === 0) {
      speak("No stickers to reset!");
      return;
    }
    const ok = window.confirm("Reset sticker book? All stickers will be locked again.");
    if (!ok) return;
    state.unlockedStickers = [];
    state.lastUnlockedSticker = null;
    saveStickers();
    updateStickerProgressUI();
    renderStickerGrid();
    sfxWrong();
    speak("Sticker book reset. Collect them again!");
  }

  function openStickerBook(page) {
    window.speechSynthesis && window.speechSynthesis.cancel();
    closeStickerViewer();
    if (page) state.stickerPage = page;
    // Jump to page of last unlock if any
    if (state.lastUnlockedSticker) {
      const id = state.lastUnlockedSticker.id;
      if (id.indexOf("p2-") === 0) state.stickerPage = 2;
      else state.stickerPage = 1;
    }
    renderStickerGrid();
    showScreen("stickers");
    const { have, total } = stickerCount();
    speak(
      have >= total
        ? "Your sticker book is full! Amazing!"
        : `Sticker book! You have ${have} stickers.`
    );
  }

  function showUnlockOnCelebrate(reward) {
    if (!el.stickerUnlockBanner) return;
    if (!reward || !reward.item) {
      el.stickerUnlockBanner.hidden = true;
      return;
    }
    el.stickerUnlockBanner.hidden = false;
    el.stickerUnlockBanner.classList.toggle("is-music", reward.type === "music");
    if (el.stickerUnlockPreview) el.stickerUnlockPreview.innerHTML = "";

    if (reward.type === "sticker") {
      if (el.stickerUnlockLabel) el.stickerUnlockLabel.textContent = "New sticker!";
      if (el.stickerUnlockName) el.stickerUnlockName.textContent = reward.item.name;
      if (el.stickerUnlockPreview) {
        el.stickerUnlockPreview.appendChild(
          renderStickerCell(reward.item, true, { highlight: true, noClick: true })
        );
      }
    } else {
      if (el.stickerUnlockLabel) el.stickerUnlockLabel.textContent = "New song!";
      if (el.stickerUnlockName) el.stickerUnlockName.textContent = reward.item.label;
      if (el.stickerUnlockPreview) {
        const badge = document.createElement("div");
        badge.className = "music-unlock-badge";
        badge.innerHTML = '<span class="music-unlock-note">🎵</span>';
        el.stickerUnlockPreview.appendChild(badge);
      }
    }
  }

  function choiceCount() {
    return CHOICES_BY_LEVEL[state.level] || 2;
  }

  function isPlayMode() {
    return state.mode === "play";
  }

  function levelLabel() {
    if (state.level === 3) return "Advanced";
    if (state.level === 2) return "Level 2";
    return "Easy";
  }

  function updateLevelChip() {
    if (el.levelChip) el.levelChip.textContent = levelLabel();
    if (el.modeChip) el.modeChip.textContent = isPlayMode() ? "Play" : "Practice";
    if (el.choices) {
      el.choices.dataset.level = String(state.level);
      el.choices.classList.toggle("choices-l2", state.level === 2);
      el.choices.classList.toggle("choices-l3", state.level === 3);
    }
    if (el.play) {
      el.play.classList.toggle("is-practice", !isPlayMode());
      el.play.classList.toggle("is-play-mode", isPlayMode());
    }
    if (el.resultBarWrap) el.resultBarWrap.hidden = !isPlayMode();
    if (el.practiceHud) el.practiceHud.hidden = isPlayMode();
    if (el.practiceTools) el.practiceTools.hidden = isPlayMode();
  }

  function initResultBar() {
    state.results = Array.from({ length: PLAY_QUESTIONS }, () => "pending");
    state.questionIndex = 0;
    renderResultBar();
  }

  function renderResultBar() {
    if (!el.resultBar) return;
    el.resultBar.innerHTML = "";
    state.results.forEach((r, i) => {
      const slot = document.createElement("span");
      slot.className = `result-slot result-${r}`;
      slot.dataset.i = String(i);
      if (r === "right") slot.textContent = "✓";
      else if (r === "wrong") slot.textContent = "✗";
      else slot.textContent = String(i + 1);
      el.resultBar.appendChild(slot);
    });
    const done = state.results.filter((r) => r !== "pending").length;
    if (el.resultCount) {
      const rights = state.results.filter((r) => r === "right").length;
      el.resultCount.textContent = `${done} / ${PLAY_QUESTIONS} · ✓${rights}`;
    }
  }

  function updatePracticeHud() {
    if (el.practiceCount) el.practiceCount.textContent = String(state.practiceTotal);
    if (el.practiceOk) el.practiceOk.textContent = `✓ ${state.practiceCorrectFirst}`;
  }

  function mapOverrideOption(c) {
    const base = itemById(c.id) || {};
    const key = String(c.label || "").toLowerCase();
    const feelIcon = FEELING_BADGE[key];
    return {
      id: c.id,
      label: c.label,
      emoji: c.emoji || (feelIcon && feelIcon.emoji) || base.emoji || "⭐",
      icon: (feelIcon && feelIcon.icon) || base.icon || null,
      cdn: feelIcon
        ? `https://unpkg.com/openmoji@15.0.0/color/svg/${feelIcon.code}.svg`
        : base.cdn || null,
    };
  }

  function pickWrongIds(wrongPool, correctId, need) {
    let pool = (wrongPool || []).filter((id) => id !== correctId);
    if (pool.length < need) {
      const extra = ITEMS.map((i) => i.id).filter(
        (id) => id !== correctId && !pool.includes(id)
      );
      pool = pool.concat(shuffle(extra));
    }
    return shuffle(pool).slice(0, need);
  }

  function setAnimal(animalId) {
    state.animalId = animalId in ANIMALS ? animalId : "bunny";
    const a = animal();
    el.buddy.dataset.animal = a.id;
    if (el.buddyImg) {
      el.buddyImg.src = a.src;
      el.buddyImg.alt = a.name;
      el.buddyImg.onerror = () => {
        if (el.buddyImg.src !== a.cdn) el.buddyImg.src = a.cdn;
      };
    }
    if (el.celebrateBuddy) {
      el.celebrateBuddy.src = a.src;
      el.celebrateBuddy.alt = a.name;
      el.celebrateBuddy.onerror = () => {
        if (el.celebrateBuddy.src !== a.cdn) el.celebrateBuddy.src = a.cdn;
      };
    }
  }

  function ensureAudio() {
    if (!state.audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) state.audioCtx = new Ctx();
    }
    if (state.audioCtx && state.audioCtx.state === "suspended") {
      state.audioCtx.resume();
    }
    return state.audioCtx;
  }

  function tone(freq, duration, type, gainValue) {
    const ctx = ensureAudio();
    if (!ctx) return;
    const t0 = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type || "sine";
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(gainValue || 0.08, t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
  }

  function sfxSuccess() {
    tone(523.25, 0.12, "sine", 0.09);
    setTimeout(() => tone(659.25, 0.12, "sine", 0.09), 90);
    setTimeout(() => tone(783.99, 0.18, "sine", 0.1), 180);
  }

  function sfxWrong() {
    tone(220, 0.14, "triangle", 0.05);
    setTimeout(() => tone(196, 0.16, "triangle", 0.04), 100);
  }

  function sfxStar() {
    tone(880, 0.1, "sine", 0.07);
    setTimeout(() => tone(1174.66, 0.16, "sine", 0.08), 80);
  }

  function sfxCelebrate() {
    [523, 659, 784, 1047].forEach((f, i) => {
      setTimeout(() => tone(f, 0.18, "sine", 0.09), i * 100);
    });
  }

  function sfxPick() {
    tone(659.25, 0.1, "sine", 0.07);
    setTimeout(() => tone(880, 0.14, "sine", 0.08), 70);
  }

  function stopMusic() {
    if (el.bgMusic) {
      el.bgMusic.pause();
      try {
        el.bgMusic.currentTime = 0;
      } catch (_) {}
    }
  }

  function pickRandomTrack() {
    let pool = availableMusicTracks();
    if (!pool.length) pool = BASE_MUSIC.slice();
    if (state.lastTrackId && pool.length > 1) {
      const filtered = pool.filter((t) => t.id !== state.lastTrackId);
      if (filtered.length) pool = filtered;
    }
    return pick(pool);
  }

  function loadTrack(track) {
    if (!el.bgMusic || !track) return;
    state.lastTrackId = track.id;
    // Encode path segments so spaces in filenames work on all hosts
    const encoded = track.src
      .split("/")
      .map((part) => encodeURIComponent(part))
      .join("/")
      .replace(/%2F/gi, "/");
    try {
      el.bgMusic.pause();
    } catch (_) {}
    el.bgMusic.loop = true;
    el.bgMusic.preload = "auto";
    el.bgMusic.src = encoded;
    el.bgMusic.load();
    if (el.musicLabel) el.musicLabel.textContent = track.label;
  }

  function startLoadedMusic(volume) {
    if (!el.bgMusic) return;
    el.bgMusic.volume = typeof volume === "number" ? volume : 0.28;
    el.bgMusic.loop = true;
    const tryPlay = () => {
      const play = el.bgMusic.play();
      if (play && typeof play.catch === "function") {
        play.catch(() => {
          // Retry once after a short delay (iOS / slow load)
          setTimeout(() => {
            el.bgMusic.play().catch(() => {});
          }, 200);
        });
      }
    };
    if (el.bgMusic.readyState >= 2) {
      tryPlay();
    } else {
      const onReady = () => {
        el.bgMusic.removeEventListener("canplay", onReady);
        tryPlay();
      };
      el.bgMusic.addEventListener("canplay", onReady);
      tryPlay();
    }
  }

  function startMusic(forceNew) {
    if (!el.bgMusic) return;
    if (forceNew || !el.bgMusic.getAttribute("src") || !state.lastTrackId) {
      loadTrack(pickRandomTrack());
    } else if (forceNew) {
      loadTrack(pickRandomTrack());
    }
    startLoadedMusic(0.28);
  }

  function setMusic(on) {
    state.musicOn = on;
    el.btnMusic.setAttribute("aria-pressed", String(on));
    el.btnMusicPlay.setAttribute("aria-pressed", String(on));
    if (on) {
      ensureAudio();
      startMusic(true);
    } else {
      stopMusic();
    }
  }

  // Keep looping if a track ends despite loop attribute
  if (el.bgMusic) {
    el.bgMusic.addEventListener("ended", () => {
      if (!state.musicOn) return;
      try {
        el.bgMusic.currentTime = 0;
        el.bgMusic.play().catch(() => {});
      } catch (_) {}
    });
    el.bgMusic.addEventListener("error", () => {
      // Skip broken file and try another available track
      if (!state.musicOn) return;
      const pool = availableMusicTracks().filter((t) => t.id !== state.lastTrackId);
      const next = pool.length ? pick(pool) : pick(BASE_MUSIC);
      if (next) {
        loadTrack(next);
        startLoadedMusic(0.28);
      }
    });
  }

  function clearMotion() {
    if (state.motionTimer) {
      clearTimeout(state.motionTimer);
      state.motionTimer = null;
    }
    const motions = [
      "act-hop",
      "act-spin",
      "act-eat",
      "act-drink",
      "act-sleep",
      "act-hug",
      "act-play",
      "act-wash",
      "act-wiggle",
      "idle-bob",
    ];
    if (el.buddy) motions.forEach((c) => el.buddy.classList.remove(c));
    if (el.buddyWrap) motions.forEach((c) => el.buddyWrap.classList.remove(c));
    const fx = document.getElementById("motion-fx");
    if (fx) {
      fx.className = "motion-fx";
      fx.innerHTML = "";
    }
  }

  function playSuccessMotion(correctId, feeling) {
    clearMotion();
    const motion =
      MOTION_BY_ANSWER[correctId] || MOTION_BY_FEELING[feeling] || "act-hop";
    el.buddy.classList.add(motion);
    if (el.buddyWrap) el.buddyWrap.classList.add(motion);

    const fx = document.getElementById("motion-fx");
    if (fx) {
      fx.className = `motion-fx show fx-${motion}`;
      const item = itemById(correctId);
      if (item && (motion === "act-eat" || motion === "act-drink" || motion === "act-play" || motion === "act-hug")) {
        const img = document.createElement("img");
        img.src = item.icon;
        img.alt = "";
        img.className = "fx-item";
        img.onerror = () => {
          if (item.cdn) img.src = item.cdn;
        };
        fx.appendChild(img);
      } else if (motion === "act-sleep") {
        fx.innerHTML = '<span class="fx-zzz">z z z</span>';
      } else if (motion === "act-wash") {
        fx.innerHTML = '<span class="fx-bubbles">🫧 🫧</span>';
      } else {
        fx.innerHTML = '<span class="fx-hearts">💕 ✨</span>';
      }
    }

    state.motionTimer = setTimeout(() => {
      clearMotion();
      if (el.buddy) el.buddy.classList.add("idle-bob");
    }, 1200);
  }

  function speak(text) {
    if (!window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
    } catch (_) {}
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.9;
    u.pitch = 1.15;
    u.lang = "en-US";
    const voices = window.speechSynthesis.getVoices();
    const preferred =
      voices.find((v) => /en(-|_)US/i.test(v.lang) && /female|samantha|zira|google|siri/i.test(v.name)) ||
      voices.find((v) => /en(-|_)GB/i.test(v.lang)) ||
      voices.find((v) => /en/i.test(v.lang));
    if (preferred) u.voice = preferred;
    // iOS sometimes needs a tick after cancel
    setTimeout(() => {
      try {
        window.speechSynthesis.speak(u);
      } catch (_) {}
    }, 20);
  }

  function unlockAudio() {
    ensureAudio();
    if (el.bgMusic) {
      const wasMuted = el.bgMusic.muted;
      el.bgMusic.muted = true;
      const p = el.bgMusic.play();
      if (p && typeof p.then === "function") {
        p.then(() => {
          el.bgMusic.pause();
          el.bgMusic.currentTime = 0;
          el.bgMusic.muted = wasMuted;
        }).catch(() => {
          el.bgMusic.muted = wasMuted;
        });
      } else {
        el.bgMusic.muted = wasMuted;
      }
    }
    // Prime speech on first gesture (iOS)
    if (window.speechSynthesis) {
      try {
        window.speechSynthesis.getVoices();
      } catch (_) {}
    }
  }

  function isStandalone() {
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true
    );
  }


  function setFeeling(feeling) {
    el.buddy.dataset.feeling = feeling;
    el.feelingChip.textContent = feeling;
    const badge = FEELING_BADGE[feeling] || FEELING_BADGE.happy;
    if (el.feelingBadge) {
      if (el.feelingBadge.tagName === "IMG") {
        el.feelingBadge.src = badge.icon;
        el.feelingBadge.alt = feeling;
        el.feelingBadge.onerror = () => {
          el.feelingBadge.src = `https://unpkg.com/openmoji@15.0.0/color/svg/${badge.code}.svg`;
        };
      } else {
        el.feelingBadge.textContent = badge.emoji;
      }
    }
    if (el.zzzFloat) {
      el.zzzFloat.classList.toggle("show", feeling === "sleepy");
    }
    if (el.buddyWrap) {
      el.buddyWrap.classList.toggle("is-sad", feeling === "sad");
      el.buddyWrap.classList.toggle("is-sleepy", feeling === "sleepy");
      el.buddyWrap.classList.toggle("is-hungry", feeling === "hungry" || feeling === "thirsty");
    }
    if (el.buddy && !el.buddy.className.match(/act-/)) {
      el.buddy.classList.add("idle-bob");
    }
  }

  function burstSparkles() {
    el.sparkles.innerHTML = "";
    el.sparkles.classList.add("on");
    for (let i = 0; i < 8; i++) {
      const s = document.createElement("span");
      const angle = (Math.PI * 2 * i) / 8;
      s.textContent = i % 2 ? "✦" : "★";
      s.style.setProperty("--dx", `${Math.cos(angle) * 60}px`);
      s.style.setProperty("--dy", `${Math.sin(angle) * 50 - 20}px`);
      s.style.left = "50%";
      s.style.top = "40%";
      el.sparkles.appendChild(s);
    }
    setTimeout(() => {
      el.sparkles.classList.remove("on");
      el.sparkles.innerHTML = "";
    }, 750);
  }

  function makeConfetti() {
    el.confetti.innerHTML = "";
    const colors = ["#ffb347", "#ffb4c8", "#ffe066", "#a8d8ff", "#9be7a8", "#d4b8ff"];
    for (let i = 0; i < 36; i++) {
      const bit = document.createElement("i");
      bit.style.left = `${Math.random() * 100}%`;
      bit.style.background = pick(colors);
      bit.style.animationDuration = `${1.6 + Math.random() * 1.4}s`;
      bit.style.animationDelay = `${Math.random() * 0.4}s`;
      bit.style.width = `${8 + Math.random() * 8}px`;
      bit.style.height = `${8 + Math.random() * 8}px`;
      el.confetti.appendChild(bit);
    }
  }

  function availableRounds() {
    return ROUND_TEMPLATES.filter((r) => {
      if (r.animals && !r.animals.includes(state.animalId)) return false;
      const min = r.minLevel || 1;
      if (state.level < min) return false;
      return true;
    });
  }

  function buildRound() {
    clearMotion();
    let pool = availableRounds();
    const avoid = new Set(state.recentRoundIds);
    let filtered = pool.filter((r) => !avoid.has(r.id));
    if (!filtered.length) {
      filtered = pool.filter((r) => r.id !== state.lastRoundId);
      state.recentRoundIds = [];
    }
    if (!filtered.length) filtered = pool;

    const template = pick(filtered);
    const prompt = fillName(template.prompt);
    const praise = fillName(template.praise);
    const nChoices = choiceCount();
    const nWrong = Math.max(1, nChoices - 1);

    let options;
    let correctId;

    const overrideList =
      state.level >= 3 && template.choiceOverrideL3
        ? template.choiceOverrideL3
        : state.level >= 2 && template.choiceOverrideL2
          ? template.choiceOverrideL2
          : template.choiceOverride;

    if (overrideList && overrideList.length) {
      let list = overrideList.map(mapOverrideOption);
      if (list.length > nChoices) list = shuffle(list).slice(0, nChoices);
      // ensure correct is included
      correctId = template.correctPool[0];
      if (!list.some((o) => o.id === correctId)) {
        const correctOpt = mapOverrideOption(
          overrideList.find((c) => c.id === correctId) || {
            id: correctId,
            label: (itemById(correctId) || {}).label || correctId,
            emoji: (itemById(correctId) || {}).emoji || "⭐",
          }
        );
        list = [correctOpt, ...list.filter((o) => o.id !== correctId)].slice(0, nChoices);
      }
      while (list.length < nChoices) {
        const fillerId = pick(
          ITEMS.map((i) => i.id).filter((id) => !list.some((o) => o.id === id))
        );
        if (!fillerId) break;
        list.push(itemById(fillerId));
      }
      options = shuffle(list);
    } else {
      correctId = pick(template.correctPool);
      const wrongIds = pickWrongIds(template.wrongPool, correctId, nWrong);
      const correct = itemById(correctId);
      const wrongs = wrongIds.map((id) => itemById(id)).filter(Boolean);
      options = shuffle([correct, ...wrongs]);
    }

    state.round = {
      id: template.id,
      feeling: template.feeling || template.id,
      prompt,
      praise,
      correctId,
      options,
    };
    state.lastRoundId = template.id;
    state.recentRoundIds.push(template.id);
    if (state.recentRoundIds.length > 8) state.recentRoundIds.shift();
    state.misses = 0;
    state.questionMissed = false;
    state.locked = false;

    setFeeling(state.round.feeling);
    el.promptText.textContent = prompt;
    renderChoices();
    speak(prompt);
  }

  function renderChoices() {
    el.choices.innerHTML = "";
    if (!state.round) return;
    state.round.options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "choice";
      btn.dataset.id = opt.id;
      btn.setAttribute("aria-label", opt.label);
      const label = document.createElement("span");
      label.textContent = opt.label;
      if (opt.icon) {
        const img = document.createElement("img");
        img.className = "choice-icon";
        img.alt = "";
        img.draggable = false;
        img.src = opt.icon;
        let triedCdn = false;
        img.onerror = () => {
          if (!triedCdn && opt.cdn) {
            triedCdn = true;
            img.src = opt.cdn;
            return;
          }
          const em = document.createElement("span");
          em.className = "emoji";
          em.setAttribute("aria-hidden", "true");
          em.textContent = opt.emoji || "⭐";
          img.replaceWith(em);
        };
        btn.appendChild(img);
      } else {
        const em = document.createElement("span");
        em.className = "emoji";
        em.setAttribute("aria-hidden", "true");
        em.textContent = opt.emoji || "⭐";
        btn.appendChild(em);
      }
      btn.appendChild(label);
      btn.addEventListener("click", () => onChoice(opt.id, btn));
      el.choices.appendChild(btn);
    });
  }

  function lockChoices(lock) {
    state.locked = lock;
    el.choices.querySelectorAll(".choice").forEach((b) => {
      b.disabled = lock;
    });
  }

  function onChoice(id, btn) {
    if (state.locked || !state.round) return;
    const correct = id === state.round.correctId;

    if (correct) {
      lockChoices(true);
      btn.classList.add("correct-flash");
      el.buddy.classList.remove("react-wrong");
      const feelingBefore = state.round.feeling;
      playSuccessMotion(id, feelingBefore);
      setFeeling("happy");
      burstSparkles();
      sfxSuccess();
      speak(state.round.praise);
      sfxStar();

      if (isPlayMode()) {
        const idx = state.questionIndex;
        if (idx < PLAY_QUESTIONS) {
          state.results[idx] = state.questionMissed ? "wrong" : "right";
          renderResultBar();
        }
      } else {
        state.practiceTotal += 1;
        if (!state.questionMissed) state.practiceCorrectFirst += 1;
        updatePracticeHud();
      }

      setTimeout(() => {
        clearMotion();
        if (isPlayMode()) {
          state.questionIndex += 1;
          if (state.questionIndex >= PLAY_QUESTIONS) {
            winSession();
          } else {
            buildRound();
          }
        } else {
          buildRound();
        }
      }, 1500);
      return;
    }

    // wrong — mark question as missed (for score bar)
    state.misses += 1;
    state.questionMissed = true;
    btn.classList.add("wrong-flash");
    el.buddy.classList.add("react-wrong");
    sfxWrong();
    speak("Try again!");
    setTimeout(() => {
      btn.classList.remove("wrong-flash");
      el.buddy.classList.remove("react-wrong");
    }, 400);

    if (state.misses >= 1) {
      const right = el.choices.querySelector(`.choice[data-id="${state.round.correctId}"]`);
      if (right) right.classList.add("hint");
    }
  }

  function winSession() {
    showScreen("celebrate");
    makeConfetti();
    sfxCelebrate();
    const name = animal().name;
    const rights = state.results.filter((r) => r === "right").length;
    const total = PLAY_QUESTIONS;

    if (el.scoreSummary) el.scoreSummary.hidden = false;
    if (el.resultBarFinal) {
      el.resultBarFinal.innerHTML = "";
      state.results.forEach((r) => {
        const slot = document.createElement("span");
        slot.className = `result-slot result-${r === "pending" ? "wrong" : r}`;
        slot.textContent = r === "right" ? "✓" : "✗";
        el.resultBarFinal.appendChild(slot);
      });
    }
    if (el.scoreLine) el.scoreLine.textContent = `${rights} / ${total} correct`;
    if (el.celebrateTitle) {
      el.celebrateTitle.textContent =
        rights === total ? "Perfect!" : rights >= 7 ? "Great job!" : "Nice try!";
    }

    const reward = tryUnlockRewardFromPlay(rights);
    showUnlockOnCelebrate(reward);

    if (reward && reward.type === "sticker") {
      el.celebrateMsg.textContent = `${name} is proud! ${rights}/${total} · New sticker: ${reward.item.name}!`;
      speak(
        rights === total
          ? `Perfect! New sticker! ${reward.item.name}!`
          : `Great job! You unlocked sticker ${reward.item.name}!`
      );
    } else if (reward && reward.type === "music") {
      el.celebrateMsg.textContent = `${name} is proud! ${rights}/${total} · New song: ${reward.item.label}!`;
      speak(
        rights === total
          ? `Perfect! New song! ${reward.item.label}!`
          : `Great job! You unlocked the song ${reward.item.label}!`
      );
      // Auto-play new song once
      playSelectedTrack(reward.item);
    } else if (
      rights >= STICKER_UNLOCK_MIN &&
      !nextLockedSticker() &&
      !nextLockedMusic()
    ) {
      el.celebrateMsg.textContent = `${name} is proud! ${rights}/${total}. Everything unlocked!`;
      speak(`Amazing! ${rights} out of ${total}. You collected everything!`);
    } else if (rights < STICKER_UNLOCK_MIN) {
      el.celebrateMsg.textContent = `${name} is proud! ${rights}/${total}. Get ${STICKER_UNLOCK_MIN}+ for a prize!`;
      speak(
        `All done! You got ${rights} out of ${total}. Get ${STICKER_UNLOCK_MIN} or more to unlock a sticker or song!`
      );
    } else {
      el.celebrateMsg.textContent = `${name} is proud! You got ${rights} out of ${total}.`;
      speak(`All done! You got ${rights} out of ${total}. Great job!`);
    }
  }

  function openModeHome() {
    window.speechSynthesis && window.speechSynthesis.cancel();
    showScreen("title");
  }

  function selectMode(mode) {
    ensureAudio();
    state.mode = mode === "practice" ? "practice" : "play";
    openPick();
  }

  function openPick() {
    ensureAudio();
    window.speechSynthesis && window.speechSynthesis.cancel();
    showScreen("pick");
    speak("Who is your buddy?");
  }

  function openLevel() {
    ensureAudio();
    window.speechSynthesis && window.speechSynthesis.cancel();
    showScreen("level");
    speak(
      isPlayMode()
        ? "Easy, level two, or advanced? Ten questions!"
        : "Easy, level two, or advanced?"
    );
  }

  function startGameWithAnimal(animalId) {
    ensureAudio();
    setAnimal(animalId);
    openLevel();
  }

  function beginPlay() {
    ensureAudio();
    state.misses = 0;
    state.questionMissed = false;
    state.lastRoundId = null;
    state.recentRoundIds = [];
    if (isPlayMode()) {
      initResultBar();
      state.practiceTotal = 0;
      state.practiceCorrectFirst = 0;
    } else {
      // practice keeps running totals unless fresh start
      if (state.practiceTotal === 0) updatePracticeHud();
    }
    updateLevelChip();
    updatePracticeHud();
    sfxPick();
    if (state.musicOn) startMusic(true);
    showScreen("play");
    if (el.scoreSummary) el.scoreSummary.hidden = true;
    const modeWords = isPlayMode() ? "Play mode. Ten questions." : "Practice mode.";
    const levelWords =
      state.level === 3 ? "Advanced!" : state.level === 2 ? "Level two!" : "Easy!";
    speak(`${animal().name}! ${modeWords} ${levelWords}`);
    setTimeout(() => buildRound(), 700);
  }

  function goHome() {
    window.speechSynthesis && window.speechSynthesis.cancel();
    showScreen("title");
  }

  // Events
  if (el.btnModePlay) el.btnModePlay.addEventListener("click", () => selectMode("play"));
  if (el.btnModePractice) el.btnModePractice.addEventListener("click", () => selectMode("practice"));
  if (el.btnStickers) {
    el.btnStickers.addEventListener("click", () => {
      state.lastUnlockedSticker = null;
      openStickerBook(state.stickerPage);
    });
  }
  if (el.btnMusicLib) {
    el.btnMusicLib.addEventListener("click", openMusicLibrary);
  }
  if (el.btnCelebrateStickers) {
    el.btnCelebrateStickers.addEventListener("click", () => openStickerBook());
  }
  if (el.btnCelebrateMusic) {
    el.btnCelebrateMusic.addEventListener("click", openMusicLibrary);
  }
  if (el.btnStickersBack) {
    el.btnStickersBack.addEventListener("click", goHome);
  }
  if (el.btnMusicBack) {
    el.btnMusicBack.addEventListener("click", goHome);
  }
  if (el.btnResetStickers) {
    el.btnResetStickers.addEventListener("click", resetStickerBook);
  }
  if (el.btnResetMusic) {
    el.btnResetMusic.addEventListener("click", resetMusicBook);
  }
  if (el.btnStickerViewerBack) {
    el.btnStickerViewerBack.addEventListener("click", closeStickerViewer);
  }
  if (el.stickerViewer) {
    el.stickerViewer.addEventListener("click", (e) => {
      if (e.target === el.stickerViewer) closeStickerViewer();
    });
  }
  document.querySelectorAll(".sticker-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const p = Number(tab.dataset.page);
      if (p !== 1 && p !== 2) return;
      state.stickerPage = p;
      state.lastUnlockedSticker = null;
      renderStickerGrid();
      sfxPick();
    });
  });
  el.btnAgain.addEventListener("click", () => {
    state.lastUnlockedSticker = null;
    if (el.stickerUnlockBanner) el.stickerUnlockBanner.hidden = true;
    if (isPlayMode()) {
      beginPlay();
    } else {
      state.practiceTotal = 0;
      state.practiceCorrectFirst = 0;
      beginPlay();
    }
  });
  el.btnSwitch.addEventListener("click", openPick);
  el.btnBye.addEventListener("click", goHome);
  el.btnHome.addEventListener("click", goHome);
  el.btnPickBack.addEventListener("click", goHome);
  if (el.btnLevelBack) {
    el.btnLevelBack.addEventListener("click", openPick);
  }
  if (el.btnPracAnimal) {
    el.btnPracAnimal.addEventListener("click", () => {
      window.speechSynthesis && window.speechSynthesis.cancel();
      state.practiceSwap = true;
      showScreen("pick");
      speak("Pick a new friend!");
    });
  }
  if (el.btnPracLevel) {
    el.btnPracLevel.addEventListener("click", () => {
      window.speechSynthesis && window.speechSynthesis.cancel();
      state.practiceSwap = true;
      showScreen("level");
      speak("Easy, level two, or advanced?");
    });
  }
  if (el.levelGrid) {
    el.levelGrid.addEventListener("click", (e) => {
      const card = e.target.closest("[data-level]");
      if (!card) return;
      const lv = Number(card.dataset.level);
      if (lv !== 1 && lv !== 2 && lv !== 3) return;
      state.level = lv;
      if (state.practiceSwap && !isPlayMode()) {
        state.practiceSwap = false;
        updateLevelChip();
        showScreen("play");
        sfxPick();
        speak(`${levelLabel()}! Keep practicing!`);
        setTimeout(() => buildRound(), 500);
        return;
      }
      state.practiceSwap = false;
      beginPlay();
    });
  }
  el.btnSay.addEventListener("click", () => {
    if (state.round) speak(state.round.prompt);
  });
  el.btnMusic.addEventListener("click", () => setMusic(!state.musicOn));
  el.btnMusicPlay.addEventListener("click", () => setMusic(!state.musicOn));

  el.animalGrid.addEventListener("click", (e) => {
    const card = e.target.closest(".animal-card");
    if (!card) return;
    const id = card.dataset.animal;
    if (!id || !(id in ANIMALS)) return;
    setAnimal(id);
    if (state.practiceSwap && !isPlayMode()) {
      state.practiceSwap = false;
      updateLevelChip();
      showScreen("play");
      sfxPick();
      speak(`${animal().name}! Keep practicing!`);
      setTimeout(() => buildRound(), 500);
      return;
    }
    startGameWithAnimal(id);
  });

  if (window.speechSynthesis) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }

  // First user gesture unlocks WebAudio + speech on iPad
  let audioUnlocked = false;
  const unlockOnce = () => {
    if (audioUnlocked) return;
    audioUnlocked = true;
    unlockAudio();
    document.removeEventListener("touchstart", unlockOnce, true);
    document.removeEventListener("pointerdown", unlockOnce, true);
  };
  document.addEventListener("touchstart", unlockOnce, { capture: true, passive: true });
  document.addEventListener("pointerdown", unlockOnce, { capture: true });

  // Reduce double-tap zoom delay on older iOS
  document.addEventListener(
    "touchend",
    (e) => {
      const t = e.target;
      if (t && (t.closest("button") || t.closest("a"))) {
        /* allow button clicks */
      }
    },
    { passive: true }
  );

  if (isStandalone()) document.body.classList.add("ios-standalone");

  loadStickers();
  loadMusicUnlocks();
  updateStickerProgressUI();
  updateMusicProgressUI();
  setAnimal("bunny");
  showScreen("title");
})();
