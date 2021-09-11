import axios from 'axios';

let API_URL = 'http://localhost:5000/';

if(process.env.NODE_ENV === 'production') {
    API_URL = '';   
}

class UserService {

    async getFavouriteHikes(hike_ids) {
        return await axios.post(API_URL + 'user/hikes', {
            data: hike_ids
        }).then(response => {
            return response.data
        });
    }

    async addHikeToFavourites(user_id, hike_ids, nickname) {
        return await axios.post(API_URL + 'user/hike/save', {
            user_id: user_id,
            hike_ids: hike_ids,
            nickname: nickname
        }).then(response => {
            return response.data;
        });
    }

    async removeHike(user_id, hike_id) {
        return await axios.delete(API_URL + 'user/hike/delete', {
                data: {
                    user_id: user_id,
                    hike_id: hike_id
                }
        }).then(response => {
            return response.data;
        });
    }
}

export default new UserService();