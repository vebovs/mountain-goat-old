import React from 'react';
import L from 'leaflet';

// CSS
import 'leaflet/dist/leaflet.css';
import 'font-awesome/css/font-awesome.css';
import 'bulma/css/bulma.css';
import './main.css';

// Services
import HikesService from '../../services/HikesService/hikesService';
import AuthService from '../../services/AuthService/authService';
import UserService from '../../services/UserService/userService';

// Components
import Menu from '../Menu/menu';
import Authentication from '../Authentication/authentication';
import Dashboard from '../Dashboard/dashboard';
import Card from '../Card/card';
import Slider from '../Slider/slider';
import Alert from '../Alert/alert';
import Dropdown from '../Dropdown/dropdown';

delete L.Icon.Default.prototype._getIconUrl; //Removes markers from being drawn

export class Main extends React.Component {
    constructor() {
        super();
        this.state = {
            user: '', //User data
            userHikes: [], //Favourite hikes layers
            favourites: '', //Favourite hikes with all the data
            value: 3,
            status: false //Authenticated status
        };

        this.center = [59.861023, 5.782079]; //Default map starting point
        this.toggle = false; //Toggles the slider
        this.alert = false; //Toggles the alert
        this.message = ''; //Alert message displayed 
        this.loading = false; //Displays when gathering hikes from area
        this.success = false; //Registration status
        this.pathing = false; //Checks if user is creating a custom path
        this.path = []; //Custom path
    }

    // Finds all the hikes within a given area and draws them on the map
    findAndDrawHikes(points) {
        this.loading = true;
        this.setState({ state: this.state });

        HikesService.findHikesWithinArea(points)
        .then(res => {
            if(!res.length) {
                this.loading = false;
                this.displayAlert('No hikes found'); //Let the user know if nothing was found
            } else {
                this.hikes = res;
                //Draws all the hikes found
                this.geoJSONlayer = L.geoJSON(this.hikes, {
                    style: (feature) => {
                        return {
                            stroke: true,
                            color: '#3273DC',
                            weight: 10,
                            opacity: 0.75
                        };
                    },
                    coordsToLatLng: (coords) => {
                        return new L.LatLng(coords[0], coords[1]); //Reverse the coordinates to suit leaflet drawing
                    },
                    onEachFeature: (feature, layer) => {
                        layer.on('click', this.definePathing);
                    }
                }).addTo(this.map);

                this.map.removeLayer(this.circle);
                this.loading = false;
                this.setState({ state: this.state });
            }
        })
        .catch(error => {
            this.loading = false;
            this.displayAlert(error.response.data);
        });
    }

    // Stores the boundries of the circle in an object used to find hikes within said boundries
    searchForHikes = () => {
        //Remove existing traced hikes before drawing new ones
        if(this.geoJSONlayer) this.map.removeLayer(this.geoJSONlayer);
        
        //Gets the edgepoints of the circle
        const points = this.circle.getBounds();

        //Storing the boundries in a more accessible and readable manner
        const data = {
            top: points._northEast.lat,
            bottom: points._southWest.lat,
            left: points._southWest.lng,
            right: points._northEast.lng
        }

        this.findAndDrawHikes(data);
    }

    // Places a circle around the point the user clicked
    selectPoint = (e) => {
        
        if(!this.pathing) {
            this.toggle = true;

            //Converts the (x,y) coordinates of the window to latitude and longitude
            let event = this.map.mouseEventToLatLng(e);

            //Checks to see if there already is a circle on the map. If there is, it is replaced with a new one.
            if(!this.circle){
                this.circle = L.circle([event.lat, event.lng], {radius: (this.state.value *1000)}).addTo(this.map);
            } else {
                this.map.removeLayer(this.circle);
                this.circle = L.circle([event.lat, event.lng], {radius: (this.state.value *1000)}).addTo(this.map);
            }
            this.setState({ state: this.state });
        }
    }

    // Removes the circle and any general hikes currently drawn on the map
    removeCircleHikesAndDropdown = () => {
        this.toggle = false;

        //Removes the circle and traced hikes from the map
        if(this.pathing) this.pathing = false;
        if(this.circle) this.map.removeLayer(this.circle);
        if(this.geoJSONlayer) this.map.removeLayer(this.geoJSONlayer);

        this.geoJSONlayer = '';
        this.circle = '';
        this.hikes  = '';

        this.setState({ state: this.state });
    }

    // Updates the circle size when slider values changes
    updateCircle = (value) => {
        this.setState({ value });
        this.circle.setRadius(value *1000); // Convert to kilometers
    }

    // Registers a user
    register = (username, password) => {
        
        //Reset the success mark on a consecutive registration
        if(this.success) {
            this.success = false;
            this.setState({ state: this.state });
        }

        if(!username && !password) {
            this.displayAlert('A username and password is required');
        } else if(!username) {
            this.displayAlert('A username is required');
        } else if(!password) {
            this.displayAlert('A password is required');
        } else {
            AuthService.register(username, password)
            .then(() => {
                this.success = true;
                this.setState({ state: this.state });
            })
            .catch(error => {
                this.displayAlert(error.response.data);
            });
        }
    }

    // Logs a user in
    login = (username, password) => {
        if(!username && !password) {
            this.displayAlert('A username and password is required');
        } else if(!username) {
            this.displayAlert('A username is required');
        } else if(!password) {
            this.displayAlert('A password is required');
        } else {
            AuthService.login(username, password)
            .then(res => {
                this.setState({
                    user: res,
                    status: true
                });
            })
            .catch(error => {
                this.displayAlert(error.response.data);
            });
        }
    }

    // Logs a user out
    logout = () => {
        AuthService.logout()
        .then(() => {
            this.state.userHikes.map(e =>this.map.removeLayer(e.layer)); //Clear paths upon logout
            this.setState({
                user: '',
                status: false,
                userHikes: []
            });
        })
        .catch(error => {
            this.displayAlert(error.response.data);
        });
    }

    // Closes the dropdown and removes path styling from favouriting a path 
    closeDropdown = () => {
        this.pathing = false; //Close creation mode
        this.toggle = true; //Reopen the slider
        this.path.map(e => e.setStyle({ color: '#3273DC' })); //Restyle the paths
        this.setState({ state: this.state });
    }

    // Creating a favourite hike
    definePathing = (event) => {
        if(this.circle) {
            this.map.removeLayer(this.circle); //Remove circle when pathing
            this.circle = '';
        }
        this.toggle = false; //Close slider when pathing
        this.pathing = true; //Enable pathing mode
        const path = event.target;
        path.setStyle({color:'black'}); //Color selected paths
        this.path.push(path);
        this.setState({ state: this.state });
    }

    // Lets the user favourite a hike with a custom nickname
    savePath = (nickname) => {
        if(this.state.status && nickname) {
            const ids = this.path.map(e => e.feature._id);
            UserService.addHikeToFavourites(this.state.user._id, ids, nickname)
            .then(res => {
                this.state.user.favourites.push({
                    id: res.id,
                    hike_ids: ids,
                    nickname: nickname
                });
                this.setState({state: this.state });
            })
            .catch(error => {
                this.displayAlert(error.response.data);
            });
            this.closeDropdown();
            this.pathing = false; //End pathing mode
            this.path = [];
        } else if(!this.state.status) {
            this.displayAlert('You need to be logged in for this action');
        } else {
            this.displayAlert('A nickname is required');
        }
    }

    // Draws a specific favourited hike when the user clicks on it from their panel
    showPath = (favourite_id) => {
        //this.toggle = false; //Close menu before displaying selected hike

        const drawn = this.state.userHikes.filter(e => e.id === favourite_id); //Checks to see if custom hike has been drawn
        if(!drawn.length) { //Only draw if it has not been drawn yet
            const favourite_hike = this.state.user.favourites.filter(e => e.id === favourite_id);
            UserService.getFavouriteHikes(favourite_hike[0].hike_ids)
            .then(res => {
                const hike = res;
                const hikeLayer = L.geoJSON(hike, {
                    style: (feature) => {
                        return {
                            stroke: true,
                            color: 'black',
                            weight: 10,
                            opacity: 0.75
                        };
                    },
                    coordsToLatLng: (coords) => {
                        return new L.LatLng(coords[0], coords[1]);
                    }
                }).addTo(this.map);

                //Adds the id and layer to an array for easy clearing later
                this.state.userHikes.push({
                    id: favourite_id,
                    layer: hikeLayer
                });

                //Move the view to the hike the user clicked on
                const moveToCords = hike[0].geometry.coordinates[0];
                this.map.setView(moveToCords);
            })
            .catch(error => {
                this.displayAlert(error.response.data);
            });
        }   
    }

    // Clears a drawn hike in the favourites from the map
    clearPath = (id) => {
        const hikeToRemove = this.state.userHikes.filter(e => e.id === id); //The hike to clear found from the id
        if(hikeToRemove.length) {
            const layerToRemove = hikeToRemove.map(e => e.layer)[0]; //Gets the layer
            this.map.removeLayer(layerToRemove); //Clears the hike
            this.setState(state => {
                state.userHikes = state.userHikes.filter(e => e.id !== id);
            })
        }
    }

    // Deletes a hike from the user's favourties
    removePath(id) {
        this.clearPath(id);
        //If removal is successful the current state is updated with the hike removed
        UserService.removeHike(this.state.user._id, id)
        .then(() => {
            const user = {...this.state.user};
            user.favourites = this.state.user.favourites.filter(e => e.id !== id);
            this.setState({
                user
            });
        })
        .catch(error => {
            this.displayAlert(error.response.data);
        });
    }

    // Flashes an error message to the user
    displayAlert = (message) => {
        this.alert = true;
        this.message = message;
        this.setState({ state: this.state});
    }

    // Closes the error message
    dismissAlert = () => {
        this.alert = false;
        this.message = '';
        this.setState({ state: this.state });
    }

    componentDidMount() {
        this.map = L.map('map', {
            center: this.center,
            zoom: 12 // Starting zoom value
        });

        this.map.doubleClickZoom.disable(); // Disables zoom when double clicking
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors',
            detectRetina: true,    
            maxZoom: 20,
            maxNativeZoom: 17
        }).addTo(this.map);

        let mouseisdown = false;
        const map = document.getElementById('map');

        // Differentiating between clicking on the map and holding to move the view of the map
        map.addEventListener('mousedown', (e) => {
            mouseisdown = true;
            setTimeout(() => {
                if(!mouseisdown) {
                    this.selectPoint(e);
                }
            }, 100);
        });

        map.addEventListener('mouseup', () => {
            mouseisdown = false;
        });
    }
 
    render() {
        return (
            <div id="app-container">
                <Dropdown save={this.savePath.bind(this)} close={this.closeDropdown} visible={this.pathing} />
                <Alert alert={this.alert} onClick={this.dismissAlert}>{this.message}</Alert>
                <Menu title='Mountain Goat'>
                    {
                        !this.state.status && <Authentication success={this.success} onLoginInput={this.login.bind(this)} onRegisterInput={this.register.bind(this)}/>
                    }
                    {
                        this.state.status && <div>
                            <Dashboard panel={this.state.user.username} onClick={this.logout.bind(this)}>
                                <div>
                                    {
                                        this.state.user.favourites.map((e) => 
                                            <Card key={e.id} name={e.nickname} show={() => this.showPath(e.id)} remove={() => this.removePath(e.id)} clear={() => this.clearPath(e.id)} />
                                        )
                                    }
                                </div>
                             </Dashboard>
                         </div>
                    }
                </Menu>
                <Slider loading={this.loading} toggle={this.toggle} onRangeInput={this.updateCircle.bind(this)} exit={this.removeCircleHikesAndDropdown} enter={this.searchForHikes} />
                <div id="map" />
            </div>
        );
    }
}
