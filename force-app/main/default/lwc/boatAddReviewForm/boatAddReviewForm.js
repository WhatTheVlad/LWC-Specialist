import {LightningElement, api} from "lwc";
import BOAT_REVIEW_OBJECT from '@salesforce/schema/BoatReview__c';
import NAME_FIELD from '@salesforce/schema/BoatReview__c.Name';
import COMMENT_FIELD from '@salesforce/schema/BoatReview__c.Comment__c';
import {ShowToastEvent} from "lightning/platformShowToastEvent";

const SUCCESS_TITLE = 'Review Created!';
const SUCCESS_VARIANT = 'success';

export default class BoatAddReviewForm extends LightningElement {
    // Private
    boatId;
    rating;
    boatReviewObject = BOAT_REVIEW_OBJECT;
    nameField        = NAME_FIELD;
    commentField     = COMMENT_FIELD;
    labelSubject = 'Review Subject';
    labelRating  = 'Rating';

     @api get recordId() {
         return this.boatId;
     }

    set recordId(value) {
        this.boatId = value;
        this.setAttribute('boatId', value);
    }

    handleRatingChanged(event) {
        this.rating = event.detail.rating;
    }

    handleSubmit(event) {
        event.preventDefault();
        const fields = event.detail.fields;
        fields.Boat__c = this.boatId;
        fields.Rating__c = this.rating;
        this.template.querySelector('lightning-record-edit-form').submit(fields);
    }

    handleSuccess(event) {
        const reviewId = event.detail.id;

        const toastEvent = new ShowToastEvent({
            title: SUCCESS_TITLE,
            message: 'Review created successfully',
            variant: SUCCESS_VARIANT
        });

        this.dispatchEvent(toastEvent);
        this.handleReset();

        const createReviewEvent = new CustomEvent('createreview', {detail: reviewId});
        this.dispatchEvent(createReviewEvent);
    }

    handleReset() {
         this.rating = 0;
        const inputFields = this.template.querySelectorAll('lightning-input-field');

         if (inputFields) {
             inputFields.forEach(field => {
                 field.reset();
             })
         }

    }
}
