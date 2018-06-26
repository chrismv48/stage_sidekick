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

ActiveRecord::Schema.define(version: 20180612195134) do

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

  create_table "character_costumes", force: :cascade do |t|
    t.integer  "costume_id",   null: false
    t.integer  "character_id"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
    t.integer  "order_index"
    t.index ["character_id"], name: "index_character_costumes_on_character_id", using: :btree
    t.index ["costume_id"], name: "index_character_costumes_on_costume_id", using: :btree
  end

  create_table "characters", force: :cascade do |t|
    t.string   "name",          limit: 50,   null: false
    t.string   "description",   limit: 1000
    t.string   "type",          limit: 20
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
    t.integer  "production_id",              null: false
    t.integer  "order_index"
  end

  create_table "characters_roles", force: :cascade do |t|
    t.integer  "role_id",      null: false
    t.integer  "character_id", null: false
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
    t.index ["character_id"], name: "index_characters_roles_on_character_id", using: :btree
    t.index ["role_id"], name: "index_characters_roles_on_role_id", using: :btree
  end

  create_table "characters_stage_actions", force: :cascade do |t|
    t.integer  "stage_action_id", null: false
    t.integer  "character_id",    null: false
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.index ["character_id"], name: "index_characters_stage_actions_on_character_id", using: :btree
    t.index ["stage_action_id"], name: "index_characters_stage_actions_on_stage_action_id", using: :btree
  end

  create_table "comments", force: :cascade do |t|
    t.string   "content"
    t.integer  "role_id"
    t.string   "commentable_type"
    t.integer  "commentable_id"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
    t.index ["commentable_type", "commentable_id"], name: "index_comments_on_commentable_type_and_commentable_id", using: :btree
  end

  create_table "costume_items", force: :cascade do |t|
    t.integer  "costume_id"
    t.string   "title"
    t.string   "description"
    t.string   "item_type"
    t.datetime "created_at",        null: false
    t.datetime "updated_at",        null: false
    t.string   "care_instructions"
    t.string   "source"
    t.string   "brand"
    t.float    "cost"
    t.string   "notes"
    t.index ["costume_id"], name: "index_costume_items_on_costume_id", using: :btree
  end

  create_table "costumes", force: :cascade do |t|
    t.string   "title",         limit: 75,   null: false
    t.string   "description",   limit: 1000
    t.integer  "production_id",              null: false
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
    t.index ["production_id"], name: "index_costumes_on_production_id", using: :btree
  end

  create_table "images", force: :cascade do |t|
    t.string   "name",                           null: false
    t.boolean  "primary",        default: false, null: false
    t.string   "image_src",                      null: false
    t.string   "size"
    t.string   "imageable_type"
    t.integer  "imageable_id"
    t.datetime "created_at",                     null: false
    t.datetime "updated_at",                     null: false
    t.integer  "order_index"
    t.index ["imageable_type", "imageable_id"], name: "index_images_on_imageable_type_and_imageable_id", using: :btree
  end

  create_table "notes", force: :cascade do |t|
    t.string   "category"
    t.string   "department"
    t.integer  "actor_id"
    t.integer  "noteable_id"
    t.string   "noteable_type"
    t.string   "description"
    t.string   "priority"
    t.string   "status"
    t.integer  "completed_by_role_id"
    t.datetime "created_at",           null: false
    t.datetime "updated_at",           null: false
    t.integer  "scene_id"
    t.string   "title"
    t.index ["actor_id"], name: "index_notes_on_actor_id", using: :btree
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
    t.string   "role_type"
    t.date     "start_date"
    t.date     "end_date"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
    t.string   "first_name"
    t.string   "last_name"
    t.integer  "order_index"
    t.string   "description"
    t.index ["production_id"], name: "index_roles_on_production_id", using: :btree
    t.index ["user_id"], name: "index_roles_on_user_id", using: :btree
    t.index ["venue_id"], name: "index_roles_on_venue_id", using: :btree
  end

  create_table "roles_notes", force: :cascade do |t|
    t.integer  "role_id"
    t.integer  "note_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["note_id"], name: "index_roles_notes_on_note_id", using: :btree
    t.index ["role_id"], name: "index_roles_notes_on_role_id", using: :btree
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
    t.index ["production_id"], name: "index_scenes_on_production_id", using: :btree
  end

  create_table "songs", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "stage_action_spans", force: :cascade do |t|
    t.integer  "span_start",     null: false
    t.integer  "span_end"
    t.string   "description"
    t.string   "status"
    t.integer  "spannable_id"
    t.string   "spannable_type"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
    t.index ["span_end"], name: "index_stage_action_spans_on_span_end", using: :btree
    t.index ["span_start"], name: "index_stage_action_spans_on_span_start", using: :btree
    t.index ["spannable_id"], name: "index_stage_action_spans_on_spannable_id", using: :btree
    t.index ["spannable_type"], name: "index_stage_action_spans_on_spannable_type", using: :btree
  end

  create_table "stage_actions", force: :cascade do |t|
    t.integer  "production_id"
    t.integer  "number"
    t.integer  "page_number"
    t.string   "stage_action_type"
    t.string   "description"
    t.string   "status"
    t.datetime "created_at",        null: false
    t.datetime "updated_at",        null: false
    t.index ["production_id"], name: "index_stage_actions_on_production_id", using: :btree
  end

  create_table "stage_presences", force: :cascade do |t|
    t.integer  "character_id"
    t.string   "entrance_location"
    t.string   "exit_location"
    t.datetime "created_at",        null: false
    t.datetime "updated_at",        null: false
    t.index ["character_id"], name: "index_stage_presences_on_character_id", using: :btree
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
