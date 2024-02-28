import {LightningElement, track, wire} from "lwc";
import getBoatTypes from '@salesforce/apex/BoatDataService.getBoatTypes';

export default class BoatSearchForm extends LightningElement {
    selectedBoatTypeId = '';

    // Private
    error = undefined;
    @track searchOptions = [{label: 'All Types', value: ''}];

    @wire(getBoatTypes)
    boatTypes({ error, data }) {
        if (data) {
            this.searchOptions = data.map(boatType => {
                return {
                    label: boatType.Name, value: boatType.Id
                };
            });

            this.searchOptions.unshift({ label: 'All Types', value: '' });
        } else if (error) {
            this.searchOptions = undefined;
            this.error = error;
        }
    }

    handleSearchOptionChange(event) {
        this.selectedBoatTypeId = event.detail.value

        const searchEvent = new CustomEvent("search", {
                detail: {
                    boatTypeId: this.selectedBoatTypeId
                }
            });

        this.dispatchEvent(searchEvent);
    }
}
