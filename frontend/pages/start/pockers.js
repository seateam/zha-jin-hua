const points = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
const suits = ['Black', 'Red', 'Plum', 'Square']
// const pockers = ['Big-JOKER', 'Small-JOKER']
const pockers = []
for (const suit of suits) {
  for (const point of points) {
    pockers.push([suit, point])
  }
}
module.exports = pockers
