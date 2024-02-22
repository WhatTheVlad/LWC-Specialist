import {LightningElement, api, track, wire} from "lwc";

 import getBoatTypes from '@salesforce/apex/BoatDataService.getBoatTypes';
export default class BoatSearchForm extends LightningElement {
    selectedBoatTypeId = '';

    // Private
    error = undefined;
    searchOptions = [{label: 'All Types', value: ''}];

    @wire(getBoatTypes)
    boatTypes({ error, data }) {
        if (data) {
            console.log('# this.searchOptions 1 = ' + this.searchOptions);
            this.searchOptions = data.map(boatType => {
                console.log('# boatType = ' + JSON.stringify(boatType));

                return {label: boatType.Name, value: boatType.Name};
            });
            console.log('# this.searchOptions 2 = ' + JSON.stringify(this.searchOptions));
            this.searchOptions.unshift({ label: 'All Types', value: '' });
        } else if (error) {
            this.searchOptions = undefined;
            this.error = error;
        }
    }

    // Fires event that the search option has changed.
    // passes boatTypeId (value of this.selectedBoatTypeId) in the detail
    handleSearchOptionChange(event) {
        // Create the const searchEvent
        // searchEvent must be the new custom event search
        // searchEvent;
        // this.dispatchEvent(searchEvent);
    }
}
