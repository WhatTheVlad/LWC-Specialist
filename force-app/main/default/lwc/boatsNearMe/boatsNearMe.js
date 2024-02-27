
import {LightningElement, wire} from 'lwc';
import { getLocationService } from 'lightning/mobileCapabilities';
import getBoatsByLocation from '@salesforce/apex/BoatDataService.getBoatsByLocation'
import {ShowToastEvent} from "lightning/platformShowToastEvent";
const LABEL_YOU_ARE_HERE = 'You are here!';
const ICON_STANDARD_USER = 'standard:user';
const ERROR_TITLE = 'Error loading Boats Near Me';
const ERROR_VARIANT = 'error';

export default class BoatsNearMe extends LightningElement
{

    boatTypeId;
    mapMarkers = [];
    isLoading = true;
    isRendered;
    latitude;
    longitude;

    // Add the wired method from the Apex Class
    // Name it getBoatsByLocation, and use latitude, longitude and boatTypeId
    // Handle the result and calls createMapMarkers
    @wire(getBoatsByLocation, {
        latitude: "$latitude",
        longitude: "$longitude",
        boatTypeId : "$boatTypeId"}
    )
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
    }

    // Controls the isRendered property
    // Calls getLocationFromBrowser()
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
        //const newMarkers = boatData.map(boat => {...});
       // newMarkers.unshift({...});
    }
}
