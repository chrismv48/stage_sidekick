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

job_titles = ['Producer', 'Director', 'Administration', 'Actor', 'Costume Designer', 'Lighting Technician', 'Sound Technician', 'Assistant Costume Designer', 'Wardrobe Supervisor']
scene_settings = ['Morning', 'Night', 'Afternoon', 'Sunset', 'Beach', 'Indoors']
departments = ['Production', 'Lighting', 'Costumes', 'Acting', 'Administration']
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

roles = Role.create(users.map {|user| {
  user_id: user.id,
  first_name: user.first_name,
  last_name: user.last_name,
  production_id: production.id,
  venue_id: venue.id,
  title: user.default_title,
  department: departments.sample,
  role_type: statuses.sample,
  start_date: Faker::Date.between(2.years.ago, Date.today),
  remote_display_image_url: "https://source.unsplash.com/collection/888877&sig=#{rand(1..1000)}"
}})

characters = Character.create(10.times.collect {|i| {
  name: Faker::Name.first_name,
  description: Faker::ChuckNorris.fact,
  production_id: production.id,
  actors: [roles.sample],
  remote_display_image_url: "https://source.unsplash.com/collection/888877&sig=#{rand(1..1000)}"
}})

scenes = Scene.create(8.times.collect {|i| {
  title: Faker::Movie.quote,
  production_id: production.id,
  description: Faker::ChuckNorris.fact,
  order_index: i,
  length_in_minutes: rand(5..30),
  setting: scene_settings.sample,
  characters: characters.shuffle[1..rand(1..5)],
  remote_display_image_url: "https://source.unsplash.com/collection/139346&sig=#{rand(1..1000)}"
}})

costumes = Costume.create(characters.map {|character| {
  title: "#{character.name} costume",
  description: Faker::Hipster.sentences(rand(1..3)).join(' '),
  production_id: production.id,
  remote_display_image_url: "https://source.unsplash.com/collection/268237&sig=#{rand(1..1000)}"
}})

costumes.each do |costume|
  costume.characters_scenes = CharactersScene.order("RANDOM()").limit(rand(1..3))
  CostumeItem.create(rand(3..5).times.collect {|i| {
    title: "#{costume.title} #{costume_item_types.sample}",
    description: Faker::Hipster.sentences(rand(1..3)).join(' '),
    costume_id: costume.id,
    item_type: costume_item_types.sample,
    remote_display_image_url: "https://source.unsplash.com/collection/1051&sig=#{rand(1..1000)}"
  }}
  )
end



