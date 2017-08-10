import {random, times} from 'underscore'

const faker = require('faker')

const scenesInitialState = times(11, (i) => {
  let scene = {}
  scene.orderIndex = i
  scene.title = faker.random.words()
  scene.description = faker.lorem.sentence(12)
  scene.imageStr = `${faker.image.imageUrl()}?${faker.random.number({min: 1, max: 1000})}`
  scene.characterImageStrs = times(random(1, 10), () => faker.fake("{{image.avatar}}"))
  return scene
})

function scenesReducer(state = scenesInitialState, action) {
  switch (action.type) {
    default:
      return state
  }
}

export default scenesReducer
