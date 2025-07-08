const { Model } = require("objection");
const { v4: uuidv4 } = require("uuid");
const { timeStamps } = require('../constants/Val.js')

class User extends Model {
  static get tableName() {
    return "users";
  }
      $beforeInsert(){
         if(!this.id){
          this.id = uuidv4()
         }
      }

  static get jsonSchema() {
    return {
      type: "object",
      required: [ "name", "email", "phone"],
      properties: {
        id: { type: "string", format: "uuid" },
        name: { type: "string", minLength: 3 },
        email: { type: "string", format: "email" },
        phone: { type: "string", pattern: "^[0-9]{10}$" },
        created_at: timeStamps,
        updated_at: timeStamps
      },
    };
  }

  static get relationMappings() {
    const Ride = require("./Ride");

    return {
      rides: {
        relation: Model.HasManyRelation,
        modelClass: Ride,
        join: {
          from: `${this.tableName}.id`,
          to: `${Ride.tableName}.userId`,
        },
      },
    };
  }
}

module.exports = User;
