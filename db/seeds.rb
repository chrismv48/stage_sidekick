# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)


venue = Venue.create(
  name: 'Kara Harmon Productions',
  description: 'World class productions at a reasonable price'
)

production = Production.create(
  title: 'A Midsummers Night Dream',
  venue_id: venue.id,
  start_date: Time.zone.today + 3.months
)

job_titles = ['Producer', 'Director', 'Administration', 'Costume Designer', 'Lighting Technician', 'Sound Technician', 'Assistant Costume Designer', 'Wardrobe Supervisor']
scene_settings = ['Morning', 'Night', 'Afternoon', 'Sunset', 'Beach', 'Indoors']
departments = ['Production', 'Lighting', 'Costumes', 'Administration', 'Stage']
statuses = ['Full-time', 'Contractor', 'Part-time']
costume_item_types = ['Jeans', 'Shirt', 'Skirt', 'Dress', 'Shoes', 'Belt', 'Hat']

users = User.create(20.times.collect {|i| {
  first_name: Faker::Name.first_name,
  last_name: Faker::Name.last_name,
  email: Faker::Internet.email,
  # phone_number: Faker::PhoneNumber.cell_phone,
  phone_number: Faker::Base.numerify('(###) ###-####'),
  username: Faker::Internet.user_name,
  default_title: job_titles.sample
}})

roles = Role.create(users[0..14].map {|user| {
  user_id: user.id,
  first_name: user.first_name,
  last_name: user.last_name,
  production_id: production.id,
  venue_id: venue.id,
  title: user.default_title,
  department: departments.sample,
  status: statuses.sample,
  start_date: Faker::Date.between(2.years.ago, Date.today),
}})

roles.each do |role|
  Image.create({
                 imageable: role,
                 remote_image_src_url: "https://source.unsplash.com/collection/888877&sig=#{rand(1..1000)}",
                 primary: true
               })
end

actors = Actor.create(users[15..-1].map {|user| {
  user_id: user.id,
  first_name: user.first_name,
  last_name: user.last_name,
  production_id: production.id,
  venue_id: venue.id,
  title: 'Actor',
  department: 'Acting',
  status: 'Contractor',
  start_date: Faker::Date.between(2.years.ago, Date.today),
}})

actors.each do |actor|
  Image.create({
                 imageable: actor,
                 remote_image_src_url: "https://source.unsplash.com/collection/888877&sig=#{rand(1..1000)}",
                 primary: true
               })
end

actors.each do |actor|
  Image.create({
                 imageable: actor,
                 remote_image_src_url: "https://source.unsplash.com/collection/888877&sig=#{rand(1..1000)}",
                 primary: false
               })
end

characters = [
  Character.create(
    name: 'Titania',
    description: "Titania is a character in William Shakespeare's play A Midsummer Night's Dream. In the play, she is the queen of the fairies. Due to Shakespeare's influence, later fiction has often used the name \"Titania\" for fairy queen characters.",
    actors: [actors.sample],
    order_index: 1,
    production_id: production.id,
  ),
  Character.create(
    name: 'Oberon',
    description: "Oberon is a king of the fairies in medieval and Renaissance literature. He is best known as a character in William Shakespeare's play A Midsummer Night's Dream, in which he is Consort to Titania, Queen of the Fairies.",
    actors: [actors.sample],
    order_index: 2,
    production_id: production.id,
  ),
  Character.create(
    name: 'Hermia',
    description: "Hermia is caught in a romantic accident where she loves one man, Lysander, but is loved by Demetrius, whose feelings she does not return.",
    actors: [actors.sample],
    order_index: 3,
    production_id: production.id,
  ),
  Character.create(
    name: 'Puck',
    description: "Puck is a clever, mischievous elf, sprite or jester that personifies the wise knave. In the play, Shakespeare introduces Puck as the \"shrewd and knavish sprite\" and \"that merry wanderer of the night\".",
    actors: [actors.sample],
    order_index: 4,
    production_id: production.id,
  )
]

character_images = [
  'https://i.pinimg.com/736x/9b/51/d4/9b51d419edbb97546bc7dcca3de66fe7--fairy-queen-michelle-pfeiffer.jpg',
  'http://legacy.shadowandact.com/wp-content/uploads/2016/05/976.jpg',
  'https://www.yorknotes.com/images/onlineguides/a-level/A-Midsummer-Nights-Dream/Hermia.jpg',
  'http://owl.irkutsk.ru/PICS/ART/PALANTIR98_FANTASY/plf98-060_a_midsummer_nights_dream.jpg'
]

character_images.each_with_index do |character_image, i|
  Image.create({
                 imageable: characters[i],
                 remote_image_src_url: character_image,
                 primary: true
               })
end

scenes = [
  Scene.create(
    title: 'Athens. A room in the palace of Thesues',
    production_id: production.id,
    description: "The play opens with Hermia, who is in love with Lysander, resistant to her father Egeus' demand that she wed Demetrius, whom he has arranged for her to marry. Helena meanwhile pines unrequitedly for Demetrius. Enraged, Egeus invokes an ancient Athenian law before Duke Theseus, whereby a daughter must marry the suitor chosen by her father, or else face death. Theseus offers her another choice: lifelong chastity while worshipping the goddess Artemis as a nun.",
    order_index: 1,
    length_in_minutes: 20,
    setting: 'Indoors',
    character_ids: [1, 2],
  ),
  Scene.create(
    title: "Athens. A room in Quince's house",
    production_id: production.id,
    description: "Peter Quince and his fellow players Nick Bottom, Francis Flute, Robin Starveling, Tom Snout, and Snug plan to put on a play for the wedding of the Duke and the Queen, \"the most lamentable comedy and most cruel death of Pyramus and Thisbe.\"",
    order_index: 2,
    length_in_minutes: 15,
    setting: 'Indoors',
    character_ids: [3, 4],
  )
]

scene_images = [
  "http://www.uky.edu/~jsreid2/ENG340/Grieve5.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJxu6vCFQCPQrE3XSH6CAQQ7Dsjdcx0nUEHmbBMh56IDBc6VDo"
]

scene_images.each_with_index do |scene_image, i|
  Image.create({
                 remote_image_src_url: scene_image,
                 imageable: scenes[i],
                 primary: true
               })
end

costumes = [
  Costume.create(
    title: "Titania being mysterious",
    description: 'Ethereal dark gown full of mystery and splendor',
    character_ids: [1],
    production_id: production.id,
  ),
  Costume.create(
    title: "Oberon being a boss",
    description: 'Sweet leather vest underneath frilly coat thing',
    character_ids: [2],
    production_id: production.id,
  ),
  Costume.create(
    title: "Classic Puck",
    description: 'Fur legs and skin colored spandex shirt',
    character_ids: [3],
    production_id: production.id,
  )
]

costume_images = [
  "https://pre00.deviantart.net/3970/th/pre/i/2013/119/f/6/titania__queen_of_faeries_by_theironring-d63h4th.jpg",
  "http://i.telegraph.co.uk/multimedia/archive/01243/PD26354744_A-Midsu_1243845i.jpg",
  "http://vignette3.wikia.nocookie.net/amidsummernightsdream/images/b/b6/Puck.png/revision/latest?cb=20120520073630"
]

costume_images.each_with_index do |costume_image, i|
  Image.create({
                 remote_image_src_url: costume_image,
                 imageable: costumes[i],
                 primary: true
               })
end

CostumesCharactersScene.create(
  costume_id: 1,
  scene_id: 1,
  character_id: 1
)

costume_item = CostumeItem.create(
    title: "Titania's gown",
    description: 'Gown made of fairy dust and AMEX points',
    costume_id: 1,
    item_type: 'Dress',
  )

Image.create({
               remote_image_src_url: "https://pre00.deviantart.net/3970/th/pre/i/2013/119/f/6/titania__queen_of_faeries_by_theironring-d63h4th.jpg",
               imageable: costume_item,
               primary: true
             })

incomplete_notes = Note.create(10.times.collect {|i| {
  department: departments.sample,
  actor: actors.sample,
  scene: scenes.sample,
  noteable: [costumes.sample, costume_item].sample,
  description: Faker::Lorem.sentence(3, true, 25),
  priority: [1,2,3].sample,
  status: ['Assigned', 'In Progress'].sample,
  assignees: roles.sample([1,2].sample)
}})

complete_notes = Note.create(5.times.collect {|i| {
  department: departments.sample,
  scene: scenes.sample,
  actor: actors.sample,
  noteable: [costumes.sample, costume_item].sample,
  description: Faker::Lorem.sentence(3, true, 25),
  priority: [1,2,3].sample,
  status: 'Complete',
  assignees: roles.sample([1,2].sample),
  completed_by: roles.sample
}})

comments = Comment.create(20.times.collect {|i| {
  content: Faker::Movie.quote,
  commentable: [
    Character.order("RANDOM()").first,
    CostumeItem.order("RANDOM()").first,
    Note.order("RANDOM()").first,
    Scene.order("RANDOM()").first,
    Costume.order("RANDOM()").first,
    Scene.order("RANDOM()").first,
    Actor.order("RANDOM()").first,
  ].sample
}})
