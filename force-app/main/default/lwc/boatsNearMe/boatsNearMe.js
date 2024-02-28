
import {LightningElement, api, wire} from 'lwc';
import getBoatsByLocation from '@salesforce/apex/BoatDataService.getBoatsByLocation'
import {ShowToastEvent} from "lightning/platformShowToastEvent";
const LABEL_YOU_ARE_HERE = 'You are here!';
const ICON_STANDARD_USER = 'standard:user';
const ERROR_TITLE = 'Error loading Boats Near Me';
const ERROR_VARIANT = 'error';

export default class BoatsNearMe extends LightningElement
{

    @api boatTypeId;
    mapMarkers = [];
    isLoading = true;
    isRendered;
    latitude;
    longitude;
    userMapMarker;

    @wire(getBoatsByLocation, {
        latitude: '$latitude',
        longitude: '$longitude',
        boatTypeId : '$boatTypeId'
    })
    wiredBoatsJSON({error, data}) {
        if (data) {
            this.createMapMarkers(data);
        } else if (error) {
            this.dispatchEvent(new ShowToastEvent({
                title: ERROR_TITLE,
                message: 'Oops',
                variant: ERROR_VARIANT
            }))
        }

        this.isLoading = false;
    }


    renderedCallback() {
        if (!this.isRendered) {
            this.getLocationFromBrowser();
        }

        this.isRendered = true;
    }

    getLocationFromBrowser() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
            });
        }
    }

    createMapMarkers(boatData) {
        let parsedBoatData = JSON.parse(boatData);

        this.userMapMarker = {
            location : {
                Latitude: this.latitude,
                Longitude: this.longitude
            },
            title: LABEL_YOU_ARE_HERE,
            icon: ICON_STANDARD_USER
        }

        this.mapMarkers = parsedBoatData.map(boat =>
        {
            return {
                location : {
                    Latitude: boat.Geolocation__Latitude__s,
                    Longitude: boat.Geolocation__Longitude__s
                },
                title: boat.Name
            }
        });

        this.mapMarkers.unshift(this.userMapMarker);
    }
}
