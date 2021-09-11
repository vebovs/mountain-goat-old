import axios from 'axios';

let API_URL = 'http://localhost:5000/';

if(process.env.NODE_ENV === 'production') {
    API_URL = '';   
}

class HikesService {

    async findHikesWithinArea(points) {
        return await axios.post(API_URL + 'hikes', {
            top: points.top,
            bottom: points.bottom,
            left: points.left,
            right: points.right
        })
        .then(response => {
            return response.data;
        });
    }

    async getHike(id) {
        return await axios.get(API_URL + 'hike/' + id)
            .then(response => {
                return response.data;
            });
    }

}

export default new HikesService();