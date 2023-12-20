import { LightningElement ,wire,track} from 'lwc';
import getMetaData from '@salesforce/apex/CreateButtonsUsingCustomMetadataType.getMetaData';
import createDraftRecord from '@salesforce/apex/CreateButtonsUsingCustomMetadataType.createDraftRecord';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class CreateButtonsUsingCustomMetadata extends LightningElement {
   @track metadata = [];
   @track isModalOpen = false;
   @track showConfirmationModal = false;
   @track subject='';
   @track header='';
   @track FetchSubject1 =[];
   @track intervalId;
  
   //get metadata using wire method
    @wire(getMetaData)
    wiredData ({data, error}) {
        if (data) {
            this.metadata = data;
            this.metadata = data.map(button => ({ 
              ...button,
              style: `background-color: ${button.Colour__c};`,
          }));
           // console.log('metadata data=====>',JSON.stringify(this.metadata));
        } else if (error) {

           // console.error('error not found',error);
        }
    }
   //handle button click
     handleButtonClick(event){
        this.isModalOpen = true;
        const buttonId = event.target.dataset.key;
        //console.log('butttonid============'+ buttonId);
        const selectbutton = this.metadata.find((button)=>button.Id ===buttonId);
        this.subject=selectbutton.Subject__c;
        this.header = selectbutton.HeaderName__c;
        //console.log('subject==============',JSON.stringify(this.subject));
        //console.log('header=============',JSON.stringify(this.header));
        this.intervalId = setInterval(() => {
          if (!this.isModalOpen) {
              clearInterval(this.intervalId);
          } else {
              this.showToast();
          }
      }, 3000);
    }
    
       //action type field options
    ActionTypes = [{value : 'Perform Task',label : 'Perform Task'},
                  {value : 'Schedule Task', label : 'Schedule Task'},
                  {value : 'Do Task', label : 'Do Task'},];
     @track value = 'Perform Task';
      handleChange(event)
      {
        this.Value = event.target.value;
      }
      //hanhle rich test field
    handleChange(event)
    {
        this.richTest = event.target.value;
    }
    hideModal() {
      this.showConfirmationModal = true;
      if(this.showConfirmationModal = true){
          this.isModalOpen = false;
          //clearInterval(this.intervalId);
      }else{
          this.isModalOpen = true;
      }
  }
  handleCancelConfirmation() {
      this.showConfirmationModal = false;
      this.isModalOpen = true;
  }
  handleCancel() {
      this.subjectValue = '';
      this.isModalOpen = false;
      this.showConfirmationModal = false;
  }
    
    saveModal()
    {
      createDraftRecord({
        subject : this.subject,
        richTestData : this.richTest
      }).then(result => {
        //console.log('REsult=============',result);
        this.subject = '';
        this.isModalOpen = false;
        this.showToast();
    })
    .catch(error => {
        console.error('Error saving draft:', error);
        this.showErrorToast();
    });
    }
    showToast()
    {
      const event = new ShowToastEvent({
        title : 'success',
        message : 'Record created successfully',
        variant : 'success'

      });
      this.dispatchEvent(event);
    }
    showErrorToast()
    {
      const event = new ShowToastEvent({
        title : 'Error',
        message : ' error occur atRecord creation',
        variant : 'error'

      });
      this.dispatchEvent(event);
    }
    deleteModel()
    {
      this.isModalOpen = false;
    }
}
