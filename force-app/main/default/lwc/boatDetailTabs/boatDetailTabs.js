import { LightningElement, wire, track, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

import {
    subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    MessageContext
} from 'lightning/messageService';

import labelDetails from '@salesforce/label/c.Details';
import labelReviews from '@salesforce/label/c.Reviews';
import labelAddReview from '@salesforce/label/c.Add_Review';
import labelFullDetails from '@salesforce/label/c.Full_Details';
import labelPleaseSelectABoat from '@salesforce/label/c.Please_select_a_boat';


import BOAT_OBJECT from '@salesforce/schema/Boat__c';
import BOAT_ID_FIELD from '@salesforce/schema/Boat__c.Id';
import BOAT_NAME_FIELD from '@salesforce/schema/Boat__c.Name';

const BOAT_FIELDS = [BOAT_ID_FIELD, BOAT_NAME_FIELD];

export default class BoatDetailTabs extends NavigationMixin(LightningElement) {
    boatId;

    @api label = {
        labelDetails,
        labelReviews,
        labelAddReview,
        labelFullDetails,
        labelPleaseSelectABoat,
    };

    @wire(MessageContext)
    messageContext;

    @wire(getRecord, {recordId : '$boatId', fields: BOAT_FIELDS})
    wiredRecord;

    get detailsTabIconName() {
        if (this.wiredRecord.data) {
            return 'utility:anchor';
        }

        return null;
    }

    get boatName() {
        return getFieldValue(this.wiredRecord.data, BOAT_NAME_FIELD)
    }

    // Private
    subscription = null;


    subscribeMC() {
        this.subscription = subscribe(
            this.messageContext,
            BOATMC,
            (message) => this.boatId = message.recordId,
            {scope: APPLICATION_SCOPE}
        );

    }

    connectedCallback() {
        this.subscribeMC()
    }

    navigateToRecordViewPage() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.boatId,
                objectApiName: BOAT_OBJECT,
                actionName: 'view'
            }
        })
    }

    handleReviewCreated() {
        this.template.querySelector("lightning-tabset").activeTabValue = 'reviews';
        this.template.querySelector("c-boat-reviews").refresh();
    }
}
