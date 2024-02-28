import { LightningElement, wire, api } from 'lwc';
import { MessageContext, publish } from 'lightning/messageService';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getBoats from '@salesforce/apex/BoatDataService.getBoats';
import BoatMC from '@salesforce/messageChannel/BoatMessageChannel__c';
import { refreshApex } from '@salesforce/apex';
import updateBoatList from '@salesforce/apex/BoatDataService.updateBoatList';

const SUCCESS_TITLE = 'Success';
const MESSAGE_SHIP_IT = 'Ship it!';
const SUCCESS_VARIANT = 'success';
const ERROR_TITLE = 'Error';
const ERROR_VARIANT = 'error';

export default class BoatSearchResults extends LightningElement {
    selectedBoatId;
    boatTypeId = '';
    boats;
    isLoading = false;

    connectedCallback() { }

    @wire(MessageContext)
    messageContext;

    columns = [
        { label: 'Name', fieldName: 'Name', editable: true },
        { label: 'Length', fieldName: 'Length__c', type: 'number', editable: true },
        { label: 'Price', fieldName: 'Price__c', type: 'currency', editable: true },
        { label: 'Description', fieldName: 'Description__c', type: 'text', editable: true },
    ];

    @wire(getBoats, {boatTypeId : "$boatTypeId"})
    wiredBoats(result) {
        this.boats = result.data;

        if (result.error) {
            this.error = result.error;
            this.boats = undefined;
        }

        this.isLoading = false;
        this.notifyLoading(this.isLoading);
    }

    @api
    searchBoats(boatTypeId) {
        this.isLoading = true;
        this.notifyLoading(this.isLoading);
        this.boatTypeId = boatTypeId;
    }

    async refresh() {
        this.isLoading = true;
        this.notifyLoading(this.isLoading );

        await refreshApex(this.boats);

        this.isLoading = false;
        this.notifyLoading(this.isLoading);
    }

    updateSelectedTile(event) {
         this.selectedBoatId = event.detail.boatId;
         this.sendMessageService(this.selectedBoatId);
    }

    sendMessageService(boatId) {
        publish(this.messageContext, BoatMC, { recordId : boatId });
    }


    handleSave(event) {
        this.notifyLoading(true);

        const updatedFields = event.detail.draftValues;
        // Update the records via Apex
        updateBoatList({data: updatedFields})
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: SUCCESS_TITLE,
                        message: MESSAGE_SHIP_IT,
                        variant: SUCCESS_VARIANT
                    })
                )
                this.draftValues = [];
                return this.refresh();
            })
            .catch(error =>
            {
                this.error = error;

                this.dispatchEvent(
                    new ShowToastEvent({
                        title: ERROR_TITLE,
                        message: 'Ooops',
                        variant: ERROR_VARIANT
                    })
                )
            })
            .finally(() => {
                this.draftValues = [];
                this.notifyLoading(false);
            });
    }
    //Check the current value of isLoading before dispatching the doneloading or loading custom event

    notifyLoading(isLoading) {
        if (isLoading)
        {
            this.dispatchEvent(new CustomEvent('loading'));
        } else {
            this.dispatchEvent(new CustomEvent('doneloading'));
        }
    }

}
