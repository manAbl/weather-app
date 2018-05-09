import React, { Component } from 'react';
import '../styles/app-styles.css'

class WeatherData extends Component {

  constructor(props) {
    super(props);
    this.state = { isCelcius: true }
  }

  toggleIsCelcius() {
    this.setState({isCelcius: !this.state.isCelcius});
  }

  getCorrectTemp(temp, isCelcius) {
    if(this.state.isCelcius) return `${this.props.tempCelcius} °C`;
    return `${(this.props.tempCelcius*9/5)+32} °F`;
  }

  render() {
    const { main,name,icon,country,tempCelcius } = this.props;
    if(tempCelcius) {
      const tempFormatted = this.getCorrectTemp(tempCelcius, this.state.isCelcius);
      return (
        <div className='app-wrapper'>
          <p>{name},{country}</p>
          <small>{main}</small>
          <button onClick={this.toggleIsCelcius.bind(this)}>{tempFormatted}</button>
          <img src={icon} alt=''/>
        </div>
      );
    } else {
      return (
        <div className='bouncing-loader'>
          <div></div>
          <div></div>
          <div></div>
        </div>
      );
    }
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      weather: {},
      lat: 0,
      long: 0
    }
    this.gettingGeoLocation = this.gettingGeoLocation.bind(this);
    this.fetchingData = this.fetchingData.bind(this);
   }
  gettingGeoLocation() {
    if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition( position => {
      let latitude =  position.coords.latitude;
      let longitude = position.coords.longitude;

      this.setState({ lat: latitude, long: longitude });
    });
    }
  }
  fetchingData() {
    const { lat, long } = this.state;
    const API = `https://fcc-weather-api.glitch.me/api/current?lat=${lat}&lon=${long}`;
    const body = {
      method: "GET",
    };
    const myRequest = new Request(API, body);
      fetch(myRequest)
        .then(response => response.json())
        .then(data => this.setState({ weather: data }))
  }
  componentDidMount() {

    this.gettingGeoLocation();

    setTimeout(() => {
      this.fetchingData();
    }, 3500);
  }

  render() {
    const props = {
      weather: this.state.weather,
      name: this.state.weather.name,
      description: this.state.weather.weather && this.state.weather.weather[0].main,
      icon: this.state.weather.weather && this.state.weather.weather[0].icon,
      country: this.state.weather.weather && this.state.weather.sys.country,
      temp: this.state.weather.weather && this.state.weather.main.temp
    };

    return (
      <WeatherData main={props.description}
        name={props.name} icon={props.icon}
        country={props.country} tempCelcius={props.temp} />
    );
  }
}


export default App;
