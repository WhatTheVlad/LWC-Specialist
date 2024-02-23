import {LightningElement} from "lwc";
import { NavigationMixin } from 'lightning/navigation';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';

export default class BoatSearch extends NavigationMixin(LightningElement)
{

    isLoading = false;
    selectedBoatTypeId = '';

    handleLoading() {
        this.isLoading = true;
    }

    handleDoneLoading() {
        this.isLoading = false;
    }


    searchBoats(event) {
        this.selectedBoatTypeId = event.detail;
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