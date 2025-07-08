const { Model } = require('objection');
const { v4: uuidv4 } = require("uuid");
const { string, timeStamps } = require('../constants/Val')

class RideStatus extends Model {
  static get tableName() {
    return 'ride_statuses';
  }
     
  $beforeInsert(){
         if(!this.id){
          this.id = uuidv4()
         }
      }


    static get jsonSchema() {
  return {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string', format: 'uuid' },
      code:string,
      label:string,
      orderIndex:{type:'number'},
      created_at: timeStamps,
      updated_at:timeStamps
    }
  };
}


  static get relationMappings() {
    const RideStatusHistory = require('./RideStatusHistory')
    const Ride = require('./Ride');

    return {
      history: {
        relation: Model.HasManyRelation,
        modelClass: RideStatusHistory,
        join: {
          from: `${this.tableName}.id`,
          to: `${RideStatusHistory.tableName}.statusId`,
        },
      },
      rides: {
        relation: Model.HasManyRelation,
        modelClass: Ride,
        join: {
          from: `${this.tableName}.id`,
          to: `${Ride.tableName}.statusId`,
        },
      },
    };
  }
}

module.exports = RideStatus;
