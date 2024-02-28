import { LightningElement } from "lwc";
import { NavigationMixin } from 'lightning/navigation';

export default class BoatSearch extends NavigationMixin(LightningElement)
{

    isLoading = false;
    selectedBoatTypeId = '';

    connectedCallback()
    {
    }

    handleLoading() {
        this.isLoading = true;
    }

    handleDoneLoading() {
        this.isLoading = false;
    }

    searchBoats(event) {
        const boatTypeId = event.detail.boatTypeId;
        let boatSearchResultsComp = this.template.querySelector("c-boat-search-results");
        boatSearchResultsComp.searchBoats(boatTypeId);
    }

    createNewBoat() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Boat__c',
                actionName: 'new',
            },
        });
    }
}