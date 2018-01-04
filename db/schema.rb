# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20180104004320) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "actor_measurements", force: :cascade do |t|
    t.integer  "user_id",    null: false
    t.string   "gender"
    t.float    "height"
    t.float    "weight"
    t.string   "ethnicity"
    t.string   "eye_color"
    t.string   "hair_color"
    t.float    "chest"
    t.float    "waist"
    t.float    "hips"
    t.float    "neck"
    t.float    "inseam"
    t.float    "sleeve"
    t.float    "shoe_size"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_actor_measurements_on_user_id", using: :btree
  end

  create_table "characters", force: :cascade do |t|
    t.string   "name",          limit: 50,   null: false
    t.string   "description",   limit: 1000
    t.string   "type",          limit: 20
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
    t.integer  "production_id",              null: false
    t.integer  "order_index"
    t.string   "display_image"
  end

  create_table "characters_costumes", force: :cascade do |t|
    t.integer  "character_id", null: false
    t.integer  "costume_id",   null: false
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
    t.integer  "scene_id"
    t.index ["character_id"], name: "index_characters_costumes_on_character_id", using: :btree
    t.index ["costume_id"], name: "index_characters_costumes_on_costume_id", using: :btree
    t.index ["scene_id"], name: "index_characters_costumes_on_scene_id", using: :btree
  end

  create_table "characters_roles", force: :cascade do |t|
    t.integer  "role_id",      null: false
    t.integer  "character_id", null: false
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
    t.index ["character_id"], name: "index_characters_roles_on_character_id", using: :btree
    t.index ["role_id"], name: "index_characters_roles_on_role_id", using: :btree
  end

  create_table "characters_scenes", force: :cascade do |t|
    t.integer  "character_id", null: false
    t.integer  "scene_id",     null: false
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
    t.index ["character_id"], name: "index_characters_scenes_on_character_id", using: :btree
    t.index ["scene_id"], name: "index_characters_scenes_on_scene_id", using: :btree
  end

  create_table "costume_items", force: :cascade do |t|
    t.integer  "costume_id"
    t.string   "title"
    t.string   "description"
    t.string   "item_type"
    t.string   "display_image"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
    t.index ["costume_id"], name: "index_costume_items_on_costume_id", using: :btree
  end

  create_table "costumes", force: :cascade do |t|
    t.string   "title",         limit: 75,   null: false
    t.string   "description",   limit: 1000
    t.integer  "production_id",              null: false
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
    t.string   "display_image"
    t.index ["production_id"], name: "index_costumes_on_production_id", using: :btree
  end

  create_table "costumes_characters_scenes", force: :cascade do |t|
    t.integer  "costume_id",          null: false
    t.integer  "characters_scene_id"
    t.integer  "character_id"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
    t.index ["character_id"], name: "index_costumes_characters_scenes_on_character_id", using: :btree
    t.index ["characters_scene_id"], name: "index_costumes_characters_scenes_on_characters_scene_id", using: :btree
    t.index ["costume_id"], name: "index_costumes_characters_scenes_on_costume_id", using: :btree
  end

  create_table "productions", force: :cascade do |t|
    t.string   "title",      limit: 50, null: false
    t.integer  "venue_id",              null: false
    t.string   "status",     limit: 15
    t.date     "start_date"
    t.date     "end_date"
    t.datetime "created_at",            null: false
    t.datetime "updated_at",            null: false
    t.index ["venue_id"], name: "index_productions_on_venue_id", using: :btree
  end

  create_table "roles", force: :cascade do |t|
    t.integer  "user_id",       null: false
    t.integer  "production_id"
    t.integer  "venue_id",      null: false
    t.string   "title"
    t.string   "department"
    t.string   "status"
    t.date     "start_date"
    t.date     "end_date"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
    t.string   "first_name"
    t.string   "last_name"
    t.string   "avatar"
    t.string   "display_image"
    t.string   "type"
    t.integer  "order_index"
    t.string   "description"
    t.index ["production_id"], name: "index_roles_on_production_id", using: :btree
    t.index ["user_id"], name: "index_roles_on_user_id", using: :btree
    t.index ["venue_id"], name: "index_roles_on_venue_id", using: :btree
  end

  create_table "scenes", force: :cascade do |t|
    t.string   "title",             limit: 75,   null: false
    t.integer  "production_id",                  null: false
    t.string   "description",       limit: 1000
    t.integer  "order_index"
    t.integer  "length_in_minutes"
    t.string   "setting",           limit: 30
    t.datetime "created_at",                     null: false
    t.datetime "updated_at",                     null: false
    t.string   "display_image"
    t.index ["production_id"], name: "index_scenes_on_production_id", using: :btree
  end

  create_table "users", force: :cascade do |t|
    t.string   "first_name",    limit: 50,  null: false
    t.string   "last_name",     limit: 50,  null: false
    t.string   "email",         limit: 255, null: false
    t.string   "username",      limit: 20,  null: false
    t.string   "default_title", limit: 50
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
    t.string   "phone_number",  limit: 20
  end

  create_table "venues", force: :cascade do |t|
    t.string   "name",        limit: 100,  null: false
    t.string   "description", limit: 5000
    t.string   "type",        limit: 30
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
  end

end
