const Dao = require('./Dao.js');
const mongo = require('mongodb');

module.exports = class HikeDao extends Dao {
    constructor(collection) {
        super(collection);
    }
    
    getHikes(points) {
        return this.collection.find({
            "geometry": {
                "$geoWithin": {
                        "$geometry": {
                            "type": "Polygon",
                            "coordinates": [
                                [
                                    [
                                        points.bottom,  //lat
                                        points.left     //lon
                                    ],
                                    [
                                        points.top,
                                        points.left
                                    ],
                                    [
                                        points.top,
                                        points.right
                                    ],
                                    [
                                        points.bottom,
                                        points.right
                                    ],
                                    [
                                        points.bottom,
                                        points.left
                                    ]
                                ]
                            ]
                        }
                    }
                }
            }
        ).toArray();
    }

    findHikesByIds(data) {
        const ids  = data.map(e => e = new mongo.ObjectID(e));
        return this.collection.find({
            _id: {
                $in: ids
            }
        }).toArray();
    }

    async getHike(id) {
        return await this.collection.findOne({
            _id: new mongo.ObjectID(id)
        });
    }
}