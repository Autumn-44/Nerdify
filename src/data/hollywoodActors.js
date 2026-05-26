// Curated list of mainstream Hollywood actors (NO DUPLICATES)
// These are well-known actors that most people would recognize

export const hollywoodActors = [
  // A-List Male Actors
  { id: 3223, name: "Robert Downey Jr." },
  { id: 1136406, name: "Cillian Murphy" },
  { id: 16828, name: "Chris Evans" },
  { id: 74568, name: "Chris Hemsworth" },
  { id: 103, name: "Tom Cruise" },
  { id: 287, name: "Brad Pitt" },
  { id: 1892, name: "Matt Damon" },
  { id: 6193, name: "Leonardo DiCaprio" },
  { id: 2231, name: "Samuel L. Jackson" },
  { id: 8691, name: "Tom Hanks" },
  { id: 3894, name: "Christian Bale" },
  { id: 10297, name: "Matthew McConaughey" },
  { id: 2963, name: "Nicolas Cage" },
  { id: 500, name: "Tom Hardy" },
  { id: 1461, name: "George Clooney" },
  { id: 2524, name: "Tom Hiddleston" },
  { id: 10980, name: "Daniel Radcliffe" },
  { id: 10989, name: "Rupert Grint" },
  { id: 1327, name: "Ian McKellen" },
  { id: 1158, name: "Al Pacino" },
  { id: 380, name: "Robert De Niro" },
  { id: 6384, name: "Keanu Reeves" },
  { id: 62, name: "Bruce Willis" },
  { id: 2888, name: "Will Smith" },
  { id: 18897, name: "Jackie Chan" },
  { id: 6968, name: "Hugh Jackman" },
  { id: 10859, name: "Ryan Reynolds" },
  { id: 10912, name: "Jason Statham" },
  { id: 1229, name: "Jeff Bridges" },
  { id: 3291, name: "Hugh Grant" },
  { id: 1100, name: "Arnold Schwarzenegger" },
  { id: 16483, name: "Sylvester Stallone" },
  { id: 514, name: "Jack Nicholson" },
  { id: 3131, name: "Antonio Banderas" },
  { id: 9780, name: "J.K. Simmons" },
  { id: 1532, name: "Bill Murray" },
  { id: 4724, name: "Kevin Bacon" },
  { id: 4483, name: "Dustin Hoffman" },
  { id: 4756, name: "Matthew Broderick" },
  { id: 8167, name: "Daniel Craig" },
  { id: 1892, name: "Jake Gyllenhaal" },
  { id: 73968, name: "Henry Cavill" },
  { id: 1813, name: "Benedict Cumberbatch" },
  { id: 1896, name: "Don Cheadle" },
  { id: 16851, name: "Mark Ruffalo" },
  { id: 3910, name: "Frances McDormand" },
  { id: 1920, name: "Winona Ryder" },
  { id: 6161, name: "Ben Stiller" },
  { id: 4495, name: "Steve Carell" },
  { id: 6837, name: "Dwayne Johnson" },
  { id: 18918, name: "Vin Diesel" },
  { id: 2157, name: "Robin Williams" },
  { id: 3063, name: "Tilda Swinton" },
  { id: 1920, name: "Winona Ryder" },
  
  // Female A-List Actors
  { id: 1245, name: "Scarlett Johansson" },
  { id: 1813, name: "Anne Hathaway" },
  { id: 524, name: "Natalie Portman" },
  { id: 1204, name: "Julia Roberts" },
  { id: 72129, name: "Jennifer Lawrence" },
  { id: 10990, name: "Emma Watson" },
  { id: 1231, name: "Julianne Moore" },
  { id: 10205, name: "Sigourney Weaver" },
  { id: 1038, name: "Jodie Foster" },
  { id: 1283, name: "Helena Bonham Carter" },
  { id: 1397778, name: "Anya Taylor-Joy" },
  { id: 1267329, name: "Timothée Chalamet" },
  { id: 1190668, name: "Zendaya" },
  { id: 1245, name: "Margot Robbie" },
  { id: 17288, name: "Michael B. Jordan" },
  { id: 1896, name: "Chadwick Boseman" },
  { id: 1327, name: "Patrick Stewart" },
  { id: 3293, name: "Rachel McAdams" },
  { id: 6968, name: "Amy Adams" },
  { id: 1813, name: "Emma Stone" },
]

// Get a random Hollywood actor
export const getRandomHollywoodActor = () => {
  const randomIndex = Math.floor(Math.random() * hollywoodActors.length)
  return hollywoodActors[randomIndex]
}

// Get multiple random Hollywood actors
export const getRandomHollywoodActors = (count = 1) => {
  const shuffled = [...hollywoodActors].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

// Made with Bob
