import {LightningElement, api} from "lwc";
const TILE_WRAPPER_SELECTED_CLASS = 'tile-wrapper selected';
const TILE_WRAPPER_UNSELECTED_CLASS = 'tile-wrapper';

export default class BoatTile extends LightningElement {

    @api selectedBoatId;
    @api boat;

    // Getter for dynamically setting the background image for the picture
    get backgroundStyle() {
        return `background-image:url(${this.boat.Picture__c})`;
    }

    // Getter for dynamically setting the tile class based on whether the
    // current boat is selected
    get tileClass() {
        let tileClass = '';

        if (this.selectedBoatId !== '')
        {
            tileClass = TILE_WRAPPER_SELECTED_CLASS;
        } else {
            tileClass = TILE_WRAPPER_UNSELECTED_CLASS;
        }

        return tileClass;
    }

    // Fires event with the Id of the boat that has been selected.
    selectBoat() {
        this.selectedBoatId = '';

        const boatSelect = new CustomEvent("boatselect", {
            detail: {
                boatId : this.boat.Id
            }
        });

        this.dispatchEvent(boatSelect);
    }
}
