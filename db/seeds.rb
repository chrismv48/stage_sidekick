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
departments = ['Production', 'Lighting', 'Costumes', 'Administration']
statuses = ['Full-time', 'Contractor', 'Part-time']
costume_item_types = ['Jeans', 'Shirt', 'Skirt', 'Dress', 'Shoes', 'Belt', 'Hat']

users = User.create(20.times.collect {|i| {
  first_name: Faker::Name.first_name,
  last_name: Faker::Name.last_name,
  email: Faker::Internet.email,
  phone_number: Faker::PhoneNumber.cell_phone,
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
  remote_display_image_url: "https://source.unsplash.com/collection/888877&sig=#{rand(1..1000)}"
}})

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
  remote_display_image_url: "https://source.unsplash.com/collection/888877&sig=#{rand(1..1000)}"
}})



# characters = Character.create(10.times.collect {|i| {
#   name: Faker::Name.first_name,
#   description: Faker::ChuckNorris.fact,
#   production_id: production.id,
#   actors: [roles.sample],
#   order_index: i,
#   remote_display_image_url: "https://source.unsplash.com/collection/888877&sig=#{rand(1..1000)}"
# }})

characters = [
  Character.create(
    name: 'Titania',
    description: "Titania is a character in William Shakespeare's play A Midsummer Night's Dream. In the play, she is the queen of the fairies. Due to Shakespeare's influence, later fiction has often used the name \"Titania\" for fairy queen characters.",
    actors: [actors.sample],
    order_index: 1,
    production_id: production.id,
    remote_display_image_url: 'https://i.pinimg.com/736x/9b/51/d4/9b51d419edbb97546bc7dcca3de66fe7--fairy-queen-michelle-pfeiffer.jpg'
  ),
  Character.create(
    name: 'Oberon',
    description: "Oberon is a king of the fairies in medieval and Renaissance literature. He is best known as a character in William Shakespeare's play A Midsummer Night's Dream, in which he is Consort to Titania, Queen of the Fairies.",
    actors: [actors.sample],
    order_index: 2,
    production_id: production.id,
    remote_display_image_url: 'http://legacy.shadowandact.com/wp-content/uploads/2016/05/976.jpg'
  ),
  Character.create(
    name: 'Hermia',
    description: "Hermia is caught in a romantic accident where she loves one man, Lysander, but is loved by Demetrius, whose feelings she does not return.",
    actors: [actors.sample],
    order_index: 3,
    production_id: production.id,
    remote_display_image_url: 'https://www.yorknotes.com/images/onlineguides/a-level/A-Midsummer-Nights-Dream/Hermia.jpg'
  ),
  Character.create(
    name: 'Puck',
    description: "Puck is a clever, mischievous elf, sprite or jester that personifies the wise knave. In the play, Shakespeare introduces Puck as the \"shrewd and knavish sprite\" and \"that merry wanderer of the night\".",
    actors: [actors.sample],
    order_index: 3,
    production_id: production.id,
    remote_display_image_url: 'http://owl.irkutsk.ru/PICS/ART/PALANTIR98_FANTASY/plf98-060_a_midsummer_nights_dream.jpg'
  )
]


# scenes = Scene.create(8.times.collect {|i| {
#   title: Faker::Movie.quote,
#   production_id: production.id,
#   description: Faker::ChuckNorris.fact,
#   order_index: i,
#   length_in_minutes: rand(5..30),
#   setting: scene_settings.sample,
#   characters: characters.shuffle[1..rand(1..5)],
#   remote_display_image_url: "https://source.unsplash.com/collection/139346&sig=#{rand(1..1000)}"
# }})

scenes = [
  Scene.create(
    title: 'Athens. A room in the palace of Thesues',
    production_id: production.id,
    description: "The play opens with Hermia, who is in love with Lysander, resistant to her father Egeus' demand that she wed Demetrius, whom he has arranged for her to marry. Helena meanwhile pines unrequitedly for Demetrius. Enraged, Egeus invokes an ancient Athenian law before Duke Theseus, whereby a daughter must marry the suitor chosen by her father, or else face death. Theseus offers her another choice: lifelong chastity while worshipping the goddess Artemis as a nun.",
    order_index: 1,
    length_in_minutes: 20,
    setting: 'Indoors',
    character_ids: [1, 2],
    remote_display_image_url: "http://www.uky.edu/~jsreid2/ENG340/Grieve5.jpg"
  ),
  Scene.create(
    title: "Athens. A room in Quince's house",
    production_id: production.id,
    description: "Peter Quince and his fellow players Nick Bottom, Francis Flute, Robin Starveling, Tom Snout, and Snug plan to put on a play for the wedding of the Duke and the Queen, \"the most lamentable comedy and most cruel death of Pyramus and Thisbe.\"",
    order_index: 2,
    length_in_minutes: 15,
    setting: 'Indoors',
    character_ids: [3, 4],
    remote_display_image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJxu6vCFQCPQrE3XSH6CAQQ7Dsjdcx0nUEHmbBMh56IDBc6VDo"
  )
]

# costumes = Costume.create(characters.map {|character| {
#   title: "#{character.name} costume",
#   description: Faker::Hipster.sentences(rand(1..3)).join(' '),
#   production_id: production.id,
#   remote_display_image_url: "https://source.unsplash.com/collection/268237&sig=#{rand(1..1000)}"
# }})

costumes = [
  Costume.create(
    title: "Titania being mysterious",
    description: 'Ethereal dark gown full of mystery and splendor',
    character_ids: [1],
    production_id: production.id,
    remote_display_image_url: "https://pre00.deviantart.net/3970/th/pre/i/2013/119/f/6/titania__queen_of_faeries_by_theironring-d63h4th.jpg"
  ),
  Costume.create(
    title: "Oberon being a boss",
    description: 'Sweet leather vest underneath frilly coat thing',
    character_ids: [2],
    production_id: production.id,
    remote_display_image_url: "http://i.telegraph.co.uk/multimedia/archive/01243/PD26354744_A-Midsu_1243845i.jpg"
  ),
  Costume.create(
    title: "Classic Puck",
    description: 'Fur legs and skin colored spandex shirt',
    character_ids: [3],
    production_id: production.id,
    remote_display_image_url: "http://vignette3.wikia.nocookie.net/amidsummernightsdream/images/b/b6/Puck.png/revision/latest?cb=20120520073630"
  )
]

# costumes.each do |costume|
#   costume.characters_scenes = CharactersScene.order("RANDOM()").limit(rand(1..3))
#   CostumeItem.create(rand(3..5).times.collect {|i| {
#     title: "#{costume.title} #{costume_item_types.sample}",
#     description: Faker::Hipster.sentences(rand(1..3)).join(' '),
#     costume_id: costume.id,
#     item_type: costume_item_types.sample,
#     remote_display_image_url: "https://source.unsplash.com/collection/1051&sig=#{rand(1..1000)}"
#   }}
#   )
# end

CostumeItem.create(
    title: "Titania's gown",
    description: 'Gown made of fairy dust and AMEX points',
    costume_id: 1,
    item_type: 'Dress',
    remote_display_image_url: "https://pre00.deviantart.net/3970/th/pre/i/2013/119/f/6/titania__queen_of_faeries_by_theironring-d63h4th.jpg"
  )


