// SAMPLE DATA ONLY. These are not real Missche listings: names, codes, prices, sizes,
// colours, measurements and pictures are all made up for demonstration.
const NUMBERS = ['One', 'Two', 'Three', 'Four', 'Five', 'Six']

const SAMPLES = [
  { price: 399, color: 'Rose', sizes: ['S', 'M'], categories: ['Birthday', 'Photoshoot'], featured: true,
    measurements: { Bust: '34 in', Waist: '27 in', Length: '56 in' } },
  { price: 599, color: 'Mauve', sizes: ['M'], categories: ['Wedding Guest', 'Special Occasions'], featured: true },
  { price: 899, color: 'Blush', sizes: ['S', 'M', 'L'], categories: ['Wedding Guest', 'Photoshoot'], featured: true },
  { price: 699, color: 'Charcoal', sizes: ['L'], categories: ['Graduation', 'Special Occasions'] },
  { price: 499, color: 'Sage', sizes: ['XS', 'S'], categories: ['Birthday', 'Wedding Guest'] },
  { price: 799, color: 'Dusty blue', sizes: ['M', 'L'], categories: ['Graduation', 'Photoshoot'] },
]

export const sampleDresses = SAMPLES.map((sample, index) => {
  const number = String(index + 1).padStart(2, '0')
  return {
    id: `sample-${number}`,
    code: `SAMPLE-${number}`,
    name: `Sample Dress ${NUMBERS[index]}`,
    description: 'Sample listing that shows how a dress page will look. The owner adds the real description and photographs.',
    featured: false,
    archived: false,
    isSample: true,
    measurements: null,
    images: [], // no pictures: samples are not real dresses
    ...sample,
  }
})
