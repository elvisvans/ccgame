(() => {
  "use strict";

  const CHOICES_BY_LEVEL = { 1: 2, 2: 3, 3: 4 };
  const SETTINGS_STORAGE_KEY = "hb-settings-v1";
  const STICKER_STORAGE_KEY = "hb-stickers-v1";
  const MUSIC_STORAGE_KEY = "hb-music-v1";
  const STICKERS_PER_PAGE = 9;

  const CATEGORIES = {
    all: { id: "all", label: "All" },
    food: { id: "food", label: "Food" },
    feelings: { id: "feelings", label: "Feelings" },
    home: { id: "home", label: "Home" },
    playground: { id: "playground", label: "Playground" },
    treats: { id: "treats", label: "Animal treats" },
  };

  const DEFAULT_SETTINGS = {
    playQuestions: 10,
    unlockMin: 8,
    voiceStyle: "kid", // kid | high | soft | default | custom
    voiceURI: "", // SpeechSynthesisVoice.voiceURI when custom
  };

  /** Distinct pitch/rate so presets sound different even on one engine voice */
  const VOICE_PRESETS = {
    kid: { pitch: 1.85, rate: 0.82, label: "Kid girl" },
    high: { pitch: 2.0, rate: 0.95, label: "High pitch" },
    soft: { pitch: 1.15, rate: 0.78, label: "Soft lady" },
    default: { pitch: 1.0, rate: 1.0, label: "Normal" },
    custom: { pitch: 1.55, rate: 0.88, label: "My voice" },
  };

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
    { id: "dress", label: "Dress", emoji: "👗", ...iconPaths("dress.svg", "1F457") },
    { id: "pants", label: "Pants", emoji: "👖", ...iconPaths("jeans.svg", "1F456") },
    { id: "shirt", label: "Shirt", emoji: "👕", ...iconPaths("tshirt.svg", "1F455") },
    { id: "coat", label: "Jacket", emoji: "🧥", ...iconPaths("coat.svg", "1F9E5") },
    { id: "socks", label: "Socks", emoji: "🧦", ...iconPaths("socks.svg", "1F9E6") },
    { id: "gloves", label: "Gloves", emoji: "🧤", ...iconPaths("gloves.svg", "1F9E4") },
    { id: "scarf", label: "Scarf", emoji: "🧣", ...iconPaths("scarf.svg", "1F9E3") },
    { id: "shorts", label: "Shorts", emoji: "🩳", ...iconPaths("shorts.svg", "1FA73") },
    { id: "cap", label: "Cap", emoji: "🧢", ...iconPaths("cap.svg", "1F9E2") },
    { id: "boots", label: "Boots", emoji: "🥾", ...iconPaths("boot.svg", "1F97E") },
    { id: "glasses", label: "Glasses", emoji: "👓", ...iconPaths("eyeglasses.svg", "1F453") },
    { id: "chair", label: "Chair", emoji: "🪑", ...iconPaths("chair.svg", "1FA91") },
    { id: "tv", label: "TV", emoji: "📺", ...iconPaths("tv.svg", "1F4FA") },
    { id: "carousel", label: "Merry-go-round", emoji: "🎠", ...iconPaths("carousel.svg", "1F3A0") },
    { id: "slide", label: "Slide", emoji: "🛝", ...iconPaths("slide.svg", "1F6DD") },
    { id: "swing", label: "Swing", emoji: "⛳", ...iconPaths("swing.svg", "1F6DD") },
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
    // More everyday answers
    { id: "orange", label: "Orange", emoji: "🍊", ...iconPaths("orange.svg", "1F34A") },
    { id: "watermelon", label: "Watermelon", emoji: "🍉", ...iconPaths("watermelon.svg", "1F349") },
    { id: "grape", label: "Grapes", emoji: "🍇", ...iconPaths("grape.svg", "1F347") },
    { id: "strawberry", label: "Strawberry", emoji: "🍓", ...iconPaths("strawberry.svg", "1F353") },
    { id: "pear", label: "Pear", emoji: "🍐", ...iconPaths("pear.svg", "1F350") },
    { id: "egg", label: "Egg", emoji: "🥚", ...iconPaths("egg.svg", "1F95A") },
    { id: "rice", label: "Rice", emoji: "🍚", ...iconPaths("rice.svg", "1F35A") },
    { id: "pizza", label: "Pizza", emoji: "🍕", ...iconPaths("pizza.svg", "1F355") },
    { id: "cake", label: "Cake", emoji: "🎂", ...iconPaths("cake.svg", "1F382") },
    { id: "juice", label: "Juice", emoji: "🧃", ...iconPaths("juice.svg", "1F9C3") },
    { id: "cup", label: "Cup", emoji: "🍵", ...iconPaths("cup.svg", "1F375") },
    { id: "plane", label: "Plane", emoji: "✈️", ...iconPaths("plane.svg", "2708") },
    { id: "ship", label: "Ship", emoji: "🚢", ...iconPaths("ship.svg", "1F6A2") },
    { id: "train", label: "Train", emoji: "🚆", ...iconPaths("train.svg", "1F686") },
    { id: "bus", label: "Bus", emoji: "🚌", ...iconPaths("bus.svg", "1F68C") },
    { id: "bike", label: "Bike", emoji: "🚲", ...iconPaths("bike.svg", "1F6B2") },
    { id: "taxi", label: "Taxi", emoji: "🚕", ...iconPaths("taxi.svg", "1F695") },
    { id: "truck", label: "Truck", emoji: "🚚", ...iconPaths("truck.svg", "1F69A") },
    { id: "rocket", label: "Rocket", emoji: "🚀", ...iconPaths("rocket.svg", "1F680") },
    { id: "helicopter", label: "Helicopter", emoji: "🚁", ...iconPaths("helicopter.svg", "1F681") },
    { id: "clock", label: "Clock", emoji: "🕰️", ...iconPaths("clock.svg", "1F570") },
    { id: "key", label: "Key", emoji: "🔑", ...iconPaths("key.svg", "1F511") },
    { id: "bag", label: "Bag", emoji: "👜", ...iconPaths("bag.svg", "1F45C") },
    { id: "umbrella", label: "Umbrella", emoji: "☂️", ...iconPaths("umbrella.svg", "2602") },
    { id: "flower", label: "Flower", emoji: "🌸", ...iconPaths("flower.svg", "1F338") },
    { id: "cloud", label: "Cloud", emoji: "☁️", ...iconPaths("cloud.svg", "2601") },
    { id: "star", label: "Star", emoji: "⭐", ...iconPaths("star-item.svg", "2B50") },
    { id: "gift", label: "Gift", emoji: "🎁", ...iconPaths("gift.svg", "1F381") },
    { id: "camera", label: "Camera", emoji: "📷", ...iconPaths("camera.svg", "1F4F7") },
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
    dress: "act-spin",
    pants: "act-hop",
    shirt: "act-spin",
    coat: "act-hug",
    socks: "act-hop",
    gloves: "act-hug",
    scarf: "act-hug",
    shorts: "act-hop",
    cap: "act-spin",
    boots: "act-hop",
    glasses: "act-spin",
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
    orange: "act-eat",
    watermelon: "act-eat",
    grape: "act-eat",
    strawberry: "act-eat",
    pear: "act-eat",
    egg: "act-eat",
    rice: "act-eat",
    pizza: "act-eat",
    cake: "act-eat",
    juice: "act-drink",
    cup: "act-drink",
    plane: "act-spin",
    ship: "act-hop",
    train: "act-hop",
    bus: "act-hop",
    bike: "act-hop",
    taxi: "act-hop",
    truck: "act-hop",
    rocket: "act-spin",
    helicopter: "act-spin",
    clock: "act-spin",
    key: "act-spin",
    bag: "act-hop",
    umbrella: "act-spin",
    flower: "act-wiggle",
    cloud: "act-spin",
    star: "act-spin",
    gift: "act-hug",
    camera: "act-spin",
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
      id: "cold-coat",
      category: "home",
      feeling: "sad",
      prompt: "{name} is cold. Put on a jacket!",
      praise: "Warm jacket! Cozy!",
      correctPool: ["coat"],
      wrongPool: ["banana", "ball", "soap", "shorts"],
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
      id: "cold-day-coat",
      category: "home",
      feeling: "sad",
      prompt: "Brr! It is cold. Find a jacket!",
      praise: "Jacket on! Warm and cozy!",
      correctPool: ["coat"],
      wrongPool: ["water", "moon", "fish", "shorts"],
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
      category: "playground",
      feeling: "happy",
      prompt: "Swing high! Find the swing!",
      praise: "Swing swing! Higher!",
      correctPool: ["swing"],
      wrongPool: ["door", "milk", "slide", "bone"],
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
    // —— expanded everyday answers ——
    {
      id: "food-orange",
      category: "food",
      feeling: "hungry",
      prompt: "Round and orange! Find the orange!",
      praise: "Orange! Juicy!",
      correctPool: ["orange"],
      wrongPool: ["apple", "banana", "ball", "car"],
    },
    {
      id: "food-watermelon",
      category: "food",
      feeling: "hungry",
      prompt: "Big green fruit! Find watermelon!",
      praise: "Watermelon! Yum!",
      correctPool: ["watermelon"],
      wrongPool: ["grape", "apple", "ball", "soap"],
    },
    {
      id: "food-grape",
      category: "food",
      feeling: "hungry",
      prompt: "Little purple fruit! Find grapes!",
      praise: "Grapes! Pop pop!",
      correctPool: ["grape"],
      wrongPool: ["strawberry", "pear", "bone", "hat"],
    },
    {
      id: "food-strawberry",
      category: "food",
      feeling: "hungry",
      prompt: "Red and sweet! Find strawberry!",
      praise: "Strawberry! Sweet!",
      correctPool: ["strawberry"],
      wrongPool: ["orange", "cookie", "car", "key"],
    },
    {
      id: "food-pear",
      category: "food",
      feeling: "hungry",
      prompt: "Green fruit! Find the pear!",
      praise: "Pear! Crunchy!",
      correctPool: ["pear"],
      wrongPool: ["apple", "banana", "ball", "door"],
    },
    {
      id: "food-egg",
      category: "food",
      feeling: "hungry",
      prompt: "Breakfast egg! Find the egg!",
      praise: "Egg! Good food!",
      correctPool: ["egg"],
      wrongPool: ["ball", "moon", "soap", "key"],
    },
    {
      id: "food-rice",
      category: "food",
      feeling: "hungry",
      prompt: "{name} wants rice! Find rice!",
      praise: "Rice! Yummy!",
      correctPool: ["rice"],
      wrongPool: ["pizza", "ball", "car", "hat"],
    },
    {
      id: "food-pizza",
      category: "food",
      feeling: "hungry",
      prompt: "Yummy pizza! Find pizza!",
      praise: "Pizza! Cheesy!",
      correctPool: ["pizza"],
      wrongPool: ["cake", "soap", "phone", "tree"],
    },
    {
      id: "food-cake",
      category: "food",
      feeling: "happy",
      prompt: "Birthday treat! Find the cake!",
      praise: "Cake! Happy day!",
      correctPool: ["cake"],
      wrongPool: ["bread", "ball", "door", "lamp"],
    },
    {
      id: "food-juice",
      category: "food",
      feeling: "thirsty",
      prompt: "{name} wants juice! Find juice!",
      praise: "Juice! Sip sip!",
      correctPool: ["juice"],
      wrongPool: ["milk", "water", "ball", "hat"],
    },
    {
      id: "food-cup",
      category: "home",
      feeling: "thirsty",
      prompt: "Drink from a cup! Find the cup!",
      praise: "Cup! Drink time!",
      correctPool: ["cup"],
      wrongPool: ["ball", "shoe", "key", "car"],
    },
    {
      id: "go-plane",
      category: "playground",
      feeling: "happy",
      prompt: "Fly in the sky! Find the plane!",
      praise: "Plane! Whoosh!",
      correctPool: ["plane"],
      wrongPool: ["car", "ship", "bed", "apple"],
    },
    {
      id: "go-ship",
      category: "playground",
      feeling: "happy",
      prompt: "On the water! Find the ship!",
      praise: "Ship! Splash!",
      correctPool: ["ship"],
      wrongPool: ["plane", "car", "bike", "cake"],
    },
    {
      id: "go-train",
      category: "playground",
      feeling: "happy",
      prompt: "Choo choo! Find the train!",
      praise: "Train! Choo choo!",
      correctPool: ["train"],
      wrongPool: ["bus", "car", "bed", "soap"],
    },
    {
      id: "go-bus",
      category: "playground",
      feeling: "happy",
      prompt: "Big yellow ride! Find the bus!",
      praise: "Bus! Beep beep!",
      correctPool: ["bus"],
      wrongPool: ["car", "bike", "milk", "hat"],
    },
    {
      id: "go-bike",
      category: "playground",
      feeling: "happy",
      prompt: "Ride a bike! Find the bike!",
      praise: "Bike! Pedal pedal!",
      correctPool: ["bike"],
      wrongPool: ["car", "bus", "bed", "cookie"],
    },
    {
      id: "go-taxi",
      category: "playground",
      feeling: "happy",
      prompt: "Yellow taxi! Find the taxi!",
      praise: "Taxi! Let's go!",
      correctPool: ["taxi"],
      wrongPool: ["bus", "truck", "apple", "moon"],
    },
    {
      id: "go-truck",
      category: "playground",
      feeling: "happy",
      prompt: "Big truck! Find the truck!",
      praise: "Truck! Vroom!",
      correctPool: ["truck"],
      wrongPool: ["car", "bike", "cake", "soap"],
    },
    {
      id: "go-rocket",
      category: "playground",
      feeling: "surprised",
      prompt: "Zoom to space! Find the rocket!",
      praise: "Rocket! Blast off!",
      correctPool: ["rocket"],
      wrongPool: ["plane", "car", "bed", "fish"],
    },
    {
      id: "go-helicopter",
      category: "playground",
      feeling: "happy",
      prompt: "Spin in the air! Find helicopter!",
      praise: "Helicopter! Spin spin!",
      correctPool: ["helicopter"],
      wrongPool: ["plane", "bus", "chair", "grape"],
    },
    {
      id: "home-clock",
      category: "home",
      feeling: "happy",
      prompt: "What tells time? Find the clock!",
      praise: "Clock! Tick tock!",
      correctPool: ["clock"],
      wrongPool: ["phone", "key", "ball", "cake"],
    },
    {
      id: "home-key",
      category: "home",
      feeling: "happy",
      prompt: "Open the door! Find the key!",
      praise: "Key! Open up!",
      correctPool: ["key"],
      wrongPool: ["bag", "phone", "apple", "bone"],
    },
    {
      id: "home-bag",
      category: "home",
      feeling: "happy",
      prompt: "Carry things! Find the bag!",
      praise: "Bag! Let's go!",
      correctPool: ["bag"],
      wrongPool: ["hat", "shoes", "ball", "milk"],
    },
    {
      id: "home-umbrella",
      category: "home",
      feeling: "happy",
      prompt: "Rainy day! Find the umbrella!",
      praise: "Umbrella! Stay dry!",
      correctPool: ["umbrella"],
      wrongPool: ["hat", "shoes", "sun", "cake"],
    },
    {
      id: "out-flower",
      category: "playground",
      feeling: "happy",
      prompt: "Pretty flower! Find the flower!",
      praise: "Flower! So pretty!",
      correctPool: ["flower"],
      wrongPool: ["tree", "car", "cookie", "key"],
    },
    {
      id: "sky-cloud",
      category: "playground",
      feeling: "happy",
      prompt: "In the sky! Find the cloud!",
      praise: "Cloud! Soft sky!",
      correctPool: ["cloud"],
      wrongPool: ["sun", "moon", "ball", "door"],
    },
    {
      id: "sky-star",
      category: "playground",
      feeling: "happy",
      prompt: "Twinkle at night! Find the star!",
      praise: "Star! Twinkle!",
      correctPool: ["star"],
      wrongPool: ["moon", "sun", "car", "soap"],
    },
    {
      id: "fun-gift",
      category: "feelings",
      feeling: "love",
      prompt: "A present! Find the gift!",
      praise: "Gift! For you!",
      correctPool: ["gift"],
      wrongPool: ["bag", "ball", "soap", "bone"],
    },
    {
      id: "fun-camera",
      category: "home",
      feeling: "happy",
      prompt: "Take a photo! Find the camera!",
      praise: "Camera! Smile!",
      correctPool: ["camera"],
      wrongPool: ["phone", "TV", "book", "cake"],
    },
    {
      id: "food-orange-vs-ball",
      category: "food",
      feeling: "hungry",
      prompt: "Fruit to eat! Orange or ball?",
      praise: "Orange! We eat fruit!",
      correctPool: ["orange"],
      wrongPool: ["ball", "car", "key"],
    },
    {
      id: "go-plane-vs-ship",
      category: "playground",
      feeling: "happy",
      prompt: "Flies in the sky! Plane or ship?",
      praise: "Plane! In the sky!",
      correctPool: ["plane"],
      wrongPool: ["ship", "bike", "bed"],
    },
    {
      id: "go-ship-vs-car",
      category: "playground",
      feeling: "happy",
      prompt: "Goes on water! Ship or car?",
      praise: "Ship! On the water!",
      correctPool: ["ship"],
      wrongPool: ["car", "bus", "cake"],
    },
    {
      id: "food-watermelon-big",
      category: "food",
      feeling: "hungry",
      prompt: "{name} wants big fruit! Watermelon!",
      praise: "Big watermelon!",
      correctPool: ["watermelon"],
      wrongPool: ["grape", "strawberry", "phone", "hat"],
    },
    {
      id: "treat-fish-plane",
      category: "treats",
      feeling: "hungry",
      prompt: "Sea food treat! Find fish!",
      praise: "Fish! Yummy treat!",
      correctPool: ["fish"],
      wrongPool: ["plane", "bone", "cookie", "bus"],
      animals: ["cat", "shark"],
    },
    {
      id: "adv-plane",
      category: "playground",
      feeling: "happy",
      prompt: "We fly far away. What do we take?",
      praise: "A plane! Bye-bye ground!",
      correctPool: ["plane"],
      wrongPool: ["bike", "chair", "cup", "grape", "key"],
      minLevel: 3,
    },
    {
      id: "adv-ship",
      category: "playground",
      feeling: "happy",
      prompt: "Across the sea. What do we ride?",
      praise: "A ship! Hello waves!",
      correctPool: ["ship"],
      wrongPool: ["train", "bus", "bed", "cake", "lamp"],
      minLevel: 3,
    },
    {
      id: "adv-umbrella-rain",
      category: "home",
      feeling: "happy",
      prompt: "It is raining. What do we need?",
      praise: "Umbrella! Stay dry!",
      correctPool: ["umbrella"],
      wrongPool: ["sun", "ice-cream", "bike", "pizza", "star"],
      minLevel: 3,
    },
    {
      id: "adv-fruit-mix",
      category: "food",
      feeling: "hungry",
      prompt: "Healthy fruit snack. Find watermelon!",
      praise: "Watermelon! Healthy choice!",
      correctPool: ["watermelon"],
      wrongPool: ["pizza", "cake", "cookie", "bone", "car"],
      minLevel: 3,
    },
    // —— clothes ——
    {
      id: "cloth-dress",
      category: "home",
      feeling: "happy",
      prompt: "Pretty dress! Find the dress!",
      praise: "Dress! So pretty!",
      correctPool: ["dress"],
      wrongPool: ["pants", "shirt", "ball", "car"],
    },
    {
      id: "cloth-pants",
      category: "home",
      feeling: "happy",
      prompt: "Find the pants!",
      praise: "Pants! On your legs!",
      correctPool: ["pants"],
      wrongPool: ["dress", "hat", "apple", "soap"],
    },
    {
      id: "cloth-shirt",
      category: "home",
      feeling: "happy",
      prompt: "Find the shirt!",
      praise: "Shirt! Nice and soft!",
      correctPool: ["shirt"],
      wrongPool: ["pants", "shoes", "cookie", "moon"],
    },
    {
      id: "cloth-coat",
      category: "home",
      feeling: "sad",
      prompt: "Cold day! Find the jacket!",
      praise: "Jacket! Warm warm!",
      correctPool: ["coat"],
      wrongPool: ["shorts", "ice-cream", "ball", "fish"],
    },
    {
      id: "cloth-socks",
      category: "home",
      feeling: "happy",
      prompt: "On your feet! Find socks!",
      praise: "Socks! Cozy toes!",
      correctPool: ["socks"],
      wrongPool: ["gloves", "hat", "milk", "car"],
    },
    {
      id: "cloth-gloves",
      category: "home",
      feeling: "sad",
      prompt: "Cold hands! Find gloves!",
      praise: "Gloves! Warm hands!",
      correctPool: ["gloves"],
      wrongPool: ["socks", "banana", "slide", "book"],
    },
    {
      id: "cloth-scarf",
      category: "home",
      feeling: "sad",
      prompt: "Warm neck! Find the scarf!",
      praise: "Scarf! Snug snug!",
      correctPool: ["scarf"],
      wrongPool: ["hat", "shorts", "pizza", "bike"],
    },
    {
      id: "cloth-shorts",
      category: "home",
      feeling: "happy",
      prompt: "Hot day! Find shorts!",
      praise: "Shorts! Cool legs!",
      correctPool: ["shorts"],
      wrongPool: ["coat", "scarf", "boots", "moon"],
    },
    {
      id: "cloth-cap",
      category: "home",
      feeling: "happy",
      prompt: "Sunny head! Find the cap!",
      praise: "Cap! Shade on head!",
      correctPool: ["cap"],
      wrongPool: ["boots", "socks", "cake", "ship"],
    },
    {
      id: "cloth-boots",
      category: "home",
      feeling: "happy",
      prompt: "Rainy walk! Find boots!",
      praise: "Boots! Stomp stomp!",
      correctPool: ["boots"],
      wrongPool: ["cap", "dress", "juice", "plane"],
    },
    {
      id: "cloth-glasses",
      category: "home",
      feeling: "happy",
      prompt: "Help eyes see! Find glasses!",
      praise: "Glasses! Clear look!",
      correctPool: ["glasses"],
      wrongPool: ["hat", "phone", "ball", "egg"],
    },
    {
      id: "cloth-shoes-2",
      category: "home",
      feeling: "happy",
      prompt: "Ready to walk! Find shoes!",
      praise: "Shoes! Step step!",
      correctPool: ["shoes"],
      wrongPool: ["socks", "hat", "coat", "grape"],
    },
    {
      id: "cloth-dress-vs-pants",
      category: "home",
      feeling: "happy",
      prompt: "A dress to wear! Dress or pants?",
      praise: "Dress!",
      correctPool: ["dress"],
      wrongPool: ["pants", "bus", "tree"],
    },
    {
      id: "cloth-coat-vs-shorts",
      category: "home",
      feeling: "sad",
      prompt: "It is cold! Jacket or shorts?",
      praise: "Jacket! Stay warm!",
      correctPool: ["coat"],
      wrongPool: ["shorts", "ice-cream", "slide"],
    },
    {
      id: "adv-cold-coat",
      category: "home",
      feeling: "sad",
      prompt: "Snow outside. What keeps us warm?",
      praise: "A jacket! Bundle up!",
      correctPool: ["coat"],
      wrongPool: ["shorts", "ice-cream", "dress", "ball", "shirt"],
      minLevel: 3,
    },
    {
      id: "adv-wear-dress",
      category: "home",
      feeling: "happy",
      prompt: "Party clothes! Find the dress!",
      praise: "Dress for the party!",
      correctPool: ["dress"],
      wrongPool: ["boots", "gloves", "truck", "rice", "key"],
      minLevel: 3,
    },
  ];

  const el = {
    title: document.getElementById("screen-title"),
    pick: document.getElementById("screen-pick"),
    level: document.getElementById("screen-level"),
    category: document.getElementById("screen-category"),
    play: document.getElementById("screen-play"),
    celebrate: document.getElementById("screen-celebrate"),
    stickers: document.getElementById("screen-stickers"),
    musicLib: document.getElementById("screen-music"),
    settings: document.getElementById("screen-settings"),
    btnModePlay: document.getElementById("btn-mode-play"),
    btnModePractice: document.getElementById("btn-mode-practice"),
    btnStickers: document.getElementById("btn-stickers"),
    btnMusicLib: document.getElementById("btn-music-lib"),
    btnSettings: document.getElementById("btn-settings"),
    btnSettingsBack: document.getElementById("btn-settings-back"),
    btnVoiceTest: document.getElementById("btn-voice-test"),
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
    btnCategoryBack: document.getElementById("btn-category-back"),
    categoryGrid: document.getElementById("category-grid"),
    btnPracAnimal: document.getElementById("btn-prac-animal"),
    btnPracLevel: document.getElementById("btn-prac-level"),
    btnPracCategory: document.getElementById("btn-prac-category"),
    btnSay: document.getElementById("btn-say"),
    btnMusic: document.getElementById("btn-music"),
    btnMusicPlay: document.getElementById("btn-music-play"),
    playModeDesc: document.getElementById("play-mode-desc"),
    settingsSummary: document.getElementById("settings-summary"),
    settingsVoiceName: document.getElementById("settings-voice-name"),
    unlockNote: document.getElementById("unlock-note"),
    optPlayLength: document.getElementById("opt-play-length"),
    optUnlockMin: document.getElementById("opt-unlock-min"),
    optVoiceStyle: document.getElementById("opt-voice-style"),
    voiceList: document.getElementById("voice-list"),
    voiceListCount: document.getElementById("voice-list-count"),
    animalGrid: document.getElementById("animal-grid"),
    levelGrid: document.getElementById("level-grid"),
    levelChip: document.getElementById("level-chip"),
    categoryChip: document.getElementById("category-chip"),
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
    category: "all",
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
    settings: Object.assign({}, DEFAULT_SETTINGS),
    /** @type {SpeechSynthesisVoice | null} */
    chosenVoice: null,
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

  function playQuestions() {
    return state.settings.playQuestions === 5 ? 5 : 10;
  }

  function unlockMin() {
    const q = playQuestions();
    if (q === 5) return 5;
    return state.settings.unlockMin === 5 ? 5 : 8;
  }

  function loadSettings() {
    try {
      const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (!raw) {
        state.settings = Object.assign({}, DEFAULT_SETTINGS);
        return;
      }
      const data = JSON.parse(raw);
      const styles = ["kid", "high", "soft", "default", "custom"];
      state.settings = {
        playQuestions: data.playQuestions === 5 ? 5 : 10,
        unlockMin: data.unlockMin === 5 ? 5 : 8,
        voiceStyle: styles.indexOf(data.voiceStyle) >= 0 ? data.voiceStyle : "kid",
        voiceURI: typeof data.voiceURI === "string" ? data.voiceURI : "",
      };
      // 5-question mode always unlocks at 5
      if (state.settings.playQuestions === 5) state.settings.unlockMin = 5;
    } catch (_) {
      state.settings = Object.assign({}, DEFAULT_SETTINGS);
    }
  }

  function saveSettings() {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(state.settings));
    } catch (_) {}
  }

  function applySettingsToUI() {
    const q = playQuestions();
    const u = unlockMin();

    if (el.optPlayLength) {
      el.optPlayLength.querySelectorAll("[data-questions]").forEach((btn) => {
        btn.classList.toggle("active", Number(btn.dataset.questions) === q);
      });
    }
    if (el.optUnlockMin) {
      el.optUnlockMin.querySelectorAll("[data-unlock]").forEach((btn) => {
        const val = Number(btn.dataset.unlock);
        btn.classList.toggle("active", val === u);
        // Hide invalid combo: unlock 8 when play is 5
        btn.hidden = q === 5 && val === 8;
        btn.disabled = q === 5 && val === 8;
      });
    }
    if (el.optVoiceStyle) {
      el.optVoiceStyle.querySelectorAll("[data-voice]").forEach((btn) => {
        const active =
          state.settings.voiceStyle === "custom"
            ? false
            : btn.dataset.voice === state.settings.voiceStyle;
        btn.classList.toggle("active", active);
      });
    }
    if (el.playModeDesc) {
      el.playModeDesc.textContent = `${q} questions · score bar`;
    }
    if (el.settingsSummary) {
      el.settingsSummary.textContent = `Play ${q} · unlock at ${u}+ · ${voiceStyleLabel()}`;
    }
    if (el.unlockNote) {
      el.unlockNote.textContent =
        q === 5
          ? "5-question Play: unlock prize with 5 correct"
          : "Need this many correct in one 10-question Play run";
    }
    const bookSubs = document.querySelectorAll(".sticker-book-sub");
    bookSubs.forEach((node) => {
      if (node.closest("#screen-settings")) return;
      node.textContent = `Play ${q} · unlock at ${u}+`;
    });
    updateVoiceNameLabel();
  }

  function voiceStyleLabel() {
    const style = state.settings.voiceStyle || "kid";
    if (style === "custom" && state.chosenVoice) {
      return shortVoiceName(state.chosenVoice);
    }
    const m = VOICE_PRESETS[style];
    return (m && m.label) || "Kid girl";
  }

  function shortVoiceName(v) {
    if (!v) return "Unknown";
    let n = v.name || "Voice";
    n = n.replace(/^Microsoft\s+/i, "").replace(/\s+Online\s*\(Natural\)\s*/i, " ");
    n = n.replace(/\s*-\s*English\s*\(.*\)\s*/i, "").trim();
    if (n.length > 28) n = n.slice(0, 26) + "…";
    return n;
  }

  function getAllVoices() {
    if (!window.speechSynthesis) return [];
    return window.speechSynthesis.getVoices() || [];
  }

  function getEnglishVoices() {
    const all = getAllVoices();
    const en = all.filter((v) => /^en\b/i.test(v.lang || ""));
    return en.length ? en : all.slice();
  }

  function isLikelyFemale(v) {
    const name = (v.name || "").toLowerCase();
    if (/female|woman|girl|samantha|victoria|karen|moira|tessa|fiona|zira|susan|hazel|serena|allison|ava|kathy|princess|child|kids|junior|ivy|joanna|kendra|kimberly|salli|emma|amy|jenny|aria|natasha|linda|heather|catherine|veena|raveena|google uk english female|google us english|microsoft jenny|microsoft aria|microsoft sara|microsoft michelle|siri/.test(name)) {
      return true;
    }
    if (/male|david|mark|daniel|james|george|tom|fred|ravi|thomas|richard|google uk english male|microsoft david|microsoft mark|microsoft guy|microsoft steffan/.test(name)) {
      return false;
    }
    // Many mobile voices: prefer non-explicitly-male
    return true;
  }

  function scoreVoice(v, style) {
    const name = (v.name || "").toLowerCase();
    const lang = (v.lang || "").toLowerCase();
    let score = 0;
    if (/^en\b/.test(lang)) score += 30;
    if (/en-us|en_us/.test(lang)) score += 8;
    if (/en-gb|en_gb|en-au|en_au|en-ie|en_ie/.test(lang)) score += 4;
    if (isLikelyFemale(v)) score += 25;
    else score -= 20;
    if (v.localService) score += 3;

    if (style === "kid") {
      if (/child|kids|junior|girl|princess|ivy|salli|joanna/.test(name)) score += 20;
      if (/zira|jenny|aria|samantha|karen|tessa|fiona|salli/.test(name)) score += 12;
      if (/natural|neural|online/.test(name)) score += 4;
    } else if (style === "high") {
      // Prefer lighter / brighter named voices; different from soft
      if (/zira|jenny|aria|ivy|salli|karen|tessa/.test(name)) score += 14;
      if (/susan|hazel|victoria|moira|serena/.test(name)) score -= 4;
    } else if (style === "soft") {
      if (/samantha|victoria|moira|serena|susan|hazel|fiona|karen|catherine|linda/.test(name)) score += 16;
      if (/zira|jenny|ivy|salli/.test(name)) score -= 2;
    } else if (style === "default") {
      if (v.default) score += 40;
      score += 5;
    }
    return score;
  }

  function rankVoices(style) {
    return getEnglishVoices()
      .map((v) => ({ v, s: scoreVoice(v, style) }))
      .sort((a, b) => b.s - a.s);
  }

  /** Pick different auto voices per style when possible */
  function pickVoiceForStyle(style) {
    const voices = getEnglishVoices();
    if (!voices.length) return null;

    if (style === "custom" && state.settings.voiceURI) {
      const hit = getAllVoices().find((v) => v.voiceURI === state.settings.voiceURI);
      if (hit) return hit;
    }

    if (style === "default") {
      return (
        voices.find((v) => v.default) ||
        voices.find((v) => /en-us/i.test(v.lang)) ||
        voices[0]
      );
    }

    const kidRanked = rankVoices("kid");
    const highRanked = rankVoices("high");
    const softRanked = rankVoices("soft");
    const kidTop = kidRanked[0] && kidRanked[0].v;
    const kidURI = kidTop && kidTop.voiceURI;

    if (style === "kid") return kidTop;

    if (style === "high") {
      const alt = highRanked.find((x) => x.v.voiceURI !== kidURI);
      return (alt && alt.v) || (highRanked[0] && highRanked[0].v) || voices[0];
    }

    if (style === "soft") {
      const highTop = highRanked.find((x) => x.v.voiceURI !== kidURI);
      const highURI = highTop && highTop.v.voiceURI;
      const alt = softRanked.find(
        (x) => x.v.voiceURI !== kidURI && x.v.voiceURI !== highURI
      );
      return (
        (alt && alt.v) ||
        (highTop && highTop.v) ||
        (softRanked[0] && softRanked[0].v) ||
        voices[0]
      );
    }

    return voices[0];
  }

  function getVoicePreset() {
    const style = state.settings.voiceStyle || "kid";
    return VOICE_PRESETS[style] || VOICE_PRESETS.kid;
  }

  function refreshChosenVoice() {
    state.chosenVoice = pickVoiceForStyle(state.settings.voiceStyle);
    updateVoiceNameLabel();
    renderVoiceList();
  }

  function updateVoiceNameLabel() {
    if (!el.settingsVoiceName) return;
    const preset = getVoicePreset();
    const pitch = preset.pitch.toFixed(2);
    const rate = preset.rate.toFixed(2);
    if (state.chosenVoice) {
      el.settingsVoiceName.textContent =
        `Now: ${shortVoiceName(state.chosenVoice)} · pitch ${pitch} · speed ${rate}`;
    } else {
      const n = getAllVoices().length;
      el.settingsVoiceName.textContent =
        n === 0
          ? "Voices loading… tap Test again in a second"
          : `Pitch ${pitch} · speed ${rate} (picking voice…)`;
    }
  }

  function renderVoiceList() {
    if (!el.voiceList) return;
    const voices = getEnglishVoices();
    if (el.voiceListCount) {
      el.voiceListCount.textContent = voices.length
        ? `${voices.length} English voices on this device`
        : "No voices yet — open Settings after a tap, or wait 1s";
    }
    el.voiceList.innerHTML = "";
    if (!voices.length) {
      const empty = document.createElement("p");
      empty.className = "voice-list-empty";
      empty.textContent = "Tap anywhere, then reopen Settings to load voices.";
      el.voiceList.appendChild(empty);
      return;
    }

    // Female-ish first
    const sorted = voices.slice().sort((a, b) => {
      const fa = isLikelyFemale(a) ? 0 : 1;
      const fb = isLikelyFemale(b) ? 0 : 1;
      if (fa !== fb) return fa - fb;
      return (a.name || "").localeCompare(b.name || "");
    });

    sorted.forEach((v) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "voice-pick-btn";
      const selected =
        state.settings.voiceStyle === "custom" &&
        state.settings.voiceURI === v.voiceURI;
      if (selected) btn.classList.add("active");
      btn.dataset.uri = v.voiceURI;
      const tag = isLikelyFemale(v) ? "♀" : "♂";
      btn.innerHTML =
        `<span class="voice-pick-name">${tag} ${shortVoiceName(v)}</span>` +
        `<span class="voice-pick-lang">${v.lang || ""}</span>`;
      btn.addEventListener("click", () => {
        state.settings.voiceStyle = "custom";
        state.settings.voiceURI = v.voiceURI;
        state.chosenVoice = v;
        saveSettings();
        applySettingsToUI();
        renderVoiceList();
        sfxClick();
        speak("Yay! This is my voice. Hello little friend!");
      });
      el.voiceList.appendChild(btn);
    });
  }

  function openSettings() {
    window.speechSynthesis && window.speechSynthesis.cancel();
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
    }
    refreshChosenVoice();
    applySettingsToUI();
    showScreen("settings");
    sfxClick();
    setTimeout(() => refreshChosenVoice(), 100);
  }
  function showScreen(name) {
    const map = {
      title: el.title,
      pick: el.pick,
      level: el.level,
      category: el.category,
      play: el.play,
      celebrate: el.celebrate,
      stickers: el.stickers,
      music: el.musicLib,
      settings: el.settings,
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
    if (rights < unlockMin()) return null;

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
        el.musicHint.textContent = `Play mode · ${unlockMin()}+ correct · random sticker or song (${have}/${total} songs)`;
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
    sfxClick();
    renderMusicLibrary();
  }

  function openMusicLibrary() {
    window.speechSynthesis && window.speechSynthesis.cancel();
    closeStickerViewer();
    renderMusicLibrary();
    showScreen("music");
    sfxClick();
  }

  function resetMusicBook() {
    const { have } = musicCount();
    if (have === 0) {
      sfxClick();
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
    sfxClick();
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
    sfxClick();
  }

  function closeStickerViewer() {
    if (!el.stickerViewer) return;
    const wasOpen = !el.stickerViewer.hidden;
    el.stickerViewer.hidden = true;
    el.stickerViewer.classList.remove("open");
    if (el.stickerViewerImg) {
      el.stickerViewerImg.removeAttribute("src");
      el.stickerViewerImg.alt = "";
    }
    if (wasOpen) sfxClick();
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
        el.stickerHint.textContent = `Play ${unlockMin()}+ correct · random sticker or song (${have}/${total} stickers)`;
      }
    }
    updateStickerProgressUI();
  }

  function resetStickerBook() {
    const { have } = stickerCount();
    if (have === 0) {
      sfxClick();
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
    sfxClick();
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
    sfxClick();
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
    if (el.categoryChip) el.categoryChip.textContent = categoryLabel();
    if (el.choices) {
      el.choices.dataset.level = String(state.level);
      el.choices.classList.toggle("choices-l2", state.level === 2);
      el.choices.classList.toggle("choices-l3", state.level === 3);
    }
    if (el.play) {
      el.play.classList.toggle("is-practice", !isPlayMode());
      el.play.classList.toggle("is-play-mode", isPlayMode());
    }
    // Play: score bar only · Practice: counter + friend/level tools only
    const playOn = isPlayMode();
    if (el.resultBarWrap) {
      el.resultBarWrap.hidden = !playOn;
      el.resultBarWrap.setAttribute("aria-hidden", playOn ? "false" : "true");
    }
    if (el.practiceHud) {
      el.practiceHud.hidden = playOn;
      el.practiceHud.setAttribute("aria-hidden", playOn ? "true" : "false");
    }
    if (el.practiceTools) {
      el.practiceTools.hidden = playOn;
      el.practiceTools.setAttribute("aria-hidden", playOn ? "true" : "false");
    }
  }

  function initResultBar() {
    state.results = Array.from({ length: playQuestions() }, () => "pending");
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
      el.resultCount.textContent = `${done} / ${playQuestions()} · ✓${rights}`;
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

  /** Short UI tap / click feel */
  function sfxClick() {
    tone(880, 0.045, "sine", 0.055);
    setTimeout(() => tone(1174.66, 0.04, "triangle", 0.035), 28);
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

    // Always refresh voice list; Chrome often returns [] until after a gesture
    const voicesNow = getAllVoices();
    if (voicesNow.length && !state.chosenVoice) refreshChosenVoice();
    else if (voicesNow.length && state.settings.voiceStyle === "custom" && state.settings.voiceURI) {
      const hit = voicesNow.find((v) => v.voiceURI === state.settings.voiceURI);
      if (hit) state.chosenVoice = hit;
    } else if (voicesNow.length && !state.chosenVoice) {
      state.chosenVoice = pickVoiceForStyle(state.settings.voiceStyle);
    }

    const preset = getVoicePreset();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = (state.chosenVoice && state.chosenVoice.lang) || "en-US";
    // Big gaps so presets are obviously different (range 0–2 for pitch)
    u.pitch = Math.max(0.1, Math.min(2, preset.pitch));
    u.rate = Math.max(0.1, Math.min(2, preset.rate));
    u.volume = 1;
    if (state.chosenVoice) {
      try {
        u.voice = state.chosenVoice;
      } catch (_) {}
    }

    // iOS: cancel then speak on next tick; assign voice again
    setTimeout(() => {
      try {
        if (state.chosenVoice) u.voice = state.chosenVoice;
        window.speechSynthesis.speak(u);
      } catch (_) {}
    }, 40);
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

  function categoryLabel() {
    const cat = CATEGORIES[state.category] || CATEGORIES.all;
    return cat.label;
  }

  function resolveRoundCategory(r) {
    if (r.category) return r.category;
    if (r.animals && r.animals.length) return "treats";
    const id = String(r.id || "");
    const feeling = String(r.feeling || "");

    // Animal-specific treats
    if (/cat-fish|dog-bone|bunny-carrot|pig-|shark-|bear-/.test(id)) return "treats";

    // Explicit feelings practice / emotion rounds
    if (
      /^feel-/.test(id) ||
      /emotion|angry|scared|love|surprised/.test(id) ||
      id === "sad" ||
      id === "sad-hug-soft"
    ) {
      return "feelings";
    }

    // Home / routines / furniture
    if (
      /^home-/.test(id) ||
      /^adv-sit|^adv-watch|^adv-read|^adv-open|^adv-look|^adv-light|^adv-call|^adv-sit-not/.test(id) ||
      /night-bed|cold-hat|cold-coat|cold-day|wash-soap|teeth-brush|dirty|brush$|walk-shoes|sleepy$|sleepy-moon|^cloth-/.test(id)
    ) {
      return "home";
    }

    // Playground / outdoor play / vehicles
    if (
      /^play-|^go-/.test(id) ||
      /^adv-merry|^adv-slide|^adv-park|^adv-drive|^adv-playground|^adv-plane|^adv-ship/.test(id) ||
      /find-ball|play-or-sleep|happy-ball|happy-play|play-toy|morning-sun|day-sun|plane|ship|train|bus|bike|taxi|truck|rocket|helicopter|flower|cloud|star/.test(id)
    ) {
      return "playground";
    }

    // Food & drink
    if (
      /^food-/.test(id) ||
      /hungry|thirsty|drink|find-milk|find-banana|find-apple|adv-ice|adv-fruit|fruit|cookie|water-only|orange|watermelon|grape|strawberry|pear|pizza|cake|juice|rice|egg/.test(id)
    ) {
      return "food";
    }

    if (feeling === "hungry" || feeling === "thirsty") return "food";
    if (feeling === "sleepy") return "home";
    if (
      feeling === "sad" ||
      feeling === "angry" ||
      feeling === "scared" ||
      feeling === "love" ||
      feeling === "surprised"
    ) {
      return "feelings";
    }
    if (feeling === "happy") return "playground";
    return "all";
  }

  function availableRounds() {
    return ROUND_TEMPLATES.filter((r) => {
      if (r.animals && !r.animals.includes(state.animalId)) return false;
      const min = r.minLevel || 1;
      if (state.level < min) return false;
      if (state.category && state.category !== "all") {
        if (resolveRoundCategory(r) !== state.category) return false;
      }
      return true;
    });
  }

  function buildRound() {
    clearMotion();
    let pool = availableRounds();
    // If category is too narrow for this animal/level, fall back to All
    if (!pool.length && state.category !== "all") {
      const saved = state.category;
      state.category = "all";
      pool = availableRounds();
      state.category = saved;
    }
    if (!pool.length) {
      pool = ROUND_TEMPLATES.filter((r) => {
        if (r.animals && !r.animals.includes(state.animalId)) return false;
        const min = r.minLevel || 1;
        return state.level >= min;
      });
    }
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
        if (idx < playQuestions()) {
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
          if (state.questionIndex >= playQuestions()) {
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
    const total = playQuestions();
    const need = unlockMin();

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
      const almost = total === 5 ? 4 : 7;
      el.celebrateTitle.textContent =
        rights === total ? "Perfect!" : rights >= almost ? "Great job!" : "Nice try!";
    }

    const reward = tryUnlockRewardFromPlay(rights);
    showUnlockOnCelebrate(reward);

    if (reward && reward.type === "sticker") {
      el.celebrateMsg.textContent = `${name} is proud! ${rights}/${total} · New sticker: ${reward.item.name}!`;
    } else if (reward && reward.type === "music") {
      el.celebrateMsg.textContent = `${name} is proud! ${rights}/${total} · New song: ${reward.item.label}!`;
      playSelectedTrack(reward.item);
    } else if (rights >= need && !nextLockedSticker() && !nextLockedMusic()) {
      el.celebrateMsg.textContent = `${name} is proud! ${rights}/${total}. Everything unlocked!`;
    } else if (rights < need) {
      el.celebrateMsg.textContent = `${name} is proud! ${rights}/${total}. Get ${need}+ for a prize!`;
    } else {
      el.celebrateMsg.textContent = `${name} is proud! You got ${rights} out of ${total}.`;
    }
  }

  function openModeHome() {
    window.speechSynthesis && window.speechSynthesis.cancel();
    showScreen("title");
  }

  function selectMode(mode) {
    ensureAudio();
    state.mode = mode === "practice" ? "practice" : "play";
    sfxClick();
    openPick();
  }

  function openPick() {
    ensureAudio();
    window.speechSynthesis && window.speechSynthesis.cancel();
    showScreen("pick");
    sfxClick();
  }

  function openLevel() {
    ensureAudio();
    window.speechSynthesis && window.speechSynthesis.cancel();
    showScreen("level");
    const q = playQuestions();
sfxClick();
  }

  function startGameWithAnimal(animalId) {
    ensureAudio();
    setAnimal(animalId);
    openCategory();
  }

  function openCategory() {
    ensureAudio();
    window.speechSynthesis && window.speechSynthesis.cancel();
    showScreen("category");
    sfxClick();
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
    if (state.musicOn) startMusic(true);
    showScreen("play");
    if (el.scoreSummary) el.scoreSummary.hidden = true;
    sfxClick();
    setTimeout(() => buildRound(), 500);
  }

  function goHome() {
    window.speechSynthesis && window.speechSynthesis.cancel();
    showScreen("title");
    sfxClick();
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
  if (el.btnSettings) {
    el.btnSettings.addEventListener("click", openSettings);
  }
  if (el.btnSettingsBack) {
    el.btnSettingsBack.addEventListener("click", () => {
      applySettingsToUI();
      goHome();
    });
  }
  if (el.btnVoiceTest) {
    el.btnVoiceTest.addEventListener("click", () => {
      if (window.speechSynthesis) window.speechSynthesis.getVoices();
      refreshChosenVoice();
      const style = state.settings.voiceStyle || "kid";
      if (style === "kid") speak("Yay! Kid girl voice. One banana two apples!");
      else if (style === "high") speak("High pitch! Hello baby! Find the ball!");
      else if (style === "soft") speak("Soft voice. Time for a gentle story.");
      else if (style === "custom") speak("This is the voice you picked. Hello little friend!");
      else speak("Normal default voice. Hello.");
    });
  }
  if (el.optPlayLength) {
    el.optPlayLength.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-questions]");
      if (!btn) return;
      const q = Number(btn.dataset.questions);
      if (q !== 5 && q !== 10) return;
      state.settings.playQuestions = q;
      if (q === 5) state.settings.unlockMin = 5;
      saveSettings();
      applySettingsToUI();
      sfxClick();
    });
  }
  if (el.optUnlockMin) {
    el.optUnlockMin.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-unlock]");
      if (!btn || btn.disabled || btn.hidden) return;
      const u = Number(btn.dataset.unlock);
      if (u !== 5 && u !== 8) return;
      if (playQuestions() === 5 && u === 8) return;
      state.settings.unlockMin = u;
      saveSettings();
      applySettingsToUI();
      sfxClick();
    });
  }
  if (el.optVoiceStyle) {
    el.optVoiceStyle.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-voice]");
      if (!btn) return;
      const style = btn.dataset.voice;
      if (["kid", "high", "soft", "default"].indexOf(style) < 0) return;
      state.settings.voiceStyle = style;
      if (style !== "custom") state.settings.voiceURI = "";
      saveSettings();
      refreshChosenVoice();
      applySettingsToUI();
      sfxClick();
      // Different sample lines so pitch/speed difference is obvious
      if (style === "kid") speak("Yay! I am the kid girl voice. Let's play!");
      else if (style === "high") speak("Hi! This is the high pitch voice. Hello baby!");
      else if (style === "soft") speak("Hello. This is the soft gentle voice.");
      else speak("This is the normal default voice.");
    });
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
      sfxClick();
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
    el.btnLevelBack.addEventListener("click", () => {
      if (state.practiceSwap && !isPlayMode()) {
        state.practiceSwap = false;
        showScreen("play");
        sfxClick();
        return;
      }
      openCategory();
    });
  }
  if (el.btnPracAnimal) {
    el.btnPracAnimal.addEventListener("click", () => {
      window.speechSynthesis && window.speechSynthesis.cancel();
      state.practiceSwap = true;
      showScreen("pick");
      sfxClick();
    });
  }
  if (el.btnPracLevel) {
    el.btnPracLevel.addEventListener("click", () => {
      window.speechSynthesis && window.speechSynthesis.cancel();
      state.practiceSwap = true;
      showScreen("level");
      sfxClick();
    });
  }
  if (el.btnPracCategory) {
    el.btnPracCategory.addEventListener("click", () => {
      window.speechSynthesis && window.speechSynthesis.cancel();
      state.practiceSwap = true;
      showScreen("category");
      sfxClick();
    });
  }
  if (el.btnCategoryBack) {
    el.btnCategoryBack.addEventListener("click", () => {
      if (state.practiceSwap && !isPlayMode()) {
        state.practiceSwap = false;
        showScreen("play");
        sfxClick();
        return;
      }
      openPick();
    });
  }
  if (el.categoryGrid) {
    el.categoryGrid.addEventListener("click", (e) => {
      const card = e.target.closest("[data-category]");
      if (!card) return;
      const cat = card.dataset.category;
      if (!cat || !(cat in CATEGORIES)) return;
      state.category = cat;
      sfxClick();
      if (state.practiceSwap && !isPlayMode()) {
        state.practiceSwap = false;
        updateLevelChip();
        showScreen("play");
        setTimeout(() => buildRound(), 400);
        return;
      }
      openLevel();
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
        sfxClick();
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
  el.btnMusic.addEventListener("click", () => { sfxClick(); setMusic(!state.musicOn); });
  el.btnMusicPlay.addEventListener("click", () => { sfxClick(); setMusic(!state.musicOn); });

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
      sfxClick();
      setTimeout(() => buildRound(), 500);
      return;
    }
    sfxClick();
    startGameWithAnimal(id);
  });

  // First user gesture unlocks WebAudio + speech on iPad
  let audioUnlocked = false;
  const unlockOnce = () => {
    if (audioUnlocked) return;
    audioUnlocked = true;
    unlockAudio();
    refreshChosenVoice();
    document.removeEventListener("touchstart", unlockOnce, true);
    document.removeEventListener("pointerdown", unlockOnce, true);
  };
  document.addEventListener("touchstart", unlockOnce, { capture: true, passive: true });
  document.addEventListener("pointerdown", unlockOnce, { capture: true });

  if (isStandalone()) document.body.classList.add("ios-standalone");

  loadSettings();
  loadStickers();
  loadMusicUnlocks();
  refreshChosenVoice();
  applySettingsToUI();
  updateStickerProgressUI();
  updateMusicProgressUI();

  if (window.speechSynthesis) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      refreshChosenVoice();
    };
  }

  setAnimal("bunny");
  showScreen("title");
})();
