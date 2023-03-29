export const typeMatchup = {
    grass: {
        fire: .5,
        water: 2,
        normal: 1,
        grass: .5,
        fighting: 1
    },
    fire: {
        fire: .5,
        water: .5,
        normal: 1,
        grass: 2,
        fighting: 1
    },
    water: {
        fire: 2,
        water: .5,
        normal: 1,
        grass: .5,
        fighting: 1
    },
    normal: {
        fire: 1,
        water: 1,
        normal: 1,
        grass: 1,
        fighting: 1
    },
    fighting: {
        fire: 1,
        water: 1,
        normal: 2,
        grass: 1,
        fighting: 1
    }
}